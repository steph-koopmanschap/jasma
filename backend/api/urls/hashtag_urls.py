from django.urls import path
from api.views.hashtag_views import get_top_hashtags, get_hashtag_count, get_subscribed_hashtags, subscribe_to_hashtags, unsubscribe_from_hashtag

urlpatterns = [
    path('getTopHashtags/', get_top_hashtags),
    path('getHashtagCount/<str:hashtag>/', get_hashtag_count),
    path('getSubscribedHashtags/', get_subscribed_hashtags),
    path('subscribeToHashtags/', subscribe_to_hashtags),
    path('unsubscribeFromHashtag/', unsubscribe_from_hashtag),
]
