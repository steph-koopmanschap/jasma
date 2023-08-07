from django.urls import path
from .views import profile_views 
from .views import category_views
from .views import stream_views
from .views import report_views


urlpatterns = [
    path("streamer-profiles", profile_views.StreamerProfilesList.as_view({"get": 'list'})),
    path("generate-new-key", profile_views.generate_new_stream_key),
    path("create-profile", profile_views.create_streamer_profile, name='create_profile'),
    path("toggle-active", profile_views.toggle_is_active),
    path("update-streamer-profile-settings", profile_views.update_profile_settings),
    path("toggle-ban/<id>", profile_views.toggle_ban_streamer_profile, name='toggle_ban'),
    path("categories", category_views.CategoriesListView.as_view({"get": 'list'})),
    path("create-category", category_views.create_category, name='create_category'),
    path("update-category/<id>", category_views.update_category, name='update_category'),
    path("delete-category/<id>", category_views.delete_category, name='delete_category'),
    path("publish", stream_views.start_stream),
    path("done", stream_views.end_stream),
    path("stream-reports", report_views.StreamReportsList.as_view({'get': 'list'})),
    path("create-stream-report", report_views.create_stream_report),
]