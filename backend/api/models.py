from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import models
from django.core.validators import validate_ipv4_address, MaxValueValidator, MinValueValidator
from uuid import uuid4

# Custom user model
# Login:
# authenticate(email=email, password=password)
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    # changes email to unique and blank to false
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(('email address'), max_length=50, unique=True) 
    email_verified = models.BooleanField(default=False)
    recovery_email = models.EmailField(max_length=55, null=True, blank=True)
    phone = models.CharField(max_length=55, null=True, blank=True)
    recovery_phone = models.CharField(max_length=55, null=True, blank=True)
    last_ipv4 = models.CharField(max_length=55, default="0.0.0.0", null=True, blank=True, validators=[validate_ipv4_address])
    user_role = models.CharField(max_length=10, default="normal", 
                                choices=[
                                        ("guest", "Guest"), 
                                        ("normal", "Normal"), 
                                        ("mod", "Moderator"), 
                                        ("admin", "Administrator")])
    # removes email from REQUIRED_FIELDS
    REQUIRED_FIELDS = [] 

    def after_create(self):
        user_metadata = User_Metadata(user=self)
        user_profile = User_Profile(user=self)
        user_notification_preferences = User_Notification_Preferences(user=self)
        
        user_metadata.save()
        user_profile.save()
        user_notification_preferences.save()

class User_Metadata(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    last_login_date = models.DateField(null=True, blank=True)
    account_creation_date = models.DateField(default=timezone.now)    
        
    class Meta:
        db_table = "users_metadata"
        verbose_name_plural = "UsersMetadata"

class User_Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    profile_pic_url = models.URLField(max_length=300, default="http://localhost:8000/media/avatars/default-profile-pic.webp")
    given_name = models.CharField(max_length=35, null=True, blank=True)
    last_name = models.CharField(max_length=35, null=True, blank=True)
    display_name = models.CharField(max_length=70, null=True, blank=True)
    bio = models.CharField(max_length=5000, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=11, null=True, blank=True,
                                choices=[
                                        ("woman", "Woman"),
                                        ("man", "Man"),
                                        ("trans woman", "Trans Woman"),
                                        ("trans man", "Trans Man"), 
                                        ("other", "Other")])
    
    relationship = models.CharField(max_length=11, null=True, blank=True,
                                    choices=[
                                            ("single", "Single"), 
                                            ("married", "Married"), 
                                            ("partnership", "Partnership"), 
                                            ("open", "Open"), 
                                            ("poly", "Poly"), 
                                            ("other", "Other")])
    
    relationship_with = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    language = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(max_length=300, null=True, blank=True)

    def __str__(self):
        return str(self.given_name) + " " + str(self.last_name) + " " + str(self.user.id)
    
    class Meta:
        db_table = "users_profiles"
        verbose_name_plural = "UsersProfiles"
    
class User_Notification_Preferences(models.Model):
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
    ad_file_url = models.URLField(max_length=300)
    ad_url = models.URLField(max_length=300)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField() 
    targ_age_start = models.SmallIntegerField(null=True, blank=True, validators=[MinValueValidator(18), MaxValueValidator(125)])
    targ_age_end = models.SmallIntegerField(null=True, blank=True, validators=[MinValueValidator(18), MaxValueValidator(125)])
    targ_gender = models.CharField(max_length=11, null=True, blank=True, 
                                    choices=[
                                        ("woman", "Woman"),
                                        ("man", "Man"),
                                        ("trans woman", "Trans Woman"),
                                        ("trans man", "Trans Man"), 
                                        ("other", "Other")]) 

    targ_relationship = models.CharField(max_length=11, null=True, blank=True,
                                        choices=[
                                            ("single", "Single"), 
                                            ("married", "Married"), 
                                            ("partnership", "Partnership"), 
                                            ("open", "Open"), 
                                            ("poly", "Poly"), 
                                            ("other", "Other")])
    
    targ_country = models.CharField(max_length=50, null=True, blank=True)
    targ_city = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return str(self.ad_name) + " ad_id: " + str(self.ad_id)
    
    class Meta:
        db_table = "users_notification_preferences"
        verbose_name_plural = "UsersNotificationPreferences"

class Hashtag(models.Model):
    hashtag = models.CharField(max_length=50, primary_key=True)

    def __str__(self):
        return str(self.hashtag)

    class Meta:
        db_table = "hashtags"
        verbose_name_plural = "Hashtags"

class Post(models.Model):
    post_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text_content = models.CharField(max_length=40000)
    file_url = models.URLField(max_length=300)
    post_type = models.CharField(max_length=5, default='text', 
                                    choices=[
                                        ("text", "Text"), 
                                        ("image", "Image"), 
                                        ("video", "Video"),
                                        ("audio", "Audio")])
    
    hashtags = models.ManyToManyField(Hashtag, related_name='posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_edited_at = models.DateTimeField(null=True)

    def __str__(self):
        return str(self.post_id)
    
    class Meta:
        db_table = "posts"
        verbose_name_plural = "Posts"

class Comment(models.Model):
    comment_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=10000)
    file_url = models.URLField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.comment_id)

    class Meta:
        db_table = "comments"
        verbose_name_plural = "Comments"

class Reported_Post(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    report_reason = models.CharField(max_length=300)
    reported_x_times = models.IntegerField(default=1, null=False, blank=False)
    report_time = models.DateTimeField(null=False, blank=False)

    def __str__(self):
        return f"Reported post {self.post.post_id} - reported for {self.report_reason} ({self.reported_x_times} times)"

    class Meta:
        db_table = 'reported_posts'
        verbose_name_plural = 'ReportedPosts'

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

class Bookmarked_Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    bookmarked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bookmarked post {self.post.post_id} - by {self.user.id}"

    class Meta:
        db_table = 'bookmarked_posts'
        verbose_name_plural = 'BookmarkedPosts'
        unique_together = ['user', 'post']
        #constraints = [
        #    models.UniqueConstraint(fields=['user', 'post'], name='composite primary key')
        #   ]

class Following(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fallowers')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='fallowings')

    def __str__(self):
        return f"User: {self.user.id} Follows: {self.following.id}"

    class Meta:
        db_table = 'following'
        verbose_name_plural = 'followings'
        unique_together = ['user', 'following']

class Subscribed_Hashtag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hashtag = models.ForeignKey(Hashtag)

    def __str__(self):
        return f"User: {self.user.id} Subscribed to hashtag: {self.hashtag.hashtag}"

    class Meta:
        db_table = 'subscribed_hashtags'
        verbose_name_plural = 'SubscribedHashtags'
        unique_together = ['user', 'hashtag']

class UserFeedback(models.Model):
    feedback_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    rating = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], null=False)
    review = models.CharField(max_length=750, null=False)
    feedback_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback: {self.feedback_id} - {self.feedback_date}"

    class Meta:
        db_table = "userfeedback"

class Bug_Report(models.Model):
    bug_report_id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    report_description = models.CharField(max_length=5000, null=False)
    bug_report_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bug report: {self.bug_report_id} - {self.bug_report_time}"

    class Meta:
        db_table = 'bug_reports'
        verbose_name_plural = 'BugReports'