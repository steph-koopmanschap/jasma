import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from api.models import User
from api.utils.request_method_wrappers import post_wrapper
from api.utils.get_client_ip import get_client_ip
from api.constants.http_status import HTTP_STATUS

@csrf_exempt
@post_wrapper
def register(request):
    # get the user input data from the request body
    req = json.loads(request.body)
    username = req['username']
    email = req['email']
    password = req['password']
    
    # Perform basic validation of input data
    # all() is a built-in Python function that returns True if all the elements in an iterable are considered True, and False otherwise. 
    if not all([username, email, password]):
        return JsonResponse({'success': False, 'message': 'All fields are required.'},
                            status=HTTP_STATUS['Bad Request'])
    if User.objects.filter(email=email).exists():
        return JsonResponse({'success': False, 'message': 'Email already exists.'},
                            status=HTTP_STATUS['Bad Request'])
    if User.objects.filter(username=username).exists():
        return JsonResponse({'success': False, 'message': 'Username already exists.'},
                            status=HTTP_STATUS['Bad Request'])
    
    # create the user object
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.after_create()
    # return success response
    return JsonResponse({'success': True, 'message': f"User {username} registered successfully."},
                        status=HTTP_STATUS['Created'])

@csrf_exempt
@post_wrapper
def login_view(request):
    req = json.loads(request.body)
    email = req['email']
    password = req['password']
    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        ip = get_client_ip(request)
        user.last_ipv4 = ip
        user.save()
        # Add user data to the user session
        request.session['id'] = user.id
        request.session['username'] = user.username
        request.session['email'] = user.email
        return JsonResponse({"success": True, "user": {"id": user.id, "username": user.username, "email": user.email}, "message": "User logged in."},
                        status=HTTP_STATUS['Created'])
    else:
        return JsonResponse({"success": False, "message": "Invalid email or password."},
                            status=HTTP_STATUS['Forbidden'])

@csrf_exempt
@post_wrapper
def logout_view(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out."},
                        status=HTTP_STATUS['Created'])

def check_auth(request):
    if 'id' in request.session:
        return JsonResponse({'isAuth': True}, 
                            status=HTTP_STATUS['OK'])
    else:
        return JsonResponse({'isAuth': False},
                            status=HTTP_STATUS['OK'])

@csrf_exempt
@login_required
@post_wrapper
def change_password(request):
    req = json.loads(request.body)
    new_password = request['newPassword']
    email = request.session.get('email')
    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    return JsonResponse({'success': True, 'message': 'Password changed.'},
                        status=HTTP_STATUS['Created'])
