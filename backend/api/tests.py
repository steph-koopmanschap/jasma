import requests
import json
from django.test import TestCase
from django.conf import settings
from api.constants.http_status import HTTP_STATUS
from api.generate_fake_db import generate_fake_db

test_user = {
    "username": "test123",
    "email": "test@gmail.com",
    "password": "test123"
}

test_post = {
    "text_content": "This is a test post",
    "hashtags": "test, fire, bridge, sky"
}

class TestApi(TestCase):
    @classmethod
    def setUpClass(cls):
        #generate_fake_db(10)
        # Create a session object
        cls.session = requests.Session()
        print("BASE_URL: ", settings.BASE_URL)

        headers = {
            'User-Agent': 'JasmaTestingSuite/1.0.0',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Connection': 'keep-alive',
            #'DNT': '1',
        }
        cls.session.headers.update(headers)

        print("======SETTING UP TEST ENVIRONMENT=======")

    @classmethod
    def tearDownClass(cls):
        cls.session.close()

    def setUp(self):
        print("======SETTING UP INDIVIDUAL TEST========")
        self.response = None

    def tearDown(self):
        if self.response is not None:
            print("response status: ", self.response.status_code)
            print("response headers: ", self.response.headers)
            print("response_body: ", self.response.json())
        print("======TEARING DOWN INDIVIDUAL TEST======")

    def test_A_auth_register_correct(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/register/", 
                                    data=json.dumps({
                                            "username": test_user["username"],
                                            "email": test_user["email"],
                                            "password": test_user["password"]
                                    }))
        if self.response.status_code != 201:
            return self.assertTrue(False)  # This is really disturbing logic. What are you trying to do?
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], f"User {test_user['username']} registered successfully.")

    def test_B_auth_register_email_taken(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/register/", 
                                    data=json.dumps({
                                            "username": "helloworld",
                                            "email": test_user["email"],
                                            "password": test_user["password"]
                                    }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Email already exists.")

    def test_C_auth_register_username_taken(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/register/", 
                                    data=json.dumps({
                                            "username": test_user["username"],
                                            "email": "helloworld@gmail.com",
                                            "password": test_user["password"]
                                    }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Username already exists.")

    def test_D_auth_login_wrong_email(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/login/", 
                            data=json.dumps({
                                    "email": "helloworld@gmail.com",
                                    "password": test_user["password"]
                            }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Forbidden"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Invalid email or password.")

    def test_E_auth_login_wrong_passwd(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/login/", 
                            data=json.dumps({
                                    "email": test_user["email"],
                                    "password": "helloworld"
                            }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Forbidden"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Invalid email or password.")

    def test_F_auth_check_auth_false(self):
        self.response = self.session.get(f"{settings.BASE_URL}/api/auth/checkAuth/")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertFalse(response_body['success'])
        self.assertFalse(response_body['isAuth'])

    def test_G_auth_login_correct(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/login/", 
                            data=json.dumps({
                                    "email": test_user["email"],
                                    "password": test_user["password"]
                            }))
        if self.response.status_code != 201:
            return self.assertTrue(False) # This is really disturbing logic. What are you trying to do?
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "User logged in.")

    def test_H_auth_check_auth_true(self):
        self.response = self.session.get(f"{settings.BASE_URL}/api/auth/checkAuth/")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertTrue(response_body['isAuth'])

    def test_I_auth_create_post(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/logout/")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "User logged out.")
