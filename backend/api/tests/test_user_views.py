from django.urls import reverse_lazy, reverse
from django.http import QueryDict

from rest_framework import status
from rest_framework.test import APITestCase

from api.models import User, UserProfile, UserNotificationPreferences


class UserViewsTestCase(APITestCase):
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
        cls.mod_user1 = User.objects.create_user(
            username="mod_user1",
            password="mod_password1",
            email="mod_user1@test1.test",
            user_role="mod"
            )
        cls.admin_user1 = User.objects.create_user(
            username="admin_user1",
            password="admin_password1",
            email="admin_user1@test1.test",
            user_role="admin"
            )
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

    def test_A_get_user_self_basic_info_plus_phone_success(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Request
        user = User.objects.get(email=self.user1.email)
        url = reverse("user-detail", args=[user.pk])
        params = {"fields": "phone"}
        query_params = QueryDict(mutable=True)
        query_params.update(params)
        
        with self.assertNumQueries(1):
            self.response = self.client.get(url, data=query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "user_role": user.user_role,
            "phone": user.phone
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_B_get_user_basic_info_not_logged(self):
        # Request
        user = User.objects.get(email=self.user1.email)
        url = reverse("user-detail", args=[user.pk])
        with self.assertNumQueries(0):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_authenticated",
                "message": "Authentication credentials were not provided."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_C_get_user_basic_info_user_does_not_exist(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Request
        url = reverse("user-detail", args=["6b90f04a-44d1-4d0b-ba4f-2260e889f93f"])
        with self.assertNumQueries(1):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_404_NOT_FOUND)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "not_found",
                "message": "User not found."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_D_get_user_self_basic_info_plus_field_not_found_warning(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Request
        user = User.objects.get(email=self.user1.email)
        url = reverse("user-detail", args=[user.pk])
        params = {"fields": "some_unknown_field, neither_this_one"}
        query_params = QueryDict(mutable=True)
        query_params.update(params)
        
        with self.assertNumQueries(1):
            self.response = self.client.get(url, data=query_params)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        warning = "Warning could not find some_unknown_field, neither_this_one."
        self.assertEqual(data.get("message"), warning)
        expected_data = {
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "user_role": user.user_role
        }
        self.assertCountEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

