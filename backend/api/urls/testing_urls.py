from django.urls import path
from api.views import *

urlpatterns = [
    path('hello/', hello),
    #path('hello/', views.hello),
]
