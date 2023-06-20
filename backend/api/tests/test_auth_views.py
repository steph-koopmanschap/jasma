from django.urls import reverse_lazy
from rest_framework import status

from api.tests.testing_utils import JasmaTestCase
from api.models import User


class AuthViewTestCase(JasmaTestCase):
    def test_A_auth_register_success(self):
        self.client.logout()
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
        self.client.logout()
        # Request
        url = reverse_lazy("register")
        payload = {
            "username": self.user.username,
            "email": self.user.email,
            "password": self.user.password
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
        self.client.logout()
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
        self.client.logout()
        # Request
        url = reverse_lazy("login")
        payload = {
            "email": self.user.email,
            "password": "password1" # Must provide unhashed password
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
            "user_id": str(self.user.id),
            "username": self.user.username,
            "email": self.user.email,
            "user_role": self.user.user_role
        }
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))
        # Session
        self.assertRegex(self.client.session.session_key,
                         self.SESSION_KEY_REGEX)

    def test_E_auth_login_wrong_password(self):
        self.client.logout()
        # Request
        url = reverse_lazy("login")
        payload = {
            "email": self.user.email,
            "password": self.user.password
        }
        with self.assertNumQueries(2):
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
                "code": "permission_denied",
                "message": "Invalid email or password."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_F_auth_login_wrong_email(self):
        self.client.logout()
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
        self.assertFalse(data.get("message"))
        self.assertFalse(data.get("data"))
        expected_errors = [
            {
                "attr": None,
                "code": "permission_denied",
                "message": "Invalid email or password."
            }
        ]
        self.assertCountEqual(data.get("errors"), expected_errors)

    def test_G_auth_logout_success(self):
        # Confirm session has valid session_key
        self.assertRegex(self.client.session.session_key,
                         self.SESSION_KEY_REGEX)
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
        self.client.logout()
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
        expected_data = {
            "isAuth": False, 
            "role": "guest"
        }
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_I_auth_check_auth_true(self):
        # ! Need a true logn request first to setup
        self.client.logout()
        self.client.post(
            reverse_lazy("login"), 
            {"email": self.user.email, "password": "password1"})

        # Request
        url = reverse_lazy("check-auth")
        with self.assertNumQueries(1):
            self.response = self.client.get(url)

        # Response
        self.assertEqual(self.response.status_code, status.HTTP_200_OK)
        # Data
        data = self.response.data
        self.assertTrue(data.get("success"))
        self.assertFalse(data.get("message"))
        expected_data = {
            "isAuth": True, 
            "role": self.user.user_role
        }
        self.assertDictEqual(data.get("data"), expected_data)
        self.assertFalse(data.get("errors"))

    def test_J_change_password_success(self):
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
        self.client.logout()
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
