from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from api.models import User, UserLoginHistory
from api.utils.get_client_ip import get_client_ip
from api.serializers import UserRegisterSerializer

@api_view(["POST"])
def register(request):
    # Serialize, validate and create
    serializer = UserRegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = User.objects.create_user(**serializer.validated_data)

    # return success response
    payload = {"message": f"User {user.username} registered successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)
    if user:
        login(request, user)
        # Store ip address used to login
        ip_address = get_client_ip(request)
        user.last_ipv4 = ip_address
        user.save()
        UserLoginHistory.objects.create(user=user, login_ipv4=ip_address)
        # Add user data to the user session
        user_info = {
            "id": str(user.id),
            "username": user.username,
            "email": user.email
        }
        request.session.update(user_info)
        payload = {"data": {"user": user_info},
                    "message": "User logged in."}
        return Response(payload)
    else:
        payload = {"success": False, "message": "Invalid email or password."}
        return Response(payload, status=status.HTTP_403_FORBIDDEN)

@api_view(["POST"])
def logout_view(request):
    logout(request)
    payload = {"message": "Logged out."}
    return Response(payload)

@api_view(["GET"])
def check_auth(request):
    has_user = request.user.is_authenticated
    has_session = bool(request.session.session_key)
    payload = {
        "data": {"isAuth": has_user and has_session}
    }
    return Response(payload)

""" 
I will leave this out for now as I think this present
a security risk for our API. We can reintegrate it if it is needed.

@api_view(["GET"])
def get_csrf_token(request):
    data = {"csrfToken": get_token(request)}
    return Response(data)
"""

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    new_password = request.data.get("newPassword")
    user = request.user
    user.set_password(new_password)
    user.save()
    data = {"message": "Password changed."}
    return Response(data)
