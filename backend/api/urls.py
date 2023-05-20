from django.urls import path, include
from .views import auth_views

urlpatterns = [
    # auth_urls
    path("auth/login/", auth_views.login_view),
    path("auth/register/", auth_views.register),
    path("auth/logout/", auth_views.logout_view),
    path("auth/checkAuth/", auth_views.check_auth),
    path("auth/getCsrf/", auth_views.get_csrf_token),

]
    
    # path("users/", include("urls.user_urls")),
    # path("posts/", include("urls.post_urls")),
    # path("comments/", include("urls.comment_urls")),
    # path("search/", include("urls.search_urls")),
    # path("reports/", include("urls.report_urls")),
    # path("hashtags/", include("urls.hashtag_urls")),
    # path("notifications/", include("urls.notification_urls")),
    # path("ads/", include("urls.advertisement_urls"))
