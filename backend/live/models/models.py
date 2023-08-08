from django.db import models
from api.models.models import User
from django.urls import reverse
from django.utils import timezone
from uuid import uuid4
from ..constants import report_reasons
# Create your models here.


class StreamerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, editable=False, blank=True)
    stream_key = models.CharField(unique=True)
    is_banned = models.BooleanField(default=False)
    is_live = models.BooleanField(default=False)
    is_active = models.BooleanField("Is profile not deleted by user", default=True)
    followers_count = models.PositiveIntegerField(default=0)
    total_views_count = models.PositiveIntegerField(default=0)
    total_stream_time = models.PositiveIntegerField(default=0)
    followed_by = models.ManyToManyField(
        User, blank=True, symmetrical=False, related_name="followed_streamers"
    )
    followers_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    deactivated_at = models.DateTimeField(default=None, null=True, blank=True)
    last_banned_at = models.DateTimeField(default=None, null=True, blank=True)
    last_live_time = models.DateTimeField(default=None, auto_now=False, null=True)

    
    def __str__(self) -> str:
        return self.user.username


    
class StreamCategory(models.Model):
    DEFAULT_CATEGORY_IMG = "images/live/category_thumbs/default.png"
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=25, blank=False)
    color_hex = models.CharField('Category color theme', default='#c94035', max_length=10)
    category_img = models.ImageField('Category Image', upload_to='images/live/category_thumbs', default=DEFAULT_CATEGORY_IMG)
    watching_count = models.PositiveIntegerField(default=0)
    total_views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title
    
    def get_absolute_url(self):
        return reverse('delete_category', kwargs={'id': self.id})
    
   
class StreamerSettings(models.Model):
    profile = models.OneToOneField(StreamerProfile, on_delete=models.CASCADE, primary_key=True, editable=False, blank=True, related_name="profile_settings")
    next_stream_title = models.CharField(max_length=120, default="I'm live. Join me now!")
    next_stream_category = models.OneToOneField(StreamCategory, default=None, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self) -> str:
        return f"{self.profile.user.username} stream settings"
    
    

class StreamLive(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=120, default="I'm live. Join me now!")
    streamer = models.ForeignKey(StreamerProfile,related_name="streams", on_delete=models.CASCADE)
    watching_count = models.PositiveIntegerField(default=0)
    total_views_count = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(StreamCategory, related_name="current_streams", on_delete=models.SET_NULL, blank=True, null=True)
    banned_chat_users = models.ManyToManyField(
        "self", symmetrical=False
    )
    shared_count = models.PositiveIntegerField(default=0)
    thumbnail_img = models.ImageField('Stream Thumbnail Image', upload_to='images/live/thumbnails', blank=True, null=True)
    started_at = models.DateTimeField(default=timezone.now)
    ended_at = models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self) -> str:
        return self.title
    
  

class StreamChatMsg(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    author = models.OneToOneField(User, on_delete=models.SET_NULL, blank=True, null=True)
    message = models.CharField(default="", max_length=350)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.author.username


class StreamReport(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True)
    issued_by = models.ForeignKey(User, related_name="streamers_reported", on_delete=models.CASCADE)
    report_reason = models.CharField(choices=report_reasons.CHOICES)
    reported_stream = models.ForeignKey(StreamLive, related_name="reported", on_delete=models.CASCADE)
    reported_profile = models.ForeignKey(StreamerProfile, related_name="reported", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)






