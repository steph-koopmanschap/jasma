from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, viewsets
from api.models.models import User
from django.http import HttpResponse
from ..models.models import StreamerProfile
from ..serializers import StreamerProfileSerializer
from uuid import uuid4


def start_stream(request):
    print(request.POST)
    
    return HttpResponse("OK")



def end_stream(request):
    print(request.data)