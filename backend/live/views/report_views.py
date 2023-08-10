from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.generics import ListCreateAPIView
from ..models.models import StreamReport, StreamLive, StreamerProfile
from ..serializers import StreamReportSerializer, StreamReportSerializerGet
from ..paginators import StrandartListPaginator


class StreamReportsList(ListCreateAPIView):
    model = StreamReport
    queryset = StreamReport.objects.all()
    serializer_class = StreamReportSerializerGet
    permission_classes = [IsAdminUser]
    pagination_class = StrandartListPaginator

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        reports = serializer.data

        # Customize the response format
        payload = {'data': {"stream_reports": reports}}

        return Response(payload, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_stream_report(request):
    serializer = StreamReportSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    stream_to_report = StreamLive.objects.filter(id=request.data["reported_stream"]).first()
    
    profile_to_report = stream_to_report.streamer
    
    if not profile_to_report:
        return Response({"message": "Such streamer profile doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if this user has already created report for this streamer
    if request.user.streamers_reported.filter(reported_profile=profile_to_report).first():
        return Response({"message": "You've already reported this channel"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if report is valid
    if hasattr(request.user, 'streamerprofile'):
        my_profile = request.user.streamerprofile
        is_my_stream = my_profile.streams.filter(id=stream_to_report.id).first()
        if my_profile == profile_to_report or is_my_stream:
            return Response({"message": "You cannot report your own account or stream"}, status=status.HTTP_400_BAD_REQUEST)



    report = StreamReport.objects.create(issued_by=request.user, reported_stream=stream_to_report, reported_profile=profile_to_report, 
                                         report_reason=serializer.data['report_reason'])
    report.save()

    # Return success response
    payload = {"message": f"Report {report.id} has been created successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_report(request, id):

    report = StreamReport.objects.filter(id=id).first()

    if not report:
        return Response({"message": f"Report {id} doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    report.delete()

    return Response({"message": f"Report {id} has been deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def clear_all_reports(request, user_id):

    profile = StreamerProfile.objects.filter(user=user_id).first()

    if not profile:
        return Response({"message": f"User doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    if not profile.reported:
        return Response({"message": f"User's profile doesn't have reports to clear."}, status=status.HTTP_404_NOT_FOUND)

    profile.reported.all().delete()

    return Response({"message": f"All user reports have been cleared."}, status=status.HTTP_204_NO_CONTENT)

        
