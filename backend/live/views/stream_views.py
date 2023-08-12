from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime,timedelta
from django.utils import timezone
from ..models.models import StreamerProfile, StreamLive, StreamerSettings, StreamCategory
from math import floor
from ..serializers import StreamLiveSerializer, StreamLiveSerializerUpdate
from ..paginators import StrandartStreamsPaginator

@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def start_stream(request):
    stream_key = request.GET['name']

    if not stream_key:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Find streamer profile and check it first
    profile_ent = StreamerProfile.objects.filter(stream_key=stream_key)
    profile = profile_ent.first()

    if not profile or not profile.is_active or profile.is_banned or profile.is_live:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Check User auth
    if not profile.user.is_authenticated:
        return Response(status=status.HTTP_403_FORBIDDEN)
        

    # Get defaults from user's settings
    settings = StreamerSettings.objects.filter(profile=profile).first()
  
    stream_record = StreamLive.objects.create(title=settings.next_stream_title, category=settings.next_stream_category, 
                                              streamer=profile)
    profile_ent.update(last_live_time=timezone.now(), is_live=True)    

    stream_record.save()

    
    return Response(status=status.HTTP_200_OK)


@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def end_stream(request):
    stream_key = request.GET['name']

    if not stream_key:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Find streamer profile and check it first
    profile_ent = StreamerProfile.objects.filter(stream_key=stream_key)
    profile = profile_ent.first()

    if not profile:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Get current stream. This should have null at ended_at field since stream is still going.
    stream_record_ent = StreamLive.objects.filter(streamer=profile, ended_at=None)
    stream_record = stream_record_ent.first()
    if not stream_record:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    stream_record_ent.update(ended_at=timezone.now())

    total_time = profile.total_stream_time + floor((timezone.now() - stream_record.started_at).total_seconds())

    profile_ent.update(is_live=False, total_stream_time=total_time, last_live_time=timezone.now())

    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_total_views(request, id):

    # Find current stream
    stream_record = StreamLive.objects.filter(id=id)

    if not stream_record.first():
        return Response(status=status.HTTP_404_NOT_FOUND)

    # If stream is still live then update else silently fail
    if not stream_record.first().ended_at:
        # Update current stream record, streamer profile and category
        profile = StreamerProfile.objects.filter(user=stream_record.first().streamer.user).first()
        profile.total_views_count += 1
        profile.save()

        if stream_record.first().category:
            category = StreamCategory.objects.filter(id=stream_record.first().category.id).first()
            category.total_views_count += 1
            category.save()
            

        stream_record.update(total_views_count=stream_record.first().total_views_count + 1)
    
    return Response(status=status.HTTP_200_OK)




    
class LiveStreamsAll(ListCreateAPIView):
    
    pagination_class = StrandartStreamsPaginator
    permission_classes = [AllowAny]
    serializer_class = StreamLiveSerializer

    def get(self,request,*args,**kwargs):
        queryset=StreamLive.objects.all()

        #Custom Filters Parameters

        streamer=self.request.query_params.get('streamer',None)
        title=self.request.query_params.get('title',None)
        category=self.request.query_params.get('category',None)
        order_by=self.request.query_params.get('order_by',None)
        is_live=self.request.query_params.get('is_live', None)

        started_at_from=self.request.query_params.get('started_at_from',None)
        started_at_to=self.request.query_params.get('started_at_to',None)

        if streamer: # check if key is not None
            queryset=queryset.filter(streamer=streamer)

        if title: # check if key is not None
            queryset=queryset.filter(title__startswith=title)

        if is_live:
            queryset=queryset.filter(ended_at=None)

        # Date Filters

        if started_at_from and started_at_to: # check if key is not None
            date_format='%d-%m-%Y'
            from_date=datetime.strptime(started_at_from,date_format) #Convert string into date format
            to_date=datetime.strptime(started_at_to,date_format)
            to_date=to_date+timedelta(days=1) # add extra day in date search
            queryset=queryset.filter(started_at__range=[from_date,to_date]) 

        if category:
            queryset=queryset.filter(category=category) 
        
        if order_by :
            queryset=queryset.order_by(f"-{order_by}") 

        serializer=self.get_serializer(queryset,many=True)

        return Response({"data": {"results": serializer.data}}, status=status.HTTP_200_OK )

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_current_stream_info(request, id):
    
    profile = request.user.streamerprofile

    if profile.is_banned or not profile.is_active:
        return Response({"message": "Unfortunately, your profile was banned or deactivated"}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = StreamLiveSerializerUpdate(data=request.data)
    serializer.is_valid(raise_exception=True)
    current_stream = profile.streams.filter(id=id)

    if not current_stream.first().ended_at:
        current_stream.update(**serializer.validated_data)
        serializer_full = StreamLiveSerializer(current_stream.first())
        
        return Response({"message": "Stream info has been updated successfully!", 
                         "data": {"live_stream": serializer_full.data} }, status=status.HTTP_200_OK)
    else:
        return Response({"message": "Cannot update ended stream"}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_share_count(request, id):

    current_stream = StreamLive.objects.filter(id=id).first()

    # If not valid, fail silently
    if current_stream and current_stream.ended_at == None:
        current_stream.shared_count += 1
        current_stream.save()

    return Response({"message": "Success!"}, status=status.HTTP_200_OK)


