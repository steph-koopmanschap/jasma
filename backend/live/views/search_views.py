from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from ..models.models import StreamerProfile, StreamReport, StreamCategory
from ..paginators import StrandartListPaginator
from api.models.models import User
from api.serializers import UserFullSerializer
from datetime import datetime,timedelta

from ..serializers import  StreamCategorySerializerGet, StreamerProfileSerializerFull, StreamReportSerializerGet

@api_view(["GET"])
@permission_classes([AllowAny])
def search_query(request):
    term = request.GET.get('search_term')

    results = []
    if term:
        users = User.objects.filter(username__startswith=term, streamerprofile__isnull=False)[:3]
        categories = StreamCategory.objects.filter(title__startswith=term.capitalize())[:2]

        users_ser = UserFullSerializer(users, many=True)
        categories_ser = StreamCategorySerializerGet(categories, many=True)
        results.append(users_ser.data)
        results.append(categories_ser.data)
        
    else:
        results = []

    return Response({'data': {"results": results}}, status=status.HTTP_200_OK)
    

class StreamersListAll(ListAPIView):
    
    pagination_class = StrandartListPaginator
    permission_classes = [AllowAny]
    serializer_class = StreamerProfileSerializerFull

    def get(self,request,*args,**kwargs):
        queryset=StreamerProfile.objects.all()

        #Custom Filters Parameters

        user_id=self.request.query_params.get('user_id',None)
        is_active=self.request.query_params.get('is_active',None)
        is_banned=self.request.query_params.get('is_banned',None)
        is_live=self.request.query_params.get('is_live', None)
        ban_reason=self.request.query_params.get('ban_reason', None)
        total_views_count_from = self.request.query_params.get('total_views_count_from', None)
        total_views_count_to = self.request.query_params.get('total_views_count_to', None)
        order_by=self.request.query_params.get('order_by',None)

        created_at_from=self.request.query_params.get('created_at_from',None)
        created_at_to=self.request.query_params.get('created_at_to',None)

        deactivated_at_from =self.request.query_params.get('deactivated_at_from',None)
        deactivated_at_to =self.request.query_params.get('deactivated_at_to',None)
        last_banned_at_from =self.request.query_params.get('last_banned_at_from',None)
        last_banned_at_to =self.request.query_params.get('last_banned_at_to',None)

        if user_id: # check if key is not None
            queryset=queryset.filter(user_id=user_id)

        if order_by:
            queryset=queryset.order_by(f"-{order_by}") 

        if is_live:
            queryset=queryset.filter(is_live=is_live)
        
        
        # If user is not admin, return here
        if request.user.is_staff == False:
            serializer=self.get_serializer(queryset,many=True)
            return Response({"data": {"results": serializer.data}}, status=status.HTTP_200_OK )

        if is_active: # check if key is not None
            queryset=queryset.filter(is_active=is_active)

        if is_banned:
            queryset=queryset.filter(is_banned=is_banned) 
        
        if ban_reason:
            queryset=queryset.filter(last_ban_reason=ban_reason) 

        if total_views_count_from and total_views_count_to:
            queryset=queryset.filter(total_views_count__range=[total_views_count_from, total_views_count_to + 1]) 

        # Date Filters

        if created_at_from and created_at_to: # check if key is not None
            date_format='%d-%m-%Y'
            from_date=datetime.strptime(created_at_from,date_format) #Convert string into date format
            to_date=datetime.strptime(created_at_to,date_format)
            to_date=to_date+timedelta(days=1) # add extra day in date search
            queryset=queryset.filter(created_at__range=[from_date,to_date]) 

        if deactivated_at_from and deactivated_at_to: # check if key is not None
            date_format='%d-%m-%Y'
            from_date=datetime.strptime(deactivated_at_from,date_format) #Convert string into date format
            to_date=datetime.strptime(deactivated_at_to,date_format)
            to_date=to_date+timedelta(days=1) # add extra day in date search
            queryset=queryset.filter(deactivated_at__range=[from_date,to_date]) 
        
        if last_banned_at_from and last_banned_at_to: # check if key is not None
            date_format='%d-%m-%Y'
            from_date=datetime.strptime(last_banned_at_from,date_format) #Convert string into date format
            to_date=datetime.strptime(last_banned_at_to,date_format)
            to_date=to_date+timedelta(days=1) # add extra day in date search
            queryset=queryset.filter(last_banned_at__range=[from_date,to_date]) 



        

        serializer=self.get_serializer(queryset,many=True)

        return Response({"data": {"results": serializer.data}}, status=status.HTTP_200_OK )
    

class ReportsListAll(ListAPIView):
    
    pagination_class = StrandartListPaginator
    permission_classes = [IsAdminUser]
    serializer_class = StreamReportSerializerGet

    def get(self,request,*args,**kwargs):
        queryset=StreamReport.objects.all()

        #Custom Filters Parameters

        issued_by=self.request.query_params.get('issued_by',None)
        report_reason=self.request.query_params.get('report_reason',None)
        reported_profile_id=self.request.query_params.get('reported_profile_id',None)
        reported_stream_id=self.request.query_params.get('reported_stream_id', None)
      

        created_at_from=self.request.query_params.get('created_at_from',None)
        created_at_to=self.request.query_params.get('created_at_to',None)

       

        if issued_by: # check if key is not None
            queryset=queryset.filter(issued_by=issued_by)

        if report_reason: # check if key is not None
            queryset=queryset.filter(report_reason=report_reason)

        if reported_profile_id:
            queryset=queryset.filter(reported_profile_id=reported_profile_id)
               

        if reported_stream_id:
            queryset=queryset.filter(reported_stream_id=reported_stream_id)      

        # Date Filters

        if created_at_from and created_at_to: # check if key is not None
            date_format='%d-%m-%Y'
            from_date=datetime.strptime(created_at_from,date_format) #Convert string into date format
            to_date=datetime.strptime(created_at_to,date_format)
            to_date=to_date+timedelta(days=1) # add extra day in date search
            queryset=queryset.filter(created_at__range=[from_date,to_date]) 

       
       

        serializer=self.get_serializer(queryset,many=True)

        return Response({"data": {"results": serializer.data}}, status=status.HTTP_200_OK )