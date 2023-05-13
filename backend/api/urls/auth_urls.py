from django.urls import path
from api.views.auth_views import register, login_view, logout_view, check_auth, get_csrf_token

urlpatterns = [
    path('login/', login_view),
    path('register/', register),
    path('logout/', logout_view),
    path('checkAuth/', check_auth),
    path('getCsrf/', get_csrf_token)
]
