from django.urls import path
from .views import auth_views, post_views

from rest_framework.routers import DefaultRouter



router = DefaultRouter(trailing_slash=False)
router.register(r'post', post_views.PostViewSet, basename='posts')
urlpatterns = router.urls
print(urlpatterns)
urlpatterns += [
    # auth_urls
    path("auth/login", auth_views.login_view),
    path("auth/register", auth_views.register),
    path("auth/logout", auth_views.logout_view),
    path("auth/checkAuth", auth_views.check_auth),
    path("auth/getCsrf", auth_views.get_csrf_token),
    path("auth/changePass", auth_views.change_password),
    # path("post", post_views.PostList.as_view()),
    # post_views

]

# path("users/", include("urls.user_urls")),
# path("posts/", include("urls.post_urls")),
# path("comments/", include("urls.comment_urls")),
# path("search/", include("urls.search_urls")),
# path("reports/", include("urls.report_urls")),
# path("hashtags/", include("urls.hashtag_urls")),
# path("notifications/", include("urls.notification_urls")),
# path("ads/", include("urls.advertisement_urls"))
