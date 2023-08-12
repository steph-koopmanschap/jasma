from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.management.commands.createlivedata import create_live_data
from live.views import profile_views
from live.constants import ban_reasons
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
         
    

    def without_auth(self, request, view, is_admin_only=False, **kwargs):
        request.user = None
        if is_admin_only:
            request.user = self.non_admin_user
        
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

    def test_update_streamer_profile_settings(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)
        category = StreamCategory.objects.all().first()

        request = self.factory.put(f"/update-streamer-profile-settings", 
                                   data={'next_stream_title': 'Updated title',
                                         "next_stream_category": category.id})
        request.user = self.non_admin_user
        res = profile_views.update_profile_settings(request)
        print(self.non_admin_user.streamerprofile.profile_settings.next_stream_category)
        data = res.data['data']['profile_settings']
        
        self.assertEqual(res.status_code, 200)

        updated_category = StreamCategory.objects.filter(id=data['next_stream_category']).first()

        self.assertEqual(updated_category, category)
        self.assertEqual(data['next_stream_title'], 'Updated title')
        self.assertEqual(updated_category, self.non_admin_user.streamerprofile.profile_settings.next_stream_category)
        self.assertEqual(data['next_stream_title'], self.non_admin_user.streamerprofile.profile_settings.next_stream_title)

        no_auth_res = self.without_auth(request=request, view=profile_views.toggle_is_active)

        self.assertEqual(no_auth_res.status_code, 403)
    
    def test_toggle_ban_user(self):

        choice = 'gore'
        request = self.factory.put(f"/toggle-ban", 
                                   data={'last_ban_reason': choice})
        request.user = self.admin_user

        # Trying to ban user without streaming profile should fail
        no_profile_res = profile_views.toggle_ban_streamer_profile(request, self.non_admin_user.id)

        self.assertEqual(no_profile_res.status_code, 400)

        # Sending invalid reason should fail
        request.data = {"last_ban_reason": 'invalid'}
        invalid_reason_res = profile_views.toggle_ban_streamer_profile(request, self.non_admin_user.id)
        self.assertEqual(invalid_reason_res.status_code, 400)

        self.create_stream_profiles(self.non_admin_user, self.admin_user)

        # Should ban user
        request.data = {'last_ban_reason': choice}
        res = profile_views.toggle_ban_streamer_profile(request, id=self.non_admin_user.id)
        banned = User.objects.filter(id=self.non_admin_user.id).first()
        self.non_admin_user = banned


        self.assertEqual(res.status_code, 200)
        self.assertTrue(self.non_admin_user.streamerprofile.is_banned)
        self.assertEqual(self.non_admin_user.streamerprofile.last_ban_reason, choice)

        # Hitting again should unban user
        hit_again_res = profile_views.toggle_ban_streamer_profile(request, id=self.non_admin_user.id)

        unbanned = User.objects.filter(id=self.non_admin_user.id).first()
        self.non_admin_user = unbanned
        self.assertEqual(hit_again_res.status_code, 200)
        self.assertFalse(self.non_admin_user.streamerprofile.is_banned)


        no_admin_res = self.without_auth(request=request, view=profile_views.toggle_ban_streamer_profile,
                                         is_admin_only=True, id=self.non_admin_user.id)

        self.assertEqual(no_admin_res.status_code, 403)

        no_auth_res = self.without_auth(request=request, view=profile_views.toggle_ban_streamer_profile, 
                                        id=self.non_admin_user.id)

        self.assertEqual(no_auth_res.status_code, 403)

    def test_toggle_follow_streamer_profile(self):
        request = self.factory.post(f"/toggle-follow")
        request.user = self.non_admin_user
        
        no_profile_res = profile_views.toggle_follow(request, id=self.admin_user.id)

        self.assertEqual(no_profile_res.status_code, 404, msg="Cannot follow non-existent profile")

        self.create_stream_profiles(self.non_admin_user, self.admin_user)

        same_profile_res = profile_views.toggle_follow(request, id=self.non_admin_user.id)

        self.assertEqual(same_profile_res.status_code, 400, msg="Cannot follow own profile")


        unbanned_user = StreamerProfile.objects.filter(is_banned=False).first()
        res = profile_views.toggle_follow(request, id=unbanned_user.user.id)
        updated_unbanned_user = StreamerProfile.objects.filter(user_id=unbanned_user.user.id).first()

        self.assertEqual(res.status_code, 200, msg='Should return 200 on follow success')
        self.assertEqual(updated_unbanned_user.followers_count, 1)
        self.assertEqual(self.non_admin_user.followed_streamers_count, 1)
        self.assertTrue(updated_unbanned_user.followed_by.contains(self.non_admin_user))

        hit_again_res= profile_views.toggle_follow(request, id=unbanned_user.user.id)
        updated_unbanned_user_again = StreamerProfile.objects.filter(user_id=updated_unbanned_user.user.id).first()
        
        self.assertEqual(hit_again_res.status_code, 200, msg='Should return 200 on unfollow success')
        self.assertEqual(updated_unbanned_user_again.followers_count, 0)
        self.assertEqual(self.non_admin_user.followed_streamers_count, 0)
        self.assertFalse(updated_unbanned_user_again.followed_by.contains(self.non_admin_user))


        banned_user = StreamerProfile.objects.filter(is_banned=True).first()
        banned_user.is_active = False
        banned_user.save()
        res_banned_inactive = profile_views.toggle_follow(request, id=banned_user.user.id)

        self.assertEqual(res_banned_inactive.status_code, 400, msg="Cannot follow banned or inactive users")

        no_auth_res = self.without_auth(request=request, view=profile_views.toggle_follow, 
                                        id=self.non_admin_user.id)

        self.assertEqual(no_auth_res.status_code, 403)