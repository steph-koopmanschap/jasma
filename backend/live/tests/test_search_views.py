from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.serializers import StreamerProfileSerializerFull
from live.management.commands.createlivedata import create_live_data
from live.views import search_views
from live.constants import ban_reasons
from uuid import uuid4

class TestSearchViews(APITestCase):

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
    
    def test_search_stream_profiles(self):
        request = self.factory.get("/search-streamers?is_banned=False&is_live=True")
        request.user = self.admin_user
        

        view = search_views.StreamersListAll.as_view()

        res = view(request)
        
        data = res.data['data']['results']
        self.assertEqual(res.status_code, 200, msg="Should return 200 on get request")
        self.assertIsNotNone(data)
        users = StreamerProfile.objects.filter(is_banned=False, is_live=True)
        users_data = StreamerProfileSerializerFull(users, many=True)
        self.assertEqual(data, users_data.data, msg="Should returned queried users")

        new_request = self.factory.get("/search-streamers?is_banned=True&is_live=False")
        new_request.user = None

        no_admin_res = view(new_request)
        no_admin_data = res.data['data']['results']
        
        self.assertEqual(no_admin_res.status_code, 200, msg="Should return 200 on get request")
        self.assertIsNotNone(no_admin_data)
        exact_query_users = StreamerProfile.objects.filter(is_banned=True, is_live=False)
        exact_query = StreamerProfileSerializerFull(exact_query_users, many=True)        
        

        self.assertNotEqual(exact_query.data, no_admin_data, msg="Should not allow filtering by all fields if not an admin")
        
    def test_search_reports(self):

        self.generate_reports(reason='racism', issued_by=self.non_admin_user)

        request = self.factory.get("/search-stream-reports?report_reason=racism")
        request.user = self.admin_user
                

        view = search_views.ReportsListAll.as_view()

        res = view(request)
        
        data = res.data['data']['results']
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)
        valid = True
        for index, item in enumerate(data):
            if item['report_reason'] != 'racism' :
                valid = False
                break
        self.assertTrue(valid)

        request.user = self.non_admin_user

        no_admin_res = view(request)

        self.assertEqual(no_admin_res.status_code, 403)

        request.user = None

        no_auth_res = view(request)

        self.assertEqual(no_auth_res.status_code, 403)
    
  