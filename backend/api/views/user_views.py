import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, put_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, User_Profile, Post
from api.utils.handle_file_save import handle_file_save
from api.utils.handle_file_delete import handle_file_delete

@get_wrapper
def get_profile_pic(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "User ID is None or undefined."},
                            status=HTTP_STATUS["Bad Request"])
    user = User.objects.get(id=user_id)
    user_profile = User_Profile.objects.get(user=user)
    return JsonResponse({"success": True, 'profile_pic_url': user_profile.profile_pic_url})

@csrf_exempt
@login_required
@post_wrapper
def upload_profile_pic(request):
    user = request.user
    user_profile = User_Profile.objects.get(user=user)
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
