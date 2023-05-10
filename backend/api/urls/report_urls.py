from django.urls import path
from api.views.report_views import create_report, get_reports, delete_report, ignore_report

urlpatterns = [
    path('createReport/', create_report),
    path('getReports', get_reports),
    path('deleteReport/<str:post_id>', delete_report),
    path('ignoreReport/<str:post_id>', ignore_report)
]
