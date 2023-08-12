from django.test import TestCase
from live.models.models import StreamerProfile, StreamerSettings
from api.models.models import User

class StreamerProfileTest(TestCase):

    def create_user(self):
        return User.objects.create(
                username='test_username',
                email='test@test.com',
                password='X',
                recovery_email='test@test.com')
    def create_stream_profile(self, user):
        return StreamerProfile.objects.create(user=user)
    
    def test_creation(self):
        user = self.create_user()

        profile = self.create_stream_profile(user=user)

        self.assertEqual(user.id, profile.user.id)
        self.assertIsNotNone(user.streamerprofile)
        self.assertEqual(profile.stream_key, '') # This should be added only in view not on creation
        self.assertIsNone(profile.deactivate_reason_description)
        self.assertIsNone(profile.deactivated_at)
        self.assertIsNone(profile.last_banned_at)
        self.assertIsNone(profile.last_live_time)
        self.assertIsNone(profile.last_ban_reason)
        self.assertEqual(profile.total_stream_time, 0)
        self.assertEqual(profile.total_views_count, 0)
        self.assertEqual(profile.followers_count, 0)