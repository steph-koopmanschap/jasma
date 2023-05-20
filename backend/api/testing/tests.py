import os
import requests
import json
from django.test import TestCase
from django.conf import settings
from api.constants.http_status import HTTP_STATUS
from api.generate_fake_db import generate_fake_db

#filepath_dummydata = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dummy_test_data.json')
filepath_dummydata = 'dummy_test_data.json'
with open(filepath_dummydata, 'r') as f:
    dummy_data = json.load(f)

test_user_one = dummy_data["test_user_one"]
test_user_two = dummy_data["test_user_two"]
test_hashtags = dummy_data["test_hashtags"]
test_post = dummy_data["test_post"]
test_comment = dummy_data["test_comment"]

script_dir = os.path.dirname(os.path.abspath(__file__))
test_file_post = os.path.join(script_dir, 'dummy_test_pic_post.jpg')
# test_file_comment = os.path.join(script_dir, 'dummy_test_file_comment.jpg')
# test_file_profile = os.path.join(script_dir, 'dummy_test_file_profile_pic.jpg')

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
                                            "username": test_user_one["username"],
                                            "email": test_user_one["email"],
                                            "password": test_user_one["password"]
                                    }))
        if self.response.status_code != 201:
            self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], f"User {test_user_one['username']} registered successfully.")

    def test_B_auth_register_email_taken(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/register/", 
                                    data=json.dumps({
                                            "username": "helloworld",
                                            "email": test_user_one["email"],
                                            "password": test_user_one["password"]
                                    }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Email already exists.")

    def test_C_auth_register_username_taken(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/register/", 
                                    data=json.dumps({
                                            "username": test_user_one["username"],
                                            "email": "helloworld@gmail.com",
                                            "password": test_user_one["password"]
                                    }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Bad Request"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Username already exists.")

    def test_D_auth_login_wrong_email(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/login/", 
                            data=json.dumps({
                                    "email": "helloworld@gmail.com",
                                    "password": test_user_one["password"]
                            }))
        response_body = self.response.json()
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Forbidden"])
        self.assertFalse(response_body['success'])
        self.assertEqual(response_body['message'], "Invalid email or password.")

    def test_E_auth_login_wrong_passwd(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/login/", 
                            data=json.dumps({
                                    "email": test_user_one["email"],
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
                                    "email": test_user_one["email"],
                                    "password": test_user_one["password"]
                            }))
        if self.response.status_code != 201:
            self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        response_body = self.response.json()
        test_user_one['user_id'] = response_body['user']['id']
        
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['user']['username'], test_user_one['username'])
        self.assertEqual(response_body['user']['email'], test_user_one['email'])
        self.assertEqual(response_body['message'], "User logged in.")

    def test_H_auth_check_auth_true(self):
        self.response = self.session.get(f"{settings.BASE_URL}/api/auth/checkAuth/")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertTrue(response_body['isAuth'])

    def test_I_posts_create_post_image(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/posts/createPost/",
                                        data=json.dumps({
                                            "text_content": test_post["text_content"],
                                            "hashtags": test_hashtags,
                                            "file":  test_file_post
                                        }))
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["Created"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "Post created successfully.")

    def test_J_posts_get_user_posts(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/posts/getUserPosts/?user_id={test_user_one['user_id']}&limit=1")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['posts'][0]['text_content'], test_post["text_content"])
        self.assertEqual(response_body['posts'][0]['hashtags'], test_hashtags)
        self.assertEqual(response_body['posts'][0]['file_url'], test_hashtags)
        self.assertEqual(response_body['posts'][0]['post_type'], "image")

    def test_X_auth_logout(self):
        self.response = self.session.post(f"{settings.BASE_URL}/api/auth/logout/")
        response_body = self.response.json()
        self.assertEqual(self.response.status_code, HTTP_STATUS["OK"])
        self.assertTrue(response_body['success'])
        self.assertEqual(response_body['message'], "User logged out.")