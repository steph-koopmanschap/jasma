from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.test import APITestCase

from api.models import User


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

    def test_A_auth_register_success(self):
        # Request
        url = reverse_lazy("register")
        payload = {
            "username": "test123",
            "email": "test123@test.test",
            "password": "test123"
        }
        with self.assertNumQueries(5):
            self.response = self.client.post(url, payload, format="json")
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_201_CREATED)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("message"),
                         f"User {payload['username']} registered successfully.")
        self.assertFalse(data.get("data"))
        self.assertFalse(data.get("errors"))
        # Database
        user = User.objects.filter(username=payload['username']).first()
        self.assertIsNotNone(user.password)
        self.assertIsNotNone(user.profile)
        self.assertIsNotNone(user.notification_preferences)

    def test_B_auth_register_unique_fields(self):
        # Request
        url = reverse_lazy("register")
        payload = {
            "username": self.user1.username,
            "email": self.user1.email,
            "password": self.user1.password
        }
        with self.assertNumQueries(2):
            self.response = self.client.post(url, payload, format="json")
        # Response
        self.assertEqual(self.response.status_code,
                         status.HTTP_400_BAD_REQUEST)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": "email",
                "code": "unique",
                "message": "User with this email address already exists."
            },
            {
                "attr": "username",
                "code": "unique",
                "message": "A user with that username already exists."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_C_auth_register_required_fields(self):
        # Request
        url = reverse_lazy("register")
        payload = {
            "username": "",
            "email": "",
            "password": ""
        }
        with self.assertNumQueries(0):
            self.response = self.client.post(url, payload)
        # Response
        self.assertEqual(self.response.status_code,
                         status.HTTP_400_BAD_REQUEST)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        blank_msg = "This field may not be blank."
        expected_errors = [
            {
                "attr": "email",
                "code": "blank",
                "message": blank_msg
            },
            {
                "attr": "username",
                "code": "blank",
                "message": blank_msg
            },
            {
                "attr": "password",
                "code": "blank",
                "message": blank_msg
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_D_auth_login_success(self):
        # Request
        url = reverse_lazy("login")
        payload = {
            "email": self.user1.email,
            "password": "password1"
        }
        with self.assertNumQueries(4):
            self.response = self.client.post(url, payload)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("message"), "User logged in.")
        expected_data = {
            "user": {
                "id": str(self.user1.id),
                "username": self.user1.username,
                "email": self.user1.email
            }
        }
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))
        # Session
        self.assertRegex(self.client.session.session_key, self.SESSION_KEY_REGEX)

    def test_E_auth_login_wrong_password(self):
        # Request
        url = reverse_lazy("login")
        payload = {
            "email": self.user1.email,
            "password": self.user1.password
        }
        with self.assertNumQueries(2):
            self.response = self.client.post(url, payload)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertEqual(data.get("message"), "Invalid email or password.")
        self.assertFalse(data.get("data"))
        self.assertFalse(data.get("errors"))

    def test_F_auth_login_wrong_email(self):
        # Request
        url = reverse_lazy("login")
        payload = {
            "email": "NotUsernameOrEmail",
            "password": "password1"
        }
        with self.assertNumQueries(2):
            self.response = self.client.post(url, payload)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_403_FORBIDDEN)
        # Data
        data = self.response.data
        self.assertFalse(data.get("success"))
        self.assertEqual(data.get("message"), "Invalid email or password.")
        self.assertFalse(data.get("data"))
        self.assertFalse(data.get("errors"))

    def test_G_auth_logout_success(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Confirm session has valid session_key
        self.assertRegex(self.client.session.session_key, self.SESSION_KEY_REGEX)
        # Request
        url = reverse_lazy("logout")
        with self.assertNumQueries(0):
            self.response = self.client.post(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Confirm session destruction
        self.assertIsNone(self.client.session.session_key)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("message"), "Logged out.")
        self.assertFalse(data.get("data"))
        self.assertFalse(data.get("errors"))

    def test_H_auth_check_auth_false(self):
        # Request
        url = reverse_lazy("check-auth")
        with self.assertNumQueries(0):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {"isAuth": False}
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_I_auth_check_auth_true(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Confirm session has valid session_key
        session_key = self.client.session.session_key[:]
        self.assertRegex(session_key, self.SESSION_KEY_REGEX)
        # Request
        url = reverse_lazy("check-auth")
        with self.assertNumQueries(0):
            self.response = self.client.get(url)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {"isAuth": True}
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))
        # Confirm session is still the same
        self.assertEqual(session_key, self.client.session.session_key)

    def test_J_change_password_success(self):
        # Configure client
        self.client.force_authenticate(user=self.user1)
        # Request
        url = reverse_lazy("change-password")
        payload = {
            "new_password": "newPassword123"
        }
        with self.assertNumQueries(1):
            self.response = self.client.post(url, payload)
        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("message"), "Password changed.")
        self.assertFalse(data.get("data"))
        self.assertFalse(data.get("errors"))

    def test_K_change_password_not_logged_in(self):
        # Request
        url = reverse_lazy("change-password")
        payload = {
            "new_password": "newPassword123"
        }
        with self.assertNumQueries(0):
            self.response = self.client.post(url, payload)
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
