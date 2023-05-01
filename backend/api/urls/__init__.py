
from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.urls.auth_urls')),
    path('users/', include('api.urls.user_urls')),
    path('posts/', include('api.urls.post_urls')),
    path('comments/', include('api.urls.comment_urls')),
    path('search/', include('api.urls.search_urls')),
    path('reports/', include('api.urls.report_urls')),
    path('hashtags/', include('api.urls.hashtag_urls')),
    path('notifications/', include('api.urls.notification_urls'))
]

