from django.urls import path
from .views import profile_views, category_views, stream_views, report_views, search_views


urlpatterns = [
    # Profile
    path("streamer-profile/<user_id>", profile_views.get_streamer_profile, name='streamer_profile'),
    path("generate-new-key", profile_views.generate_new_stream_key, name='generate_new_key'),
    path("create-profile", profile_views.create_streamer_profile, name='create_profile'),
    path("toggle-active", profile_views.toggle_is_active, name='toggle_active'),
    path("update-streamer-profile-settings", profile_views.update_profile_settings, name='update_streamer_profile_settings'),
    path("toggle-ban/<id>", profile_views.toggle_ban_streamer_profile, name='toggle_ban'),
    path("toggle-follow/<id>", profile_views.toggle_follow, name='toggle_follow'),
    # Stream categories
    path("categories", category_views.CategoriesListView.as_view({"get": 'list'}), name='categories'),
    path("create-category", category_views.create_category, name='create_category'),
    path("update-category/<id>", category_views.update_category, name='update_category'),
    path("delete-category/<id>", category_views.delete_category, name='delete_category'),
    # Live streams
    path("publish", stream_views.start_stream, name='stream_publish'),
    path("done", stream_views.end_stream, name='stream_done'),
    path("update-views-count/<id>", stream_views.update_total_views, name='update_views_count'),
    path("update-live-stream/<id>", stream_views.update_current_stream_info, name='update_live_stream'),
    path("live-streams-all", stream_views.LiveStreamsAll.as_view(), name='update_streams_all'),
    path("update-share-count/<id>", stream_views.update_share_count, name='update_share_count'),
    # Reports
    path("stream-reports", report_views.StreamReportsList.as_view({'get': 'list'}), name='stream_reports'),
    path("create-stream-report", report_views.create_stream_report, name='create_stream_report'),
    path("delete-report/<id>", report_views.delete_report, name='delete_report'),
    path("clear-all-reports/<user_id>", report_views.clear_all_reports, name='clear_all_reports'),
    # Search
    path("stream-general-search", search_views.search_query, name='stream_general_search'),
    path("search-streamers", search_views.StreamersListAll.as_view(), name='search_streamers'),
    path("search-stream-reports", search_views.ReportsListAll.as_view(), name='search_stream_reports')
]