from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import auth_views, user_views, post_views

urlpatterns = [
    # auth_urls
    path("auth/login", auth_views.login_view, name="login"),
    path("auth/register", auth_views.register, name="register"),
    path("auth/logout", auth_views.logout_view, name="logout"),
    path("auth/checkAuth", auth_views.check_auth, name="check-auth"),
    # path("auth/getCsrf", auth_views.get_csrf_token, name="get-csrf"),
    path("auth/changePassword", auth_views.change_password, name="change-password"),
]

# Inititalize the router
router = DefaultRouter(trailing_slash=False)
# Register viewsets
router.register(r"posts", post_views.PostViewSet, basename="post")
router.register(r"users", user_views.UserViewSet, basename="user")

# Configure urlpatterns 
urlpatterns += router.urls

# print(urlpatterns)


# path("users/", include("urls.user_urls")),
# path("comments/", include("urls.comment_urls")),
# path("search/", include("urls.search_urls")),
# path("reports/", include("urls.report_urls")),
# path("hashtags/", include("urls.hashtag_urls")),
# path("notifications/", include("urls.notification_urls")),
# path("ads/", include("urls.advertisement_urls"))
