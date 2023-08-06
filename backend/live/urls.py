from django.urls import path
from .views.profile_views import create_streamer_profile, toggle_ban_streamer_profile, StreamerProfilesList, generate_new_stream_key
from .views.category_views import create_category, update_category, delete_category, CategoriesListView
from .views.stream_views import start_stream, end_stream

urlpatterns = [
    path("streamer-profiles", StreamerProfilesList.as_view({"get": 'list'})),
    path("generate-new-key", generate_new_stream_key),
    path("create-profile", create_streamer_profile, name='create_profile'),
    path("toggle-ban/<id>", toggle_ban_streamer_profile, name='toggle_ban'),
    path("categories", CategoriesListView.as_view({"get": 'list'})),
    path("create-category", create_category, name='create_category'),
    path("update-category/<id>", update_category, name='update_category'),
    path("delete-category/<id>", delete_category, name='delete_category'),
    path("start-stream", start_stream),
    path("end-stream", end_stream)
]