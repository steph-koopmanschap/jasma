from django.urls import path
from api.views.auth_views import register, login_view, logout_view

urlpatterns = [
    path('login/', login_view),
    path('register/', register),
    path('logout/', logout_view),
]
