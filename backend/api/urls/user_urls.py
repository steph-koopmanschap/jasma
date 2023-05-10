from django.urls import path
from api.views.user_views import *
from api.views.follower_views import follow_user, unfollow_user, get_following, get_followers, check_is_following

urlpatterns = [
    path('followUser/', follow_user),
    path('unfollowUser/<str:user_id_two>/', unfollow_user),
    path('getFollowing/<str:user_id>', get_following),
    path('getFollowers/<str:user_id>', get_followers),
    path('checkIsFollowing/', check_is_following)
]