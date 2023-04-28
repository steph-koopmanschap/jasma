from django.urls import path
from api.views.post_views import create_post, get_user_posts

urlpatterns = [
    path('createPost/', create_post),
    path('getUserPosts/', get_user_posts),
]
