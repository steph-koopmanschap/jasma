from django.urls import path
from api.views.notification_views import get_notifications, read_notification

urlpatterns = [
    path('getNotifications/', get_notifications),
    path('readNotification/', read_notification)
]
