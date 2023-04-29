import sys
import math
import random
from faker import Faker
from api.models import User, Post, Comment, Hashtag, User_Profile, Reported_Post
from api.constants.genders import GENDERS
from api.constants.relationships import RELATIONSHIPS
from api.constants.countries import COUNTRIES

fake = Faker()

def pick_random_user():
    return User.objects.order_by('?').first()

def pick_random_hashtag():
    return Hashtag.objects.order_by('?').first()

def pick_random_post():
    return Post.objects.order_by('?').first()

def generate_user():
    user, created = User.objects.get_or_create(
        username=fake.user_name(),
        email=fake.email(),
        password='a',
        phone=fake.phone_number(),
        recovery_email=fake.email(),
        recovery_phone=fake.phone_number(),
    )
    if created == False:
        user.after_create()

    user_profile = User_Profile.objects.get(user=user)
    user_profile.given_name = fake.first_name()
    user_profile.last_name = fake.last_name()
    user_profile.bio = fake.text()
    user_profile.date_of_birth = fake.date_of_birth(minimum_age=8, maximum_age=115)
    user_profile.gender = random.choice(GENDERS)
    user_profile.relationship = random.choice(RELATIONSHIPS)
    user_profile.country = random.choice(list(COUNTRIES.keys()))
    user_profile.website = fake.url()
    user_profile.save()

def generate_hashtag():
    hashtag, created = Hashtag.objects.get_or_create(hashtag=fake.word())
    return hashtag

def generate_post():
    post = Post.objects.create( 
                        user=pick_random_user(), 
                        text_content=fake.text(), 
                        file_url=None,
                        post_type="text")
    
    for i in range(random.randint(1, 5)):
        #hashtag = generate_hashtag()
        hashtag = pick_random_hashtag()
        post.hashtags.add(hashtag)
    post.save()

def generate_comment():
    comment = Comment.objects.create(
                        user=pick_random_user(), 
                        post=pick_random_post(), 
                        comment_text=fake.text(),
                        file_url=None)
    
def generate_reported_post():
    report_reasons = [
        "This post is inappropriate",
        "This post contains spam",
        "This post violates the terms of service",
        "This post is hateful",
        "This post is misleading",
    ]

    reported_post, created = Reported_Post.objects.get_or_create(
                                    post=pick_random_user(),
                                    report_reason=random.choice(report_reasons))
    if created == False:
        reported_post.reported_x_times += 1
        reported_post.save()
    

def generate_fake_db(n):
    
    print(f"GENERATING {n} users, {n*3} hashtags, {n*2} posts, {n*4} comments, {n*3} followers and {math.floor(n * 0.5)} reported posts...")

    for i in range(n):
        generate_user()

    for i in range(n*3):
        generate_hashtag()
        
    for i in range(n*2):
        generate_post()

    print("Fake DB generated. Done.")

if __name__ == "__main__":
    fakes_to_generate = int(sys.argv[1])
    generate_fake_db(fakes_to_generate)