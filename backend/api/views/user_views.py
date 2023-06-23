import datetime
import json

from django.conf import settings
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from api.utils.request_method_wrappers import post_wrapper, put_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.utils.handle_file_save import handle_file_save
from api.utils.handle_file_delete import handle_file_delete
from api.utils.staff_auth_wrappers import admin_required

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import DjangoModelPermissions, DjangoObjectPermissions
from rest_framework.decorators import action

from api.constants import user_roles
from api.models import User, UserProfile, UserNotificationPreferences
from api.serializers import UserCustomSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserCustomSerializer
    permission_classes = [DjangoModelPermissions, DjangoObjectPermissions]

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        # List reuqested fields
        requested_fields = [
            field.strip() for field
            in request.GET.get("fields", "").split(",")
        ]
        # List serializer fields
        serializer = self.get_serializer(user)

        payload = {"data": serializer.data}
        
        # Trigger a warning message if requested field don't exist
        missing_fields = [
            field for field 
            in requested_fields 
            if field not in serializer.fields.keys()
        ]
        if missing_fields:
            warning = f"Warning could not find {', '.join(missing_fields)}."
            payload["message"] = warning

        return Response(payload)



# Get info of a user.
# What info is returned is provided by the query
# ID, Usermame, email, and role are provided automatically
# NOTE: Make sure no private data of the user can be obtained
@get_wrapper
def get_user(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "No valid user id provided"},
                            status=HTTP_STATUS["BAD_REQUEST"])

    user = User.objects.get(id=user_id)
    if not user:
        return JsonResponse({"success": False, "message": "No user found"},
                            status=HTTP_STATUS["NOT_FOUND"])

    user_profile = UserProfile.objects.get(user=user)
    user_notif_preferences = UserNotificationPreferences.objects.get(user=user)

    returned_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.user_role
    }

    attributes = request.GET.get('attributes').split('+')
    for attribute in attributes:
        if hasattr(user, attribute):
            returned_dict[attribute] = getattr(user, attribute)
        if hasattr(user_profile, attribute):
            returned_dict[attribute] = getattr(user_profile, attribute)
        if hasattr(user_notif_preferences, attribute):
            returned_dict[attribute] = getattr(
                user_notif_preferences, attribute)

    return JsonResponse({"success": True, "user": returned_dict},
                        status=HTTP_STATUS["OK"])

@login_required
@get_wrapper
def get_loggedin_user(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    user_notif_preferences = UserNotificationPreferences.objects.get(user=user)

    returned_dict = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.user_role
    }

    attributes = request.GET.get('attributes').split('+')
    for attribute in attributes:
        if hasattr(user, attribute):
            returned_dict[attribute] = getattr(user, attribute)
        if hasattr(user_profile, attribute):
            returned_dict[attribute] = getattr(user_profile, attribute)
        if hasattr(user_notif_preferences, attribute):
            returned_dict[attribute] = getattr(
                user_notif_preferences, attribute)

    return JsonResponse({"success": True, "user": returned_dict},
                        status=HTTP_STATUS["OK"])

# NOTE: NOT DONE YET
@login_required
@put_wrapper
def update_user(request):
    req = json.loads(request.body)
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    user_notif_preferences = UserNotificationPreferences.objects.get(user=user)

    # UserProfile.objects.get(user=user).update(**req)
    # TODO: Add some email verification first?
    email = req['email']
    if email:
        user.email = email

    recovery_email = req["recovery_email"]
    if recovery_email:
        user.recovery_email = recovery_email

    phone = req["phone"]
    if phone:
        user.phone = phone

    recovery_phone = req["recovery_phone"]
    if recovery_phone:
        user.recovery_phone = recovery_phone

    # Update user profile
    given_name = req["given_name"]
    # TODO: Make user can only change their given name every 30 days.
    if given_name:
        user_profile.given_name = given_name

    last_name = req["last_name"]
    # TODO: Make user can only change their last name every 30 days.
    if last_name:
        user_profile.last_name = last_name

    display_name = req["display_name"]
    if display_name:
        user_profile.display_name = display_name

    bio = req["bio"]
    if bio:
        user_profile.bio = bio
    date_of_birth = req["date_of_birth"]

    # TODO: Make user can only change their date of birthday every 30 days.
    if date_of_birth:
        user_profile.date_of_birth = date_of_birth

    gender = req["gender"]
    if gender:
        user_profile.gender = gender

    relationship = req["relationship"]
    if relationship:
        user_profile.relationship = relationship

    relationship_with = req["relationship_with"]
    for person in relationship_with:
        user_profile.relationship_with.add(person)

    language = req["language"]
    if language:
        user_profile.language = language

    country = req["country"]
    if country:
        user_profile.country = country

    city = req["city"]
    if city:
        user_profile.city = city

    website = req["website"]
    if website:
        user_profile.website = website

    # Update notification settings
    is_all_email = req["is_all_email"]
    if is_all_email:
        user_notif_preferences.is_all_email = is_all_email

    is_all_push = req["is_all_push"]
    if is_all_push:
        user_notif_preferences.is_all_push = is_all_push

    is_all_inapp = req["is_all_inapp"]
    if is_all_inapp:
        user_notif_preferences.is_all_inapp = is_all_inapp

    is_comment_on_post_email = req["is_comment_on_post_email"]
    if is_comment_on_post_email:
        user_notif_preferences.is_comment_on_post_email = is_comment_on_post_email

    is_new_follower_email = req["is_new_follower_email"]
    if is_new_follower_email:
        user_notif_preferences.is_new_follower_email = is_new_follower_email

    is_comment_on_post_push = req["is_comment_on_post_push"]
    if is_comment_on_post_push:
        user_notif_preferences.is_comment_on_post_push = is_comment_on_post_push

    is_new_follower_push = req["is_new_follower_push"]
    if is_new_follower_push:
        user_notif_preferences.is_new_follower_push = is_new_follower_push

    is_comment_on_post_inapp = req["is_comment_on_post_inapp"]
    if is_comment_on_post_inapp:
        user_notif_preferences.is_comment_on_post_inapp = is_comment_on_post_inapp

    is_new_follower_inapp = req["is_new_follower_inapp"]
    if is_new_follower_inapp:
        user_notif_preferences.is_new_follower_inapp = is_new_follower_inapp

    user.save()
    user_profile.save()
    user_notif_preferences.save()
    return JsonResponse({"success": True, "message": "User updated successfully."},
                        status=HTTP_STATUS["Created"])

