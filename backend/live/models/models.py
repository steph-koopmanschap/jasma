from django.db import models
from api.models.models import User
from django.urls import reverse
from django.utils import timezone
from uuid import uuid4
# Create your models here.


class StreamerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, editable=False)
    stream_key = models.CharField(unique=True)
    is_banned = models.BooleanField(default=False)
    is_live = models.BooleanField(default=False)
    followers_count = models.PositiveIntegerField(default=0)
    total_views_count = models.PositiveIntegerField(default=0)
    followed_by = models.ManyToManyField(
        "self", blank=True, symmetrical=False
    )
    created_at = models.DateTimeField(default=timezone.now)
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
    
   
    
    

class StreamLive(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=120, default="I'm live. Join me now!")
    streamer = models.OneToOneField(StreamerProfile, on_delete=models.CASCADE)
    watching_count = models.PositiveIntegerField(default=0)
    total_views_count = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(StreamCategory, on_delete=models.SET_NULL, blank=True, null=True)
    banned_chat_users = models.ManyToManyField(
        "self", blank=True, symmetrical=False, null=True
    )
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









