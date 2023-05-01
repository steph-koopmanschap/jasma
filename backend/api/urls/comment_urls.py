from django.urls import path
from api.views.comment_views import create_comment, delete_comment, edit_comment, get_comments

urlpatterns = [
    path('createComment/', create_comment),
    path('deleteComment/<str:comment_id>/', delete_comment),
    path('editComment/', edit_comment),
    path('getComments/', get_comments)
]