# Soft delete a user.
@login_required
@delete_wrapper
def delete_user(request):
    user = request.user
    user.email_verified = False
    user.recovery_email = ""
    user.phone = ""
    user.recovery_phone = ""
    user.last_ipv4 = "0.0.0.0"
    user.user_role = "deleted"
    user.is_active = False
    user.deleted_at = datetime.datetime.now()

    user_profile = UserProfile.objects.get(user=user)
    user_profile = UserProfile.objects.get(user=user)
    user_profile.profile_pic_url = f"{settings.MEDIA_URL}images/avatars/default-profile-pic.webp"
    user_profile.given_name = "Deleted User"
    user_profile.last_name = "Deleted User"
    user_profile.display_name = "Deleted User"
    user_profile.bio = "Deleted User"
    user_profile.date_of_birth = None
    user_profile.gender = None
    user_profile.relationship = None
    user_profile.relationship_with.clear()
    user_profile.language = None
    user_profile.country = None
    user_profile.city = None
    user_profile.website = None

    user_notification_preferences = UserNotificationPreferences.objects.get(
        user=user)
    user_notification_preferences.is_all_email = False
    user_notification_preferences.is_all_push = False
    user_notification_preferences.is_all_inapp = False
    user_notification_preferences.is_comment_on_post_email = False
    user_notification_preferences.is_new_follower_email = False
    user_notification_preferences.is_comment_on_post_push = False
    user_notification_preferences.is_new_follower_push = False
    user_notification_preferences.is_comment_on_post_inapp = False
    user_notification_preferences.is_new_follower_inapp = False

    user_notification_preferences.save()
    user_profile.save()
    user.save()
    return JsonResponse({"success": True, "message": "User deleted successfully."},
                        status=HTTP_STATUS["OK"])

# NOTE: MAYBE BETTER TO MERGE THIS WITH change_user_role() function
# NOTE: THIS FUNCTION IS NOT COMPLETE YET.
# TODO: FINISH THIS FUNCTION
# Suspend a user by an x amount of time
# @login_required
# @admin_required
# @put_wrapper
# def suspend_user(request):
#     req = json.loads(request.body)
#     user_id = req['user_id']
#     expiration_date = req['expiration_date']
#     user = User.objects.get(id=user_id)
@login_required
@admin_required
@put_wrapper
def change_user_role(request):
    req = json.loads(request.body)
    user_id = req['user_id']
    role = req['role']
    if role not in user_roles.LIST or not user_id:
        return JsonResponse({"success": False, "message": "Invalid user role."},
                            status=HTTP_STATUS["Bad Request"])
    user = User.objects.get(id=user_id)
    user.user_role = role
    user.save()
    return JsonResponse({"success": True, "message": "User role changed successfully."},
                        status=HTTP_STATUS["OK"])

@get_wrapper
def get_profile_pic(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "User ID is None or undefined."},
                            status=HTTP_STATUS["Bad Request"])
    user = User.objects.get(id=user_id)
    user_profile = UserProfile.objects.get(user=user)
    user_profile = UserProfile.objects.get(user=user)
    return JsonResponse({"success": True, 'profile_pic_url': user_profile.profile_pic_url})

@csrf_exempt
@login_required
@post_wrapper
def upload_profile_pic(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)
    user_profile = UserProfile.objects.get(user=user)
    uploaded_file = request.FILES.get('file')
    if uploaded_file:
        saved_file = handle_file_save(uploaded_file, "avatar")
        if saved_file == False:
            return JsonResponse({'successs': False, 'message': "File upload failed."},
                                status=HTTP_STATUS["Internal Server Error"])
        # Delete the old profile pic, but only if its not the default avatar
        # Default profile pic is shared by all accounts without profile pic and should never be deleted
        if user_profile.profile_pic_url != f"{settings.MEDIA_URL}images/avatars/default-profile-pic.webp":
            handle_file_delete(user_profile.profile_pic_url)
        user_profile.profile_pic_url = saved_file["URL"]
        return JsonResponse({"success": True, "message": "Profile picture uploaded successfully."},
                            status=HTTP_STATUS["Created"])
    return JsonResponse({"success": False, "message": "Given file not correct."},
                        status=HTTP_STATUS["Bad Request"])
