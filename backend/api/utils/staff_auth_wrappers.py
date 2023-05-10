from django.http import JsonResponse
from api.constants.http_status import HTTP_STATUS

def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_role == "admin":
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse(
                {"success": False, "message": "Authorization not successful"},
                status=HTTP_STATUS["Unauthorized"]
            )
    return wrapper

def mod_required(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated and request.user.user_role == "mod":
            return view_func(request, *args, **kwargs)
        else:
            return JsonResponse(
                {"success": False, "message": "Authorization not successful"},
                status=HTTP_STATUS["Unauthorized"]
            )
    return wrapper

def staff_required(view_func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.user_role == "admin" or request.user.user_role == "mod":
                return view_func(request, *args, **kwargs)
            else:
                return JsonResponse(
                    {"success": False, "message": "Authorization not successful"},
                    status=HTTP_STATUS["Unauthorized"]
                )
    return wrapper
