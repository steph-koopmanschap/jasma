from rest_framework.test import APITestCase, APIRequestFactory
from api.models.models import User
from live.models.models import StreamerProfile, StreamerSettings, StreamLive, StreamReport, StreamCategory
from live.management.commands.createlivedata import create_live_data
from live.views import stream_views
from live.serializers import StreamCategorySerializerGet
from django.utils import timezone
from live.constants import ban_reasons
from uuid import uuid4
from datetime import datetime,timedelta

class TestStreamViews(APITestCase):

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
    

    
    def test_publish_stream_view(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)

        request = self.factory.get(f"/publish?name={self.non_admin_user.streamerprofile.stream_key}")
        request.user = self.non_admin_user
        

        view = stream_views.start_stream

        res = view(request)
        
        self.assertEqual(res.status_code, 200, msg="Should return 200 if key passed and user is validated")

        created_stream = StreamLive.objects.filter(streamer=request.user.streamerprofile, ended_at=None).first()

        self.assertIsNotNone(created_stream)
        self.assertEqual(created_stream.streamer, request.user.streamerprofile)
        

        request.user.streamerprofile.is_live = True
        request.user.streamerprofile.is_banned = True
        request.user.streamerprofile.is_active = False

        invalid_user_res = view(request)

        self.assertEqual(invalid_user_res.status_code, 403, msg="Should return 403 if user is banned, live or inactive")

        new_request = self.factory.get(f"/publish?name=invalid_key")

        invalid_key_res = view(new_request)

        self.assertEqual(invalid_key_res.status_code, 403, msg="Should return 403 if stream key is invalid")

    def test_end_stream(self):
        self.create_stream_profiles(self.non_admin_user, self.admin_user)

        request = self.factory.get(f"/done?name={self.non_admin_user.streamerprofile.stream_key}")
        request.user = self.non_admin_user
        date_format='%d-%m-%Y'
        created_at = datetime.strptime('09-04-2023', date_format) 
        ongoing_stream = StreamLive.objects.create(streamer=request.user.streamerprofile, title="Test", started_at=created_at)

        view = stream_views.end_stream

        res = view(request)

        self.assertEqual(res.status_code, 200)

        updated_streamer = StreamerProfile.objects.filter(user_id=request.user.id).first()
        updated_ongoing_stream = StreamLive.objects.filter(id=ongoing_stream.id).first()

        self.assertFalse(updated_streamer.is_live)
        self.assertNotEqual(updated_streamer.total_stream_time, 0, msg="Should add stream time when stream ends")
        self.assertIsNotNone(updated_ongoing_stream.ended_at, msg="Should add end timestamp when stream ends")

        new_request = self.factory.get(f"/done?name=invalid_key")

        invalid_key_res = view(new_request)

        self.assertEqual(invalid_key_res.status_code, 403, msg="Should return 403 when key is invalid")



    def test_update_views_count(self):

        self.create_stream_profiles(self.admin_user, self.non_admin_user)

        request = self.factory.put(f"/update-views-count")
        request.user = None
        ongoing_stream = StreamLive.objects.create(streamer=self.non_admin_user.streamerprofile, title="Test")

        view = stream_views.update_total_views

        res = view(request, id=ongoing_stream.id)

        self.assertEqual(res.status_code, 200)
        updated_stream = StreamLive.objects.filter(id=ongoing_stream.id).first()
        
        self.assertEqual(updated_stream.total_views_count, 1, msg="Should increase views count")
        self.assertEqual(updated_stream.streamer.total_views_count, 1, msg="Should increase total views count on streamer")

        invalid_stream_res = view(request, id=uuid4())

        self.assertEqual(invalid_stream_res.status_code, 404)

        ongoing_stream.ended_at = timezone.now()
        ongoing_stream.save()
        silent_fail_res = view(request, ongoing_stream.id)

        self.assertEqual(silent_fail_res.status_code, 200)

        updated_again = StreamLive.objects.filter(id=ongoing_stream.id).first()

        self.assertEqual(updated_again.total_views_count, 0, msg="Should not increase views count")
        self.assertEqual(updated_again.streamer.total_views_count, 1, msg="Should not increase total views count on streamer")
    
    def test_update_share_count(self):

        self.create_stream_profiles(self.admin_user, self.non_admin_user)

        request = self.factory.put(f"/update-views-count")
        request.user = self.non_admin_user
        ongoing_stream = StreamLive.objects.create(streamer=self.non_admin_user.streamerprofile, title="Test")

        view = stream_views.update_share_count

        res = view(request, id=ongoing_stream.id)

        self.assertEqual(res.status_code, 200)
        updated_stream = StreamLive.objects.filter(id=ongoing_stream.id).first()
        
        self.assertEqual(updated_stream.shared_count, 1, msg="Should increase shared count")
        ongoing_stream.ended_at = timezone.now()
        ongoing_stream.save()



        silent_fail_res = view(request, ongoing_stream.id)

        self.assertEqual(silent_fail_res.status_code, 200)


        self.assertEqual(ongoing_stream.shared_count, 0, msg="Should not increase shared count")

        request.user = None

        no_auth_res = view(request)

        self.assertEqual(no_auth_res.status_code, 403)
    
    def test_update_current_stream_info(self):
        self.create_stream_profiles(self.admin_user, self.non_admin_user)

        category = StreamCategory.objects.all().first()

        request = self.factory.put(f"/update-live-stream", {"title": "Updated", "category": category.id})
        request.user = self.non_admin_user
        ongoing_stream = StreamLive.objects.create(streamer=self.non_admin_user.streamerprofile, title="Test")
        
        view = stream_views.update_current_stream_info
        res = view(request, id=ongoing_stream.id)

        data = res.data['data']['live_stream']
        print(data)
        self.assertEqual(res.status_code, 200)
        self.assertIsNotNone(data)
        self.assertEqual(data['title'], "Updated")
        serializer = StreamCategorySerializerGet(category)
        self.assertEqual(data['category'], serializer.data)

        request.user.streamerprofile.is_banned = True
        request.user.streamerprofile.is_active = False


        invalid_user_res = view(request, id=ongoing_stream.id)

        self.assertEqual(invalid_user_res.status_code, 403)        



    
