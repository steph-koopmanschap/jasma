from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

# Custom user model
# Login:
# authenticate(email=email, password=password)
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    # changes email to unique and blank to false
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(('email address'), max_length=50, unique=True) 
    email_verified = models.BooleanField(default=False)
    # removes email from REQUIRED_FIELDS
    REQUIRED_FIELDS = [] 
