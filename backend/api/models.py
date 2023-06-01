# TODO: Do we really need null=True everywhere? null=True saves null values as NULL in DB.
# The only time this is really usefull is when blank=True on charfields as it allow to distinguish between
# a blank value and no value set.
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import models
from django.core.validators import validate_ipv4_address, MaxValueValidator, MinValueValidator
from uuid import uuid4
from api.constants import user_roles, relationships, genders

# Custom user model
# Login:
# authenticate(email=email, password=password)
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    # changes email to unique and blank to false
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(('email address'), max_length=50, unique=True)
    email_verified = models.BooleanField(default=False)
    recovery_email = models.EmailField(max_length=55, null=True, blank=True)
    phone = models.CharField(max_length=55, null=True, blank=True)
    recovery_phone = models.CharField(max_length=55, null=True, blank=True)
    balance = models.DecimalField(
        max_digits=19, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    last_ipv4 = models.CharField(max_length=55, default="0.0.0.0",
                                null=True, blank=True, validators=[validate_ipv4_address])
    user_role = models.CharField(
        max_length=10, default="normal", choices=user_roles.CHOICES)
    #total_created_posts = models.IntegerField(default=0)
    #total_created_comments = models.IntegerField(default=0)
    #total_created_ads = models.IntegerField(default=0)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def after_create(self):
        user_profile = UserProfile(user=self)
        user_notification_preferences = UserNotificationPreferences(user=self)
        user_profile.save()
        user_notification_preferences.save()

    def format_user_dict(self):
        return {
            "user_id": self.id,
            "username": self.username,
            "email": self.email,
            "user_role": self.user_role
        }

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    profile_pic_url = models.URLField(max_length=300, default=f"{settings.MEDIA_URL}images/avatars/default-profile-pic.webp")
    given_name = models.CharField(max_length=35, null=True, blank=True)
    last_name = models.CharField(max_length=35, null=True, blank=True)
    display_name = models.CharField(max_length=70, null=True, blank=True)
    bio = models.CharField(max_length=5000, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=11, null=True, blank=True, choices=genders.CHOICES)
    relationship = models.CharField(max_length=11, null=True, blank=True, choices=relationships.CHOICES)
    relationship_with = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="relationships_with")
    language = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(max_length=300, null=True, blank=True)

    def __str__(self):
        return str(self.given_name) + " " + str(self.last_name) + " " + str(self.user.id)

    def format_user_profile_dict(self):
        return {
            "user_id": self.user.id,
            "given_name": self.given_name,
            "last_name": self.last_name,
            "display_name": self.display_name,
            "bio": self.bio,
            "date_of_birth": self.date_of_birth,
            "gender": self.gender,
            "relationship": self.relationship,
            "relationship_with": self.relationship_with,
            "language": self.language,
            "country": self.country,
            "city": self.city,
            "website": self.website
        }

    class Meta:
        db_table = "users_profiles"
        verbose_name_plural = "UsersProfiles"

class UserNotificationPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_all_email = models.BooleanField(default=True)
    is_all_push = models.BooleanField(default=True)
    is_all_inapp = models.BooleanField(default=True)
    is_comment_on_post_email = models.BooleanField(default=True)
    is_new_follower_email = models.BooleanField(default=True)
    is_comment_on_post_push = models.BooleanField(default=True)
    is_new_follower_push = models.BooleanField(default=True)
    is_comment_on_post_inapp = models.BooleanField(default=True)
    is_new_follower_inapp = models.BooleanField(default=True)

    def __str__(self):
        return str(self.user.id)

    class Meta:
        db_table = "users_notification_preferences"
        verbose_name_plural = "UsersNotificationPreferences"

