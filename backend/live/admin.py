from django.contrib import admin
from .models.models import StreamCategory, StreamerProfile, StreamLive, StreamChatMsg
# Register your models here.

admin.site.register(StreamerProfile)
admin.site.register(StreamChatMsg)
admin.site.register(StreamCategory)
admin.site.register(StreamLive)