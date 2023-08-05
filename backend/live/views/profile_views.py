from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from ..models.models import StreamerProfile
from uuid import uuid4

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_streamer_profile(request):

    prev_profile = StreamerProfile.objects.filter(user=request.user).first()

    if prev_profile:
        return Response({"message": "User has already created streamer profile."}, status=status.HTTP_400_BAD_REQUEST)

    stream_key = "jasma_live_" + uuid4().hex
    profile = StreamerProfile.objects.create(user=request.user, stream_key=stream_key)

    profile.save()

    payload = {"message": f"Streamer profile for {request.user.username} created successfully.",
               "profile": profile}
    return Response(payload, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def toggle_ban_streamer_profile(request):
    user_id = request.POST['user_id']
    user_to_ban = User.objects.filter(id=user_id).first()
    profile = StreamerProfile.objects.filter(user=user_to_ban)

    if not user_to_ban:
        return Response({"message": f"User {user_id} doesn't exist."}, status=status.HTTP_404_NOT_FOUND)
    elif not profile:
        return Response({"message": f"User {user_to_ban.username} hasn't created their streamer profile yet."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if profile['is_banned']:
            profile.update(is_banned=True)
            return Response({"message": f"User {user_to_ban.username} has been banned successfully!"},status=status.HTTP_200_OK)
        else:
            profile.update(is_banned=False)    
            return Response({"message": f"User {user_to_ban.username} has been unbanned successfully!"},status=status.HTTP_200_OK)
    
