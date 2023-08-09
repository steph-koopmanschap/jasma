from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.management.commands.createlivedata import create_live_data
from live.views import profile_views, category_views, search_views, stream_views, report_views
from uuid import uuid4
class TestProfileView(APITestCase):

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
         
    

    def without_auth(self, request, view, **kwargs):
        request.user = None
        res = view(request, **kwargs)
        return res
    
    

    
    def test_create_profile_should_return_profile_if_logged(self):
         
        request = self.factory.post("/create-profile")
        print(self.non_admin_user)
        request.user = self.non_admin_user
        

        res = profile_views.create_streamer_profile(request)
        
        profile = res.data['data']['profile']
        self.assertEqual(res.status_code, 201)
        self.assertIsNotNone(profile)
        self.assertEqual(profile['user'], self.non_admin_user.id)
        self.assertIsNotNone(profile['profile_settings'])
        self.assertIsNot(profile['stream_key'], '')

        no_auth_res = self.without_auth(request=request, view=profile_views.create_streamer_profile)

        self.assertEqual(no_auth_res.status_code, 403)
        
    def test_generate_new_key(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)
        request = self.factory.put("/generate-new-key")
        print(self.non_admin_user)
        request.user = self.non_admin_user
        prev_key = self.non_admin_user.streamerprofile.stream_key

        res = profile_views.generate_new_stream_key(request)
        
        data = res.data['data']['stream_key']
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)
        self.assertNotEqual(data, prev_key)

        request.user.streamerprofile.is_live=True
        is_live_res = profile_views.generate_new_stream_key(request)
        
        request.user.streamerprofile.is_live=False
        request.user.streamerprofile.is_active=False
        is_not_active = profile_views.generate_new_stream_key(request)
        
        request.user.streamerprofile.is_active=True
        request.user.streamerprofile.is_banned=True
        is_banned = profile_views.generate_new_stream_key(request)
        request.user.streamerprofile.is_banned=False

        self.assertEqual(is_live_res.status_code, 400)
        self.assertEqual(is_not_active.status_code, 400)
        self.assertEqual(is_banned.status_code, 400)

        no_auth_res = self.without_auth(request=request, view=profile_views.create_streamer_profile)

        self.assertEqual(no_auth_res.status_code, 403)

    def test_streamer_profile_by_id_should_return_full_data(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)
        request = self.factory.get(f"/streamer-profile/{self.non_admin_user.id}")
        request.user = self.non_admin_user

        res = profile_views.get_streamer_profile(request, self.non_admin_user.id)
        data = res.data['data']['streamer_profile']
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)
        self.assertEqual(data['user'], self.non_admin_user.id)
        self.assertIsNotNone(data['profile_settings'])
        self.assertIsNotNone(data['reported'])
        self.assertIsNotNone(data['followed_by'])

        no_auth_res = self.without_auth(request=request, view=profile_views.get_streamer_profile, 
                                        user_id=self.non_admin_user.id)

        self.assertEqual(no_auth_res.status_code, 200)

    def test_toggle_active(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)
        request = self.factory.put(f"/toggle-active", data={'deactivate_reason_description': 'Sample text'})
        request.user = self.non_admin_user
        res = profile_views.toggle_is_active(request)
        
        self.assertEqual(res.status_code, 200)

        res_again = profile_views.toggle_is_active(request)
        self.assertEqual(res_again.status_code, 200)
        self.assertTrue(request.user.streamerprofile.is_active)

        no_auth_res = self.without_auth(request=request, view=profile_views.toggle_is_active)

        self.assertEqual(no_auth_res.status_code, 403)
