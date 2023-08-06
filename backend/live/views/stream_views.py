from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, viewsets
from api.models.models import User
from ..models.models import StreamerProfile
from ..serializers import StreamerProfileSerializer
from uuid import uuid4


@api_view(["POST"])
@permission_classes([AllowAny])
def start_stream(request):
    print(request.data)
    
    return Response({"message": "Stream has started"}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def end_stream(request):
    print(request.data)