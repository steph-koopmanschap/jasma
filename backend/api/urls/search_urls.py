from django.urls import path
from api.views.search_views import search

urlpatterns = [
    path('query/', search),
]

