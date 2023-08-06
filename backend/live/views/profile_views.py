from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, viewsets
from api.models.models import User
from ..models.models import StreamerProfile
from ..serializers import StreamerProfileSerializer
from uuid import uuid4


STREAM_KEY_PREFIX = 'jasma_live_'

class StreamerProfilesList(viewsets.ModelViewSet):
    model = StreamerProfile
    queryset = StreamerProfile.objects.all()
    serializer_class = StreamerProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)
        stream_profiles = serializer.data

        payload = {'data': {"stream_profiles": stream_profiles}}

        return Response(payload, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_streamer_profile(request):

    prev_profile = StreamerProfile.objects.filter(user=request.user).first()

    if prev_profile:
        return Response({"message": "User has already created streamer profile."}, status=status.HTTP_400_BAD_REQUEST)

    stream_key = STREAM_KEY_PREFIX + uuid4().hex
    profile = StreamerProfile.objects.create(user=request.user, stream_key=stream_key)

    profile.save()

    payload = {"message": f"Streamer profile for {request.user.username} created successfully.",
               "profile": profile}
    return Response(payload, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def toggle_ban_streamer_profile(request, id):
    user_to_ban = User.objects.filter(id=id).first()

    if not user_to_ban:
        return Response({"message": f"User {id} doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    
    profile = StreamerProfile.objects.filter(user=user_to_ban)

    if not profile.first():
        return Response({"message": f"User {user_to_ban.username} hasn't created their streamer profile yet."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if not profile.first().is_banned:
            profile.update(is_banned=True)
            return Response({"message": f"User {user_to_ban.username} has been banned successfully!"},status=status.HTTP_200_OK)
        else:
            profile.update(is_banned=False)    
            return Response({"message": f"User {user_to_ban.username} has been unbanned successfully!"},status=status.HTTP_200_OK)
    

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def generate_new_stream_key(request):

    new_stream_key = STREAM_KEY_PREFIX + uuid4().hex
    profile = StreamerProfile.objects.filter(user=request.user)

    if not profile.first():
        return Response({"message": f"User hasn't created their streamer profile yet."}, status=status.HTTP_400_BAD_REQUEST)
    elif profile.first().is_banned:
        return Response({"message": f"Unfortunately, profile has been banned."}, status=status.HTTP_400_BAD_REQUEST)
    
    profile.update(stream_key=new_stream_key)

    payload = {"message": f"User's stream key has been updated successfully!", 
               "data": {"stream_key": new_stream_key}
               }

    return Response(payload,status=status.HTTP_200_OK)



    