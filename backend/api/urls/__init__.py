
from django.urls import path, include

urlpatterns = [
    path('testing/', include('api.urls.testing_urls')),
]

