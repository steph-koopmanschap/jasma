import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, get_wrapper, delete_wrapper
from api.constants.http_status import HTTP_STATUS
from api.models import User, Following


@csrf_exempt
@login_required
@post_wrapper
def follow_user(request):
    req = json.loads(request.body)
    user_id_two = req['user_id']
    user_two = User.objects.get(id=user_id_two)
    user = request.user
    _, created = Following.objects.get_or_create(
        user=user, following=user_two)
    if created == False:
        return JsonResponse({"success": False, 'message': 'You are already following this user.'},
                            status=HTTP_STATUS["Conflict"])

    # TODO: Create a notification towards the person being followed.
    # const created_notification = createNotification(userID_two, {
    #     "from": user_id,
    #     "event_type": "new_follower",
    #     "event_reference": user_id,
    #     "message": f"{user.username} started following you."
    # });

    return JsonResponse({"success": True, 'message': 'You are now following this user.'},
                        status=HTTP_STATUS["Created"])


@csrf_exempt
@login_required
@delete_wrapper
def unfollow_user(request, user_id_two):
    user_two = User.objects.get(id=user_id_two)
    user = request.user
    following = Following.objects.filter(user=user, following=user_two)
    following.delete()
    return JsonResponse({"success": True, 'message': 'You are no longer following this user.'},
                        status=HTTP_STATUS["OK"])


@get_wrapper
def get_following(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "User ID is None or undefined."},
                            status=HTTP_STATUS["Bad Request"])
    user = User.objects.get(id=user_id)
    following = Following.objects.filter(
        user=user).values_list('following', flat=True)
    following_users = User.objects.filter(
        id__in=following).values('id', 'username')
    following_count = Following.objects.filter(user=user).count()

    return JsonResponse({"success": True, "following": list(following_users), "following_count": following_count},
                        status=HTTP_STATUS["OK"])


@get_wrapper
def get_followers(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "User ID is None or undefined."},
                            status=HTTP_STATUS["Bad Request"])
    user = User.objects.get(id=user_id)
    following = Following.objects.filter(
        following=user).values_list('user', flat=True)
    followers_users = User.objects.filter(
        id__in=following).values('id', 'username')
    followers_count = Following.objects.filter(following=user).count()
    return JsonResponse({"success": True, "followers": list(followers_users), "following_count": followers_count},
                        status=HTTP_STATUS["OK"])


@login_required
@get_wrapper
def check_is_following(request, user_id):
    if not user_id:
        return JsonResponse({"success": False, "message": "User ID is None or undefined."},
                            status=HTTP_STATUS["Bad Request"])
    user = request.user
    user_two = User.objects.get(id=user_id)
    is_following = Following.objects.filter(
        user=user, following=user_two).exists()
    if is_following:
        return JsonResponse({"success": True, "is_following": True},
                            status=HTTP_STATUS["OK"])
    # Could also make this a 404 Not Found response.
    return JsonResponse({"success": True, "is_following": False},
                        status=HTTP_STATUS["OK"])
