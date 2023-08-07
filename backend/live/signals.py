from django.db.models.signals import post_save
from .models.models import StreamerProfile, StreamerSettings
from django.dispatch import receiver


@receiver(signal=post_save, sender=StreamerProfile)
def create_settings(sender, instance, created, **kwargs):
    if created:
        StreamerSettings.objects.create(profile=instance)


@receiver(signal=post_save, sender=StreamerProfile)
def save_profile(sender, instance, **kwargs):
    instance.save()
