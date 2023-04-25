from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.db import models
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
    # removes email from REQUIRED_FIELDS
    REQUIRED_FIELDS = [] 

class UserMetadata(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    user_role = models.CharField(max_length=10, default="normal", 
                                choices=[
                                        ("guest", "Guest"), 
                                        ("normal", "Normal"), 
                                        ("mod", "Moderator"), 
                                        ("admin", "Administrator")])
                                        
    last_login_date = models.DateField(null=True, blank=True)
    account_creation_date = models.DateField(default=timezone.now)
    isverified_email = models.BooleanField(default=False)
    last_ipv4 = models.CharField(max_length=55, null=True, blank=True)
        
    class Meta:
        db_table = "users_metadata"
        verbose_name_plural = "UserMetadata"
