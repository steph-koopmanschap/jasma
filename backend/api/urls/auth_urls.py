from django.urls import path
from api.views.auth_views import hello
#from . import views

urlpatterns = [
    path('hello/', hello),
    #path('hello/', views.hello),
]