class Ad(models.Model):
    ad_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ad_name = models.CharField(max_length=50)
    text_content = models.CharField(max_length=1000)
    ad_file_url = models.URLField(max_length=300, null=True, blank=True)
    ad_url = models.URLField(max_length=300, null=True, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    targ_age_start = models.SmallIntegerField(null=True, blank=True, validators=[
                                            MinValueValidator(18), MaxValueValidator(125)])
    targ_age_end = models.SmallIntegerField(null=True, blank=True, validators=[
                                            MinValueValidator(18), MaxValueValidator(125)])
    targ_gender = models.CharField(
        max_length=11, null=True, blank=True, choices=genders.CHOICES)
    targ_relationship = models.CharField(
        max_length=11, null=True, blank=True, choices=relationships.CHOICES)
    targ_country = models.CharField(max_length=100, null=True, blank=True)
    targ_city = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return str(self.ad_name) + " ad_id: " + str(self.ad_id)

    class Meta:
        db_table = "ads"
        verbose_name_plural = "Ads"

class Hashtag(models.Model):
    hashtag = models.CharField(max_length=50, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.hashtag)

    class Meta:
        db_table = "hashtags"
        verbose_name_plural = "Hashtags"

class Post(models.Model):
    post_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)  # Cascade could be problematic.
    text_content = models.CharField(max_length=40000)
    file_url = models.URLField(max_length=300, null=True, blank=True)
    post_type = models.CharField(max_length=5, default='text',
                                choices=[
                                    ("text", "Text"),
                                    ("image", "Image"),
                                    ("video", "Video"),
                                    ("audio", "Audio")])
    hashtags = models.ManyToManyField(
        Hashtag, related_name='posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return str(self.post_id)

    # Returns a list of post instances in a dict format with hashtags as an array
    @staticmethod
    def format_posts_dict(posts):
        result = []
        for post in posts:
            post_dict = Post.format_post_dict(post)
            result.append(post_dict)

        return result

    # Returns a post instance in a dict format with hashtags as an array
    @staticmethod
    def format_post_dict(post):
        post_dict = {
            "post_id": post.post_id,
            "user_id": post.user_id,
            "text_content": post.text_content,
            "file_url": post.file_url,
            "post_type": post.post_type,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "hashtags": [hashtag.hashtag for hashtag in post.hashtags.all()]
        }
        return post_dict

    class Meta:
        db_table = "posts"
        verbose_name_plural = "Posts"
        ordering = ["-created_at"]

class Comment(models.Model):
    comment_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text_content = models.CharField(max_length=10000)
    file_url = models.URLField(max_length=300, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return str(self.comment_id)

    # Returns a list of comment instances in a dict format.
    @staticmethod
    def format_comments_dict(comments):
        result = []
        for comment in comments:
            comment_dict = Comment.format_comment_dict(comment)
            result.append(comment_dict)

        return result

    # Returns a comment instance in a dict format.
    @staticmethod
    def format_comment_dict(comment):
        comment_dict = {
            "comment_id": comment.comment_id,
            "post_id": comment.post.post_id,
            "user_id": comment.user.id,
            "text_content": comment.text_content,
            "file_url": comment.file_url,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at
        }
        return comment_dict

    class Meta:
        db_table = "comments"
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]

class ReportedPost(models.Model):
    report_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    report_reason = models.CharField(max_length=300)
    reported_x_times = models.IntegerField(default=1, null=False, blank=False)
    first_report_time = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    last_report_time = models.DateField(auto_now=True, null=True)

    def __str__(self):
        return f"Reported post {self.post.post_id} - reported for {self.report_reason} ({self.reported_x_times} times)"

    @staticmethod
    def format_reported_post_dict(reported_posts):
        result = []
        for reported_post in reported_posts:
            reported_post_dict = ReportedPost.format_reported_post_dict(reported_post)
            result.append(reported_post_dict)
        return result

    @staticmethod
    def format_reported_post_dict(reported_post):
        reported_post_dict = {
            "post_id": reported_post.post.post_id,
            "report_reason": reported_post.report_reason,
            "reported_x_times": reported_post.reported_x_times,
            "first_report_time": reported_post.first_report_time,
            "last_report_time": reported_post.last_report_time
        }
        return reported_post_dict

    class Meta:
        db_table = 'reported_posts'
        verbose_name_plural = 'ReportedPosts'
        constraints = [
            models.UniqueConstraint(
                fields=['post'], name='unique_reported_post')
        ]

class Transaction(models.Model):
    transaction_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_status = models.CharField(max_length=50)
    status_reason = models.CharField(max_length=100)
    transaction_type = models.CharField(max_length=11)
    price = models.DecimalField(max_digits=19, decimal_places=4)
    payment_method = models.CharField(max_length=100)
    transaction_date = models.DateTimeField()
    last_updated = models.DateTimeField()

    def __str__(self):
        return f"Transaction: {self.transaction_id} - {self.transaction_status} ({self.transaction_type})"

    class Meta:
        db_table = 'transactions'
        verbose_name_plural = 'Transactions'

class BookmarkedPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    bookmarked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bookmarked post {self.post.post_id} - by {self.user.id}"

    class Meta:
        db_table = 'bookmarked_posts'
        verbose_name_plural = 'BookmarkedPosts'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'], name='composite_pk_on_bookmarked_posts')
        ]

# user_id follows follow_id. follow_id is followed by user_id
class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fallowers')
    following = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='fallowings')

    def __str__(self):
        return f"User: {self.user.id} Follows: {self.following.id}"

    class Meta:
        db_table = 'following'
        verbose_name_plural = 'followings'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'following'], name='composite_pk_on_following')
        ]

# Is it possible for a user to be subscribed to hashtag that has been deleted or does not exist?
# ---
# it is not possible to keep a foreign key relationship intact after the referenced object has been deleted.
# When the hashtag is deleted, it will trigger a cascading delete of all related SubscribedHashtag objects.
# However, you could create a custom delete method for the Hashtag model which marks the hashtag as deleted instead of deleting it.
# You could add a boolean field called is_deleted to the Hashtag model and set it to True when the delete method is called.
# Then, modify the queries in your views and templates to exclude any deleted hashtags.
# Another option would be to create a separate table to store the subscription information, instead of using a foreign key relationship with the Hashtag model.
# This table could have a field for the hashtag name or ID, and the subscription status could be updated even if the original hashtag is deleted.
class SubscribedHashtag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag, on_delete=models.CASCADE)

    def __str__(self):
        return f"User: {self.user.id} Subscribed to hashtag: {self.hashtag.hashtag}"

    class Meta:
        db_table = 'subscribed_hashtags'
        verbose_name_plural = 'SubscribedHashtags'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'hashtag'], name='composite_pk_on_subscribed_hashtags')
        ]

class UserFeedback(models.Model):
    feedback_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    rating = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=False)
    review = models.CharField(max_length=750, null=False)
    feedback_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback: {self.feedback_id} - {self.feedback_date}"

    class Meta:
        db_table = "userfeedback"

class BugReport(models.Model):
    bug_report_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    report_description = models.CharField(max_length=5000, null=False)
    bug_report_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bug report: {self.bug_report_id} - {self.bug_report_time}"

    class Meta:
        db_table = 'bug_reports'
        verbose_name_plural = 'BugReports'
