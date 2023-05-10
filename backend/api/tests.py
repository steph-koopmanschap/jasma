from django.test import TestCase
from django.conf import settings
import requests

test_user = {
    "username": "test123",
    "email": "test@gmail.com",
    "password": "test123"
}

# Create your tests here.
class test_A_api(TestCase):
    def test_A_register(self):
        response = requests.post(f"{settings.BASE_URL}/api/auth/register", 
                                    data={
                                            "username": test_user["username"],
                                            "email": test_user["email"],
                                            "password": test_user["password"]
                                    })
        
        print("response: ", response)

        self.assertEqual(False)

    def test_B_login(self):
        response = requests.post(f"{settings.BASE_URL}/api/auth/login", 
                            data={
                                    "email": test_user["email"],
                                    "password": test_user["password"]
                            })
        
        print("response: ", response)

        self.assertTrue(False)
