from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from requests import patch

from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from api.models import User, UserLoginHistory
from api.utils.get_client_ip import get_client_ip
from api.serializers import UserAuthenticationSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    # Serialize, validate and create
    serializer = UserAuthenticationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = User.objects.create_user(**serializer.validated_data)

    # Return success response
    payload = {"message": f"User {user.username} registered successfully."}
    return Response(payload, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(request, username=email, password=password)
    if user:
        login(request, user)
        # Store ip address used to login
        ip_address = get_client_ip(request)
        user.last_ipv4 = ip_address  # TODO: This could (and probably should) be refactored as a related property
        user.login_history.create(login_ipv4=ip_address)
        user.save()
        # Add user data to the user session
        user_info = UserAuthenticationSerializer(user)
        request.session.update({"user": user_info.data})
        payload = {
            "data": {**user_info.data},
            "message": "User logged in."
        }

        return Response(payload)
    else:
        raise PermissionDenied("Invalid email or password.")

# NOTE: This is needed for DjangoModelPermission
class LogoutView(CreateAPIView):
    queryset = User.objects.none()
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        payload = {"message": "Logged out."}
        return Response(payload)

@api_view(["GET"])
@permission_classes([AllowAny])
def check_auth(request):
    has_user = request.user.is_authenticated
    has_session = bool(request.session.session_key)
    user = request.user
    payload = {
        "data": {
            "isAuth": has_user and has_session,
            "role": user.user_role if hasattr(user, "user_role") else "guest"
        }
    }
    return Response(payload)


class ChangePasswordView(UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserAuthenticationSerializer
    
    
    def patch(self, request, *args, **kwargs):
        super().patch(request, *args, **kwargs)
        payload = {
            "message": "Password changed."
        }
        return Response(payload)
