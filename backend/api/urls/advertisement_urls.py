from django.urls import path
from api.views.advertisement_views import create_ad, edit_ad, delete_ad, get_ad, get_ads

urlpatterns = [
    path('createAd/', create_ad),
    path('editAd/', edit_ad),
    path('deleteAd/<str:ad_id>/', delete_ad),
    path('editAd/<str:ad_id>/', get_ad),
    path('getAds/', get_ads)
]
