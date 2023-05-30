import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from api.utils.request_method_wrappers import post_wrapper, delete_wrapper, get_wrapper, put_wrapper
from api.constants.http_status import HTTP_STATUS

# NOTE: This function is not done yet
@csrf_exempt
@login_required
@post_wrapper
def create_ad(request):
    return JsonResponse({'successs': False, 'message': "This function is not complete yet"},
                        status=HTTP_STATUS["Not Found"])

# NOTE: This function is not done yet
@csrf_exempt
@login_required
@put_wrapper
def edit_ad(request):
    return JsonResponse({'successs': False, 'message': "This function is not complete yet"},
                        status=HTTP_STATUS["Not Found"])

# NOTE: This function is not done yet
@csrf_exempt
@login_required
@delete_wrapper
def delete_ad(request, ad_id):
    return JsonResponse({'successs': False, 'message': "This function is not complete yet"},
                        status=HTTP_STATUS["Not Found"])

# NOTE: This function is not done yet
@get_wrapper
def get_ad(request, ad_id):
    return JsonResponse({'successs': False, 'message': "This function is not complete yet"},
                        status=HTTP_STATUS["Not Found"])

# NOTE: This function is not done yet
@login_required
@get_wrapper
def get_ads(request):
    return JsonResponse({'successs': False, 'message': "This function is not complete yet"},
                        status=HTTP_STATUS["Not Found"])
