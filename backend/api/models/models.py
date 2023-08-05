from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import validate_ipv4_address, MaxValueValidator, MinValueValidator
from django.contrib.auth import get_user_model

from api.validators import validate_image_file_size
from api.constants import user_roles, relationships, genders, education, countries


# Custom user model
# Login:
# authenticate(username=email, password=password)
class User(AbstractUser):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]


    id = models.UUIDField("User id", primary_key=True,
                        default=uuid4, editable=False)
    email = models.EmailField("Email address", max_length=254, unique=True)
    email_verified = models.BooleanField(default=False)
    recovery_email = models.EmailField(
        "Recovery email", max_length=254, blank=True)
    # TODO: From experience you want better validation than this at the DB level
    # This will need research and a lot of validation
    phone = models.CharField("Phone number", max_length=17, blank=True)
    recovery_phone = models.CharField(
        "Recovery phone number", max_length=17, blank=True)
    # TODO: This souldn"t be here. Guess it shoud be in a related model instead.
    balance = models.DecimalField(
        max_digits=19, decimal_places=4, default=0, validators=[MinValueValidator(0)])
    last_ipv4 = models.CharField("Last ipv4",
                                max_length=55, default="0.0.0.0", blank=True, validators=[validate_ipv4_address])
    user_role = models.CharField("User role",
                                max_length=10, default="normal", choices=user_roles.CHOICES)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Caused foreign key conflict error on save. Rewritten in signals.py file
    
    # def save(self, *args, **kwargs) -> None:
    #     """ Modifies save so the UserProfile and UserNotificationPreferences
    #     get created at User creation.
    #     """
        
    #     if self._state.adding:
    #         UserProfile.objects.create(user=self)
    #         UserNotificationPreferences.objects.create(user=self)
    #     super().save(*args, **kwargs)

    # TODO: We could probably use a string representation
    def __str__(self):
        return self.username

    # NOTE: previous comment were true. Lets rename.
    # NOTE: Do we need that metric? If so we would need somewhere else to store that information.
    @classmethod
    def post_count(cls):
        return Post.objects.count()

    @property
    def post_count(self):
        return self.posts.count()

    # NOTE: previous comment were true. Lets rename.
    @classmethod
    def comment_count(cls):
        return Comment.objects.count()

    @property
    def comment_count(self):
        return self.comments.count()

    # NOTE: previous comment were true. Lets rename.
    # TODO: Maybe restrict to users with ad priviledge.
    @classmethod
    def ad_count(cls):
        return Ad.objects.count()

    @property
    def ad_count(self):
        return self.ads.count()
    
# Track at which time and at which ip the users login
class UserLoginHistory(models.Model):
    user = models.ForeignKey(User, related_name="login_history", on_delete=models.CASCADE)
    login_ipv4 = models.CharField(max_length=55, default="0.0.0.0", blank=True, validators=[validate_ipv4_address])
    login_time = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "user_login_history"
        verbose_name_plural = "UserLoginHistory"

class UserProfile(models.Model):
    
    DEFAULT_PROFILE_PIC = "images/avatars/default-profile-pic.webp"
    def get_default_profile_pic(self):
        return self.DEFAULT_PROFILE_PIC

    user = models.OneToOneField(User, related_name="profile",
        on_delete=models.CASCADE, primary_key=True, editable=False) 
    profile_pic = models.ImageField("Profile picture", 
         upload_to="images/avatars/", 
         default=DEFAULT_PROFILE_PIC, 
        validators=[validate_image_file_size]
    )
    given_name = models.CharField(max_length=35, blank=True)
    last_name = models.CharField(max_length=35, blank=True)
    display_name = models.CharField(max_length=70, blank=True)
    bio = models.CharField(max_length=5000, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=11, blank=True, choices=genders.CHOICES)
    relationship = models.CharField(
        max_length=11, blank=True, choices=relationships.CHOICES)
    relationship_with = models.ForeignKey(
        User, related_name="relationship_with", on_delete=models.CASCADE, null=True, blank=True)
    language = models.CharField(max_length=100, blank=True)
    job_company = models.CharField(max_length=100, blank=True)
    job_industry = models.CharField(max_length=100, blank=True)
    job_role = models.CharField(max_length=100, blank=True)
    education = models.CharField(max_length=16, choices=education.CHOICES, blank=True)
    country = models.CharField(max_length=100, blank=True, choices=countries.CHOICES)
    city = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=300, blank=True)

    @property
    def full_name(self):
        return f"{self.given_name} {self.last_name}"

    def __str__(self):
        return f"{self.full_name} {self.user.id} profile"

    class Meta:
        db_table = "users_profiles"
        verbose_name_plural = "UsersProfiles"

