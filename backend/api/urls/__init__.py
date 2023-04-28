
from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.urls.auth_urls')),
    path('users/', include('api.urls.testing_urls')),
    path('posts/', include('api.urls.post_urls')),
    path('comments/', include('api.urls.testing_urls')),
    path('search/', include('api.urls.testing_urls')),
    path('reports/', include('api.urls.testing_urls')),
    path('hashtags/', include('api.urls.testing_urls')),
    path('notifications/', include('api.urls.testing_urls')),
    path('testing/', include('api.urls.testing_urls'))
]

