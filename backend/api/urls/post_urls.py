from django.urls import path
from api.views.post_views import create_post, \
        edit_post, \
        get_user_posts, \
        delete_post, \
        get_single_post, \
        get_multiple_posts, \
        get_global_newsfeed, \
        get_newsfeed, \
        add_post_bookmark, \
        delete_post_bookmark, \
        get_bookmarked_posts

urlpatterns = [
    path('createPost/', create_post),
    path('deletePost/<str:post_id>/', delete_post),
    path('editPost/', edit_post),
    path('getSinglePost/<uuid:post_id>/', get_single_post),
    path('getUserPosts/', get_user_posts),
    
    path('getMultiplePosts', get_multiple_posts),
    path('getGlobalNewsfeed', get_global_newsfeed),
    path('getNewsfeed', get_newsfeed),
    
    path('addPostBookmark/', add_post_bookmark),
    path('deletePostBookmark/<str>:post_id/', delete_post_bookmark),
    path('getBookmarkedPosts/', get_bookmarked_posts)
]
