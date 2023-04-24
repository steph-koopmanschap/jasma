# from django.contrib.auth.base_user import BaseUserManager
# from django.db import models

# class CustomUserManager(BaseUserManager):
#     def create_user(self, username, password=None, **kwargs):
#         user = self.model(username=username, **kwargs)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, username, password=None, **kwargs):
#         user = self.create_user(username, password, **kwargs)
#         user.is_staff = True
#         user.is_superuser = True
#         user.save(using=self._db)
#         return user