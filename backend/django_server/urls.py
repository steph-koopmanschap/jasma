"""
URL configuration for django_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from api.views.media_views import get_file
from django.views.decorators.csrf import get_token

urlpatterns = [
    # path('', include('api.urls')),
    path('admin', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/live/', include('live.urls')),
    path('token', get_token, name='api-csrf-token'),
    path('media/<path:filepath>', get_file)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
