from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status, viewsets
from api.models.models import User
from django.utils import timezone
from ..models.models import StreamerProfile, StreamerSettings, StreamCategory
from ..serializers import StreamerProfileSerializer, StreamerSettingsSerializer, StreamerProfileSerializerFull, ToggleBanSeriazlizer, DeactivateReasonSerializer
from uuid import uuid4


STREAM_KEY_PREFIX = 'jasma_live_'

@api_view(["GET"])
@permission_classes([AllowAny])
def get_streamer_profile(request, user_id):

    profile = StreamerProfile.objects.filter(user_id=user_id).first()

    if not profile:
        return Response({"message": f"User {user_id} hasn't created their streamer profile yet."}, status=status.HTTP_404_NOT_FOUND)

    serializer = StreamerProfileSerializerFull(profile)
    
    return Response({"message": f"Success.", 'data': {"streamer_profile": serializer.data}}, status=status.HTTP_200_OK)
    


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_streamer_profile(request):

    prev_profile = StreamerProfile.objects.filter(user=request.user).first()
    
    if prev_profile:
        return Response({"message": "User has already created streamer profile."}, status=status.HTTP_400_BAD_REQUEST)

    stream_key = STREAM_KEY_PREFIX + uuid4().hex
    profile = StreamerProfile.objects.create(user=request.user, stream_key=stream_key)
    settings = StreamerSettings.objects.create(profile=profile)
    settings.save()
    profile.save()

    serializer = StreamerProfileSerializer(profile)

    payload = {"message": f"Streamer profile for {request.user.username} created successfully.",
               "data": {"profile": serializer.data}}
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
            reason = ToggleBanSeriazlizer(data=request.data)
            reason.is_valid(raise_exception=True)
            profile.update(is_banned=True, last_banned_at=timezone.now(), updated_at=timezone.now(),
                            last_ban_reason=reason.validated_data["last_ban_reason"])
            
            return Response({"message": f"User {user_to_ban.username} has been banned successfully!"},status=status.HTTP_200_OK)
        else:
            profile.update(is_banned=False, updated_at=timezone.now())    
            return Response({"message": f"User {user_to_ban.username} has been unbanned successfully!"},status=status.HTTP_200_OK)
    

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def generate_new_stream_key(request):

    new_stream_key = STREAM_KEY_PREFIX + uuid4().hex
    profile = StreamerProfile.objects.filter(user=request.user)

    if not hasattr(request.user, 'streamerprofile'):
        return Response({"message": f"User hasn't created their streamer profile yet."}, status=status.HTTP_400_BAD_REQUEST)
    
    profile = request.user.streamerprofile
    if profile.is_banned or not profile.is_active:
        return Response({"message": f"Unfortunately, profile has been banned or deactivated."}, status=status.HTTP_400_BAD_REQUEST)
    elif profile.is_live:
        return Response({"message": f"Streamer is live, finish the stream first then try again."}, status=status.HTTP_400_BAD_REQUEST)
    
    profile.stream_key = new_stream_key
    profile.save()

    payload = {"message": f"User's stream key has been updated successfully!", 
               "data": {"stream_key": new_stream_key}
               }

    return Response(payload,status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def toggle_is_active(request):

    profile = StreamerProfile.objects.filter(user=request.user)
    
    if not profile.first():
        return Response({"message": f"User hasn't created their streamer profile yet."}, status=status.HTTP_400_BAD_REQUEST)
    elif profile.first().is_banned:
        return Response({"message": f"Unfortunately, profile has been banned."}, status=status.HTTP_400_BAD_REQUEST)
    elif profile.first().is_live:
        return Response({"message": f"User is currently live. Finish your stream first then try again."}, status=status.HTTP_400_BAD_REQUEST)
        

    if profile.first().is_active:
        reason = DeactivateReasonSerializer(data=request.data)
        reason.is_valid(raise_exception=True)
        profile.update(is_active=False, deactivated_at=timezone.now(), updated_at=timezone.now(),
                       deactivate_reason_description=reason.validated_data)
        
        return Response({"message": f"Profile has been deactivated successfully!."}, status=status.HTTP_200_OK)
    else:
        profile.update(is_active=True, updated_at=timezone.now())

        return Response({"message": f"Profile has been activated successfully!."}, status=status.HTTP_200_OK)
        
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile_settings(request):
    serializer = StreamerSettingsSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    settings_obj = StreamerSettings.objects.filter(profile=request.user.streamerprofile)
    # Get category by id
    category = StreamCategory.objects.filter(id=serializer.data["next_stream_category"]).first()
    settings_obj.update(next_stream_title=serializer.validated_data["next_stream_title"], 
                                  updated_at=timezone.now(), next_stream_category=category)
    request.user.streamerprofile.save()
    # Return success response
    payload = {"message": f"Profile settings have been updated successfully.", 'data': {"profile_settings": serializer.data}}
    return Response(payload, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_follow(request, id):
    profile_obj = StreamerProfile.objects.filter(user_id=id).first()
    user_obj = request.user


    if not profile_obj:
        return Response({"message": f"User {id} doesn't exist."}, status=status.HTTP_404_NOT_FOUND)

    if profile_obj.user == user_obj:
        return Response({"message": "You cannot follow your own account."}, status=status.HTTP_400_BAD_REQUEST)
    
    following = profile_obj.followed_by.all()
    if user_obj in following:
        profile_obj.followed_by.remove(user_obj.id)
        profile_obj.followers_count -= 1
        user_obj.followed_streamers_count -= 1
            
    else:
        if profile_obj.is_banned or not profile_obj.is_active:
            return Response({"message": "You cannot follow banned or inactive accounts."}, status=status.HTTP_400_BAD_REQUEST)
        profile_obj.followed_by.add(user_obj.id)
        profile_obj.followers_count += 1
        user_obj.followed_streamers_count += 1

    profile_obj.save()
    user_obj.save()

    return Response({"message": "Action successfull!"}, status=status.HTTP_200_OK)
