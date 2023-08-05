from django.urls import path
from .views.profile_views import create_streamer_profile, toggle_ban_streamer_profile

urlpatterns = [
    path("create-profile", create_streamer_profile, name='create-profile'),
    path("toggle-ban", toggle_ban_streamer_profile)
]