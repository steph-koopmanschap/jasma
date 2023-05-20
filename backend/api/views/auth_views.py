import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from api.models import User
from api.utils.request_method_wrappers import get_wrapper, post_wrapper
from api.utils.get_client_ip import get_client_ip
from api.constants.http_status import HTTP_STATUS

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.request import Request


@api_view(["POST"])
@authentication_classes([])  # TODO: Confirm if really needed to bypass csrf token error
def register(request):
    # get the user input data from the request body
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    # Perform basic validation of input data
    # all() is a built-in Python function that returns True if all the elements in an iterable are considered True, and False otherwise.
    message = ""
    if not all([username, email, password]):
        message = 'All fields are required.'
    elif User.objects.filter(email=email).exists():
        message = 'Email already exists.'
    elif User.objects.filter(username=username).exists():
        message = 'Username already exists.'
    
    if message:
        data = {'success': False, 'message': message}
        return Response(data, status=status.HTTP_400_BAD_REQUEST)

    # create the user object
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    user.after_create()
    # return success response
    data = {'success': True, 'message': f"User {username} registered successfully."}
    return JsonResponse(data, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@authentication_classes([])  # TODO: Confirm if really needed to bypass csrf token error
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user:
        login(request, user)
        user.last_ipv4 = get_client_ip(request)
        user.save()
        # Add user data to the user session
        user_info = {
            'id': str(user.id),
            'username': user.username,
            'email': user.email
        }
        request.session.update(user_info)
        data = {"success": True, "user": user_info, "message": "User logged in."}
        return Response(data)
    else:
        data = {"success": False, "message": "Invalid email or password."}
        return Response(data, status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([])  # TODO: Confirm if really needed to bypass csrf token error
def logout_view(request):
    logout(request)
    data = {"success": True, "message": "Logged out."}
    return Response(data)

# Not sure do we ever check auth on unthenticated?
@api_view(["GET"])
def check_auth(request):
    if 'id' in request.session:
        data = {"success": True, 'isAuth': True}
        return Response(data)
    else:
        # Should we log out?
        data = {"success": False, 'isAuth': False}
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)

@api_view(["GET"])
def get_csrf_token(request):
    data = {'csrfToken': get_token(request)}
    return Response(data)
    
@login_required
@api_view(["POST"])
def change_password(request):
    new_password = request.data.get('newPassword')
    email = request.session.get('email')
    user = User.objects.get(email=email)
    user.set_password(new_password)
    user.save()
    data = {'success': True, 'message': 'Password changed.'}
    return Response(data)