class UserNotificationPreferences(models.Model):
    user = models.OneToOneField(
        User, related_name="notification_preferences", 
        on_delete=models.CASCADE, primary_key=True, editable=False)
    is_all_email = models.BooleanField(default=True)
    is_all_push = models.BooleanField(default=True)
    is_all_inapp = models.BooleanField(default=True)
    is_comment_on_post_email = models.BooleanField(default=True)
    is_comment_on_post_inapp = models.BooleanField(default=True)
    is_comment_on_post_push = models.BooleanField(default=True)
    is_new_follower_email = models.BooleanField(default=True)
    is_new_follower_inapp = models.BooleanField(default=True)
    is_new_follower_push = models.BooleanField(default=True)
    is_following_new_post_email = models.BooleanField(default=True)
    is_following_new_post_inapp = models.BooleanField(default=True)
    is_following_new_post_push = models.BooleanField(default=True)

    # TODO: This looks weird. Prints the user_id? Maybe edit the string.
    def __str__(self):
        return f"{self.user.id} preferences"

    class Meta:
        db_table = "users_notification_preferences"
        verbose_name_plural = "UsersNotificationPreferences"
        
class Hashtag(models.Model):
    id = models.CharField(max_length=50, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

    class Meta:
        db_table = "hashtags"
        verbose_name_plural = "Hashtags"

# TODO: I have to circle back to this to handle files.

class PostManager(models.Manager):
    """ 
    Overwite the create method to insure non-exixting hashtags are created before post creation.
    """
    def create(self, *args, **kwargs):
        provided_hashtags = kwargs.pop("hashtags", [])
        actual_hashtags = []
        
        if provided_hashtags:
            for tag in provided_hashtags:
                hashtag, _ = Hashtag.objects.get_or_create(id=tag)
                actual_hashtags.append(hashtag)

        post = super().create(*args, **kwargs)
        post.hashtags.set(actual_hashtags)
        return post

class Post(models.Model):
    objects = PostManager()
    
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    # Cascade could be problematic.
    user = models.ForeignKey(User, related_name="posts",
                            on_delete=models.CASCADE)
    text_content = models.CharField(max_length=40000)
    file_url = models.URLField(max_length=300, null=True, blank=True)
    post_type = models.CharField(max_length=5, default="text",
                                choices=[
                                    ("text", "Text"),
                                    ("image", "Image"),
                                    ("video", "Video"),
                                    ("audio", "Audio")])
    hashtags = models.ManyToManyField(
        Hashtag, related_name="posts", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)


    def __str__(self):
        return f"{self.id}"

    class Meta:
        db_table = "posts"
        verbose_name_plural = "Posts"
        ordering = ["-created_at"]

# This stores a reference to the post that was deleted, 
# because we can no longer retrieve the post info after its deleted.
# It only stores the post id, and when a post was created not the whole post info.
# This is mainly used for analytics purposes.
class DeletedPostReference(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    post_id = models.UUIDField(editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    delete_reason = models.CharField(max_length=17, choices=[
                                        ("user deleted", "User deleted"),
                                        ("moderator deleted", "Moderator deleted"),
                                        # audo deleted = Deleted by AI (feature not yet implemented)
                                        ("auto deleted", "Auto deleted")])
    # When the post was orginially created
    created_at = models.DateTimeField(blank=False)
    # When the post was deleted
    deleted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Deleted id: {self.post_id} at: {self.deleted_at}"

    class Meta:
        db_table = "deleted_posts_references"
        verbose_name_plural = "DeletedPostReferences"
        ordering = ["-created_at"]

class Comment(models.Model):
    id = models.UUIDField("Comment id",
                        default=uuid4, primary_key=True, editable=False)
    post = models.ForeignKey(
        Post, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(
        User, related_name="comments", on_delete=models.CASCADE)
    text_content = models.CharField(max_length=10000)
    file_url = models.URLField(max_length=300, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.comment_id}"

    class Meta:
        db_table = "comments"
        verbose_name_plural = "Comments"
        ordering = ["-created_at"]

class ReportedPost(models.Model):
    report_id = models.UUIDField(
        default=uuid4, primary_key=True, editable=False)
    post = models.ForeignKey(Post, related_name="reported", on_delete=models.CASCADE)
    report_reason = models.CharField(max_length=300)
    reported_x_times = models.IntegerField(default=1, null=False, blank=False)
    first_report_time = models.DateTimeField(
        auto_now_add=True)
    last_report_time = models.DateField(auto_now=True, null=True)

    def __str__(self):
        return f"Reported post {self.post.post_id} - reported for {self.report_reason} ({self.reported_x_times} times)"

    @staticmethod
    def format_reported_post_dict(reported_posts):
        result = []
        for reported_post in reported_posts:
            reported_post_dict = ReportedPost.format_reported_post_dict(
                reported_post)
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
        db_table = "reported_posts"
        verbose_name_plural = "ReportedPosts"
        constraints = [
            models.UniqueConstraint(
                fields=["post"], name="unique_reported_post")
        ]
 
class Ad(models.Model):
    id = models.UUIDField("ad id", default=uuid4,
                        primary_key=True, editable=False)
    user = models.ForeignKey(User, related_name="ads",
                            on_delete=models.CASCADE)
    ad_name = models.CharField(max_length=50)
    bid_price = models.DecimalField(
        max_digits=19, decimal_places=4, default=1, validators=[MinValueValidator(1)])
    text_content = models.CharField(max_length=1000)
    # The image or video or audio for the ad.
    ad_file_url = models.URLField(max_length=300, blank=True)
    ad_url = models.URLField(max_length=300, blank=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    # Parameters for targeting a user / demographic with this ad.
    targ_hashtags = models.ManyToManyField(
        Hashtag, related_name="ads", blank=True)
    # Targeting ads to minors is not allowed.
    targ_age_start = models.SmallIntegerField(blank=True,
                                            validators=[MinValueValidator(18), MaxValueValidator(125)])
    targ_age_end = models.SmallIntegerField(blank=True,
                                            validators=[MinValueValidator(18), MaxValueValidator(125)])
    targ_gender = models.CharField(
        max_length=11, blank=True, choices=genders.CHOICES)
    targ_relationship = models.CharField(
        max_length=11, blank=True, choices=relationships.CHOICES)
    targ_education = models.CharField(max_length=16, choices=education.CHOICES, blank=True)
    targ_job_industry = models.CharField(max_length=100, blank=True)
    targ_job_role = models.CharField(max_length=100, blank=True)
    # Shouldn"t this be a choice?
    targ_country = models.CharField(max_length=100, blank=True)
    targ_city = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.ad_name} ad_id: {self.id}"

    class Meta:
        db_table = "ads"
        verbose_name_plural = "Ads"

class Transaction(models.Model):
    transaction_id = models.UUIDField(
        default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, related_name="transactions", on_delete=models.CASCADE)
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
        db_table = "transactions"
        verbose_name_plural = "Transactions"

class BookmarkedPost(models.Model):
    user = models.ForeignKey(User, related_name="bookmarked_posts", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="bookmarked", on_delete=models.CASCADE)
    bookmarked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bookmarked post {self.post.id} - by {self.user.id}"

    class Meta:
        db_table = "bookmarked_posts"
        verbose_name_plural = "BookmarkedPosts"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"], name="composite_pk_on_bookmarked_posts")
        ]

# user_id follows follow_id. follow_id is followed by user_id
class Following(models.Model):
    follower = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    followee = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
 

    def __str__(self):
        return f"User: {self.follower.id} Follows: {self.followee.id}"

    class Meta:
        db_table = "following"
        verbose_name_plural = "followings"
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "followee"], name="composite_pk_on_following")
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
    user = models.ForeignKey(User, related_name="sucribed_hashtags", on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag, related_name="suscribees", on_delete=models.CASCADE)

    def __str__(self):
        return f"User: {self.user.id} Subscribed to hashtag: {self.hashtag.hashtag}"

    class Meta:
        db_table = "subscribed_hashtags"
        verbose_name_plural = "SubscribedHashtags"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "hashtag"], name="composite_pk_on_subscribed_hashtags")
        ]

class UserFeedback(models.Model):
    feedback_id = models.UUIDField(
        default=uuid4, primary_key=True, editable=False)
    rating = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=False)
    review = models.CharField(max_length=750, null=False)
    feedback_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback: {self.feedback_id} - {self.feedback_date}"

    class Meta:
        db_table = "userfeedback"

class BugReport(models.Model):
    bug_report_id = models.UUIDField(
        default=uuid4, primary_key=True, editable=False)
    report_description = models.CharField(max_length=5000, null=False)
    bug_report_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bug report: {self.bug_report_id} - {self.bug_report_time}"

    class Meta:
        db_table = "bug_reports"
        verbose_name_plural = "BugReports"
