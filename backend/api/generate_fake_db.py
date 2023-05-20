import sys
import math
import datetime
import random
from faker import Faker
from django.db.utils import IntegrityError
from api.models import User, Post, Comment, Hashtag, UserProfile, Reported_Post, Following, Subscribed_Hashtag, Bookmarked_Post, Ad
from api.constants import countries, genders, relationships

fake = Faker()

def pick_random_user():
    return User.objects.order_by('?').first()

def pick_random_hashtag():
    return Hashtag.objects.order_by('?').first()

def pick_random_post():
    return Post.objects.order_by('?').first()

def generate_user():
    created = False
    while created == False:
        username = fake.user_name()
        email = fake.email()
        phone = fake.phone_number()
        recovery_email = fake.email()
        recovery_phone = fake.phone_number()
        try:
            user, created = User.objects.get_or_create(
                username=username,
                email=email,
                password='X',
                phone=phone,
                recovery_email=recovery_email,
                recovery_phone=recovery_phone,
            )
        except IntegrityError:
            # If the email already exists, try again with a new email
            continue
    #if created == False:
    user.after_create()

    user_profile = UserProfile.objects.get(user=user)
    user_profile = UserProfile.objects.get(user=user)
    user_profile.given_name = fake.first_name()
    user_profile.last_name = fake.last_name()
    user_profile.bio = fake.text()
    user_profile.date_of_birth = fake.date_of_birth(minimum_age=8, maximum_age=115)
    user_profile.gender = random.choice(genders.LIST)
    user_profile.relationship = random.choice(relationships.LIST)
    user_profile.country = random.choice(list(countries.NAME_ABBR.keys()))
    user_profile.website = fake.url()
    user_profile.save()

def generate_user_relationship():
    user = None
    relationship_with = None
    # Cant have a relationship with yourself
    while user == relationship_with:
        user = pick_random_user()
        relationship_with = pick_random_user()

    user_profile = UserProfile.objects.get(user=user)
    user_profile = UserProfile.objects.get(user=user)
    user_profile.relationship_with = relationship_with
    user_profile.save()

def generate_hashtag():
    created = False
    while created == False:
        hashtag = fake.word()
        hashtag, created = Hashtag.objects.get_or_create(hashtag=hashtag)
        
    return hashtag

def generate_post():
    post = Post.objects.create( 
                        user=pick_random_user(), 
                        text_content=fake.text(), 
                        file_url=None,
                        post_type="text")
    
    for _ in range(random.randint(1, 5)):
        hashtag = pick_random_hashtag()
        post.hashtags.add(hashtag)
    post.save()

def generate_comment():
    Comment.objects.create(
                        user=pick_random_user(), 
                        post=pick_random_post(), 
                        text_content=fake.text(),
                        file_url=None)
    
def generate_reported_post():
    report_reasons = [
        "This post is inappropriate",
        "This post contains spam",
        "This post violates the terms of service",
        "This post is hateful",
        "This post is misleading",
    ]
    post = pick_random_post()
    report_reason = random.choice(report_reasons)
    try:
        # First check if the post has already been reported
        reported_post = ReportedPost.objects.get(post=post)
        if reported_post is not None:
            # if it has already been reported then increase the number of reports
            reported_post.reported_x_times += 1
            reported_post.save()
    except ReportedPost.DoesNotExist:
        # If not reported, create a new report for the post
        ReportedPost.objects.create(post=post,
                                    report_reason=report_reason)

def generate_follower():
    user = None
    follow_new_person = None
    created = False
    while user == follow_new_person and created == False:
        user = pick_random_user()
        follow_new_person = pick_random_user()
        if user != follow_new_person:
            _, created = Following.objects.get_or_create(
                                            user=user,
                                            following=follow_new_person)

def generate_subscribed_hashtags():
    created = False
    while created == False:
        user = pick_random_user()
        hashtag = pick_random_hashtag()
        _, created = SubscribedHashtag.objects.get_or_create(
                                        user=user, 
                                        hashtag=hashtag)

def generate_bookmarked_post():
    created = False
    while created == False:
        user = pick_random_user()
        post = pick_random_post()
        _, created = BookmarkedPost.objects.get_or_create(
                                        user=user,
                                        post=post)

def generate_ad():
    now = datetime.datetime.now()
    one_year_future = now + datetime.timedelta(days=365)
    expires_at = fake.date_time_between_dates(now, one_year_future)
    age_start = 0
    age_end = 0
    while age_start != age_end and age_start <  age_end:
        age_start = random.randint(18, 100)
        age_end = random.randint(18, 100)
    Ad.objects.get_or_create(
                                user=pick_random_user(),
                                ad_name=fake.word(),
                                text_content=fake.text(),
                                ad_file_url=None,
                                ad_url=None,
                                expires_at=expires_at,                                targ_age_start=age_start,
                                targ_age_end=age_end,
                                targ_gender=random.choice(genders.LIST),
                                targ_relationship=random.choice(relationships.LIST),
                                targ_country=random.choice(list(countries.NAME_ABBR.keys())),
                                targ_city=fake.city())

def generate_fake_db(n):
    OK = "[\033[32m OK \033[0m]" #Green colored [ OK ]
    print(f"GENERATING {n} users, {n*3} hashtags, {n*2} posts, {n*4} comments, {n*3} followers, {math.floor(n * 0.1)} ads, {n*3} followers, {n*3} bookmarked posts, and {math.floor(n * 0.5)} reported posts...")

    print("Generating fake users...")
    for _ in range(n):
        generate_user()

    # 20% of users are in a relationship with another user
    for _ in range(math.floor(n * 0.2)):
        generate_user_relationship()
    print(f"{OK} Done user generation.")

    print("Generating fake hashtags...")
    for _ in range(n*3):
        generate_hashtag()
    print(f"{OK} Done hashtag generation.")
    
    print("Generating fake posts...")
    for _ in range(n*2):
        generate_post()
    print(f"{OK} Done post generation.")

    print("Generating fake comments...")
    for _ in range(n*4):
        generate_comment()
    print(f"{OK} Done comment generation.")

    # 25% of posts
    print("Generating fake reported posts...")
    for _ in range(math.floor(n * 0.5)):
        generate_reported_post()
    print(f"{OK} Done reported post generation.")

    print("Generating fake followers...")
    for _ in range(n*3):
        generate_follower()
    print(f"{OK} Done follower generation.")

    print("Generating fake subscribed hashtags...")
    for _ in range(n*2):
        generate_subscribed_hashtags()
    print(f"{OK} Done subscribed hashtag generation.")

    print("Generating fake bookmarked posts...")
    for _ in range(n*3):
        generate_bookmarked_post()
    print(f"{OK} Done bookmarked post generation.")

    # 10% of users
    print("Generating fake ads...")
    for _ in range(math.floor(n * 0.1)):
        generate_ad()
    print(f"{OK} Done ad generation.")

    print("Creating admin account...")
    admin = User.objects.create(
        username="admintest",
        email="admintest@gmail.com",
        password="admin",        
    )
    admin.after_create()
    print("Admin account created.")

    print(f"{OK} Fake DB generated. Done.")

if __name__ == "__main__":
    fakes_to_generate = int(sys.argv[1])
    generate_fake_db(fakes_to_generate)

