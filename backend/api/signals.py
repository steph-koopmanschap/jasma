from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models.models import UserProfile, UserNotificationPreferences


@receiver(signal=post_save, sender=User)
def create_profile_and_prefs(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        UserNotificationPreferences.objects.create(user=instance)


@receiver(signal=post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()
