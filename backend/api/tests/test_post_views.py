from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import User, Post


class AuthViewTestCase(APITestCase):
    SESSION_KEY_REGEX = r"^[a-z0-9]{32}$"

    def force_authenticate(self, request, user=None, token=None):
        super().force_authenticate(request, user, token)

    @classmethod
    def setUpClass(cls):
        print(f"======SETTING UP {cls.__name__} ENVIRONMENT=======")
        super().setUpClass()
        cls.user1 = User.objects.create_user(
            username="user1",
            password="password1",
            email="user1@test1.test")

    def setUp(self):
        print(f"======SETTING UP {self._testMethodName}========")
        super().setUp()
        self.client.defaults["HTTP_USER_AGENT"] = "JasmaTestingSuite/1.0.0"

    def tearDown(self):
        if self.response:
            messages = [
                "Response",
                f"status: {self.response.status_code}",
                f"headers: {self.response.headers}",
                f"data: {self.response.data}",
                "Client",
                f"cookies: {self.client.cookies}",
                f"session: {self.client.session}",
            ]
            if hasattr(self.response, "redirect_chain"):
                messages.append(f"redirects: {self.response.redirect_chain}")

            print("\n".join(messages))
        print(f"======TEARING DOWN {self._testMethodName}======")
        return super().tearDown()
