# NOTE: This file includes views for sending server administration
#       commands to the server. This can only be used by server admins.

# from django.core.cache import cache
from django_redis import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from api.constants.http_status import HTTP_STATUS
from api.utils.request_method_wrappers import delete_wrapper
from api.utils.staff_auth_wrappers import admin_required

# NOTE: SHOULD WE MAKE THIS A SERVER COMMAND INSTEAD? with manage.py
# Clears the entire Redis Cache
# Note: this only deletes the data set with cache.set()
# It does not empty the entire Redis database.


@csrf_exempt
@admin_required
@delete_wrapper
def clear_cache(request):
    cache.clear()
    # for key in cache.keys():
    #    cache.delete(key)
    return JsonResponse({'successs': True, 'message': "Server cache has been cleared."},
                        status=HTTP_STATUS["OK"])
