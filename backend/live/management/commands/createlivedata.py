import random

import faker.providers
from django.core.management.base import BaseCommand
from faker import Faker
from live.models.models import StreamCategory, StreamerProfile, StreamerSettings, StreamLive
from api.models.models import User
from live.constants import ban_reasons
from django.utils import timezone
from uuid import uuid4



CATEGORIES = [
    "Games",
    "Movies",
    "Chatting"
]

CATEGORY_COLORS = [
    "#9e66ca",
    "#c94035",
    "#e759ad"
]

STREAM_PREFIX = 'jasma_live_'




class Provider(faker.providers.BaseProvider):
    def category(self):
        return self.random_element(CATEGORIES)
    def category_color(self):
        return self.random_element(CATEGORY_COLORS)
    def ban_reason(self):
        return self.random_choices(ban_reasons.CHOICES)
    

def create_live_data():
    fake = Faker(["nl_NL"])
    fake.add_provider(Provider)

    print("Creating categories...")

    for ind in range(3):
        title = CATEGORIES[ind]
        color = CATEGORY_COLORS[ind]
          
        StreamCategory.objects.create(title=title, total_views_count=random.randint(500, 2021410), color_hex=color)
    

    print("Creating users...")
    for _ in range(10):
        # generate_user()
        username = fake.user_name()
        email = fake.email()
        phone = fake.phone_number()
        recovery_email = fake.email()
        recovery_phone = fake.phone_number()
        User.objects.create(
            username=username,
            email=email,
            password='X',
            phone=phone,
            recovery_email=recovery_email,
            recovery_phone=recovery_phone,
        )

    print("Creating streamer profiles...")
    for user in User.objects.all():
        stream_key = STREAM_PREFIX + uuid4().hex
        StreamerProfile.objects.get_or_create(user_id=user.id, stream_key=stream_key)
        
    print("Updating streamer profiles...")
    for profile in StreamerProfile.objects.all():
        views = random.randint(0, 323252532)
        is_banned = views % 2 == 0
        profile.total_stream_time = views
        if is_banned:
            profile.is_banned = views % 2 == 0
            profile.last_ban_reason = fake.ban_reason()
        next_stream_title = f"I'm {fake.first_name()}. Join now!"
        StreamerSettings.objects.create(profile=profile, next_stream_title=next_stream_title)
        
        if is_banned:
            StreamLive.objects.create(title=next_stream_title, 
                                              streamer=profile, ended_at=timezone.now())
        else:
            StreamLive.objects.create(title=next_stream_title, 
                                              streamer=profile, ended_at=None)
            profile.is_live =True
            
        profile.save()


            

        
    print("Finalizing...")

    return StreamerProfile.objects.all().count()

class Command(BaseCommand):
    help = "Generate fake users, stream profiles, stream categories"

    def handle(self, *args, **kwargs):

        profiles = create_live_data()
        self.stdout.write(self.style.SUCCESS(f"Number of profiles: {profiles}"))