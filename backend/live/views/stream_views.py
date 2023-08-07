from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from ..models.models import StreamerProfile, StreamLive, StreamerSettings
from math import floor

@csrf_exempt
@api_view(["GET"])
@permission_classes([AllowAny])
def start_stream(request):
    print(request.GET)
    stream_key = request.GET['name']
    type = request.GET['type']

    if not stream_key or not type:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Find streamer profile and check it first
    profile_ent = StreamerProfile.objects.filter(stream_key=stream_key)
    profile = profile_ent.first()

    if not profile or not profile.is_active or profile.is_banned or profile.is_live:
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    # Check User auth
    if not profile.user.is_authenticated:
        return Response(status=status.HTTP_403_FORBIDDEN)
        

    #Get defaults from user's settings
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
    print(request.GET)
    stream_key = request.GET['name']
    type = request.GET['type']

    if not stream_key or not type:
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

    profile_ent.update(is_live=False, total_stream_time=total_time)

    return Response(status=status.HTTP_200_OK)
