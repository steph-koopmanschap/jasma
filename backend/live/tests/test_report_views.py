from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.management.commands.createlivedata import create_live_data
from live.views import report_views
from live.constants import ban_reasons
from uuid import uuid4

class TestReportViews(APITestCase):

    def create_admin_user(self):
        self.admin_user = User.objects.create(
                username='test_username',
                email='test@test.com',
                password='X',
                recovery_email='test@test.com',
                is_staff=True
                )
        self.non_admin_user = User.objects.create(
                username='test_username2',
                email='test2@test.com',
                password='X',
                recovery_email='test2@test.com',
                is_staff=False,

                )
        
        self.factory = APIRequestFactory()
    
    def create_stream_profiles(self, user1, user2):
        profile1 = StreamerProfile.objects.create(user=user1, stream_key='jasma_live_' + uuid4().hex)
        StreamerSettings.objects.create(profile=profile1)
        profile2 = StreamerProfile.objects.create(user=user2, stream_key='jasma_live_' + uuid4().hex)
        StreamerSettings.objects.create(profile=profile2)

    def setUp(self):
         create_live_data()
         self.create_admin_user()     
    

    def generate_reports(self, reason='gore', issued_by=None):

        for stream in StreamLive.objects.all():

            StreamReport.objects.create(issued_by=issued_by, report_reason=reason, reported_profile=stream.streamer, 
                                        reported_stream=stream)
    
    def test_get_reports(self):
        request = self.factory.get("/stream-reports")
        request.user = self.admin_user
        
        self.generate_reports(issued_by=self.non_admin_user)

        view = report_views.StreamReportsList.as_view()

        res = view(request)
        
        data = res.data['data']['stream_reports']
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)

        request.user = self.non_admin_user

        no_admin_res = view(request)

        self.assertEqual(no_admin_res.status_code, 403)

        request.user = None

        no_auth_res = view(request)

        self.assertEqual(no_auth_res.status_code, 403)
    
    def test_create_stream_report(self):
        stream_to_report = StreamLive.objects.all().first()
        request = self.factory.post("/create-stream-report", data={'reported_stream': stream_to_report.id,
                        'report_reason': 'gore'})
        
        request.user = self.non_admin_user
      

        view = report_views.create_stream_report
        res = view(request)

        self.assertEqual(res.status_code, 201, msg="Should return 201 when report created")
        updated_stream_to_report = StreamLive.objects.filter(id=stream_to_report.id).first()
        reported_streamer = StreamerProfile.objects.filter(user_id=updated_stream_to_report.streamer.user.id).first()

        self.assertEqual(updated_stream_to_report.reported.first().report_reason, 'gore', 
                         msg="Stream should have report in reported field")
        self.assertEqual(updated_stream_to_report.reported.first().issued_by, self.non_admin_user,
                         msg="Stream should have report in reported field")
        self.assertEqual(reported_streamer.reported.first().report_reason, 'gore',
                         msg="Streamer profile should have report in reported field")
        self.assertEqual(reported_streamer.reported.first().issued_by, self.non_admin_user,
                         msg="Streamer profile should have report in reported field")

        hit_again_res = view(request)

        self.assertEqual(hit_again_res.status_code, 400, 
                         msg="Should return 400 if the same user sending new report to the same stream")

        request.data = {"report_reason": 'gore', 'reported_stream': uuid4()}

        invalid_data_res = view(request)

        self.assertEqual(invalid_data_res.status_code, 400, 
                         msg="Should return 400 if profile or stream don't exist")
        


        request.user = reported_streamer.user
        request.data = {'report_reason': 'gore', 'reported_stream': updated_stream_to_report.id}

        report_self_res = view(request)

        self.assertEqual(report_self_res.status_code, 400, 
                         msg="Should return 400 when user is trying to report themselves")


        request.user = None

        no_auth_res = view(request)

        self.assertEqual(no_auth_res.status_code, 403)
    
    def test_delete_report_by_id(self):
        request = self.factory.delete("/delete-report")
        request.user = self.admin_user
        
        self.generate_reports(issued_by=self.non_admin_user)

        view = report_views.delete_report

        report = StreamReport.objects.all().first()
        reported_stream_id = report.reported_stream.id
        reported_profile_id = report.reported_profile.user.id
        
        res = view(request, id=report.id)
        
        self.assertEqual(res.status_code, 204, msg="Should return 204 when report deleted")
        deleted_report = StreamReport.objects.filter(id=report.id).first()
        self.assertIsNone(deleted_report)
        
        updated_stream = StreamLive.objects.filter(id=reported_stream_id).first()
        updated_profile = StreamerProfile.objects.filter(user_id=reported_profile_id).first()

        self.assertIsNone(updated_stream.reported.first())
        self.assertIsNone(updated_profile.reported.first())

        not_found_res = view(request, id=uuid4())

        self.assertEqual(not_found_res.status_code, 404, msg="Should return 404 when report doesn't exist")

        request.user = self.non_admin_user

        no_admin_res = view(request, report.id)

        self.assertEqual(no_admin_res.status_code, 403)

        request.user = None

        no_auth_res = view(request, report.id)

        self.assertEqual(no_auth_res.status_code, 403)

    def test_clear_all_reports_from_profile(self):
        request = self.factory.delete("/clear-all-reports")
        request.user = self.admin_user
        
        self.generate_reports(issued_by=self.non_admin_user)

        view = report_views.clear_all_reports

        report = StreamReport.objects.all().first()
        reported_user = report.reported_profile

        self.assertIsNotNone(reported_user.reported.first())
        
        res = view(request, user_id=reported_user.user.id)
        
        self.assertEqual(res.status_code, 204, msg="Should return 204 when reports cleared")
        deleted_report = StreamReport.objects.filter(id=report.id).first()
        self.assertIsNone(deleted_report)
        updated_profile = StreamerProfile.objects.filter(user_id=reported_user.user.id).first()

        self.assertIsNone(updated_profile.reported.first())

        not_found_res = view(request, user_id=uuid4())

        self.assertEqual(not_found_res.status_code, 404, msg="Should return 404 when user doesn't exist")

        request.user = self.non_admin_user

        no_admin_res = view(request, report.id)

        self.assertEqual(no_admin_res.status_code, 403)

        request.user = None

        no_auth_res = view(request, report.id)

        self.assertEqual(no_auth_res.status_code, 403)