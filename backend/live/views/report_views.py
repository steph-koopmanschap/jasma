from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from ..models.models import StreamReport, StreamLive, StreamerProfile
from django.utils import timezone
from ..serializers import StreamReportSerializer



class StreamReportsList(viewsets.ModelViewSet):
    model = StreamReport
    queryset = StreamReport.objects.all()
    serializer_class = StreamReportSerializer
    permission_classes = [IsAdminUser]

    def list(self, request, *args, **kwargs):
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

    stream_to_report = StreamLive.objects.filter(id=request.data["stream"]).first()
    profile_to_report = StreamerProfile.objects.filter(user_id=request.data["profile"]).first()

    if not stream_to_report or not profile_to_report:
        return Response({"message": "Such stream or streamer profile doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)

    report = StreamReport.objects.create(**serializer.validated_data, issued_by=request.user, stream=stream_to_report, profile=profile_to_report)

    # Return success response
    payload = {"message": f"Report {report.id} has been created successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)
