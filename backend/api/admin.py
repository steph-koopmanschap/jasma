from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from api import models

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(models.UserProfile)
admin.site.register(models.UserNotificationPreferences)
