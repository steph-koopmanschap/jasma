import time
import unittest
from selenium.webdriver.common.by import By
from tests.webdrivers import get_webdriver

class RegistrationTests(unittest.TestCase):

    #This class method is started before ALL tests.
    @classmethod
    def setUpClass(cls):
        cls.test_name = "Login"
        print(f"Setting up all {cls.test_name} tests...")

        cls.BASE_URL = "http://localhost"

        cls.test_user = {
            'username': "test123",
            'email': "test@gmail.com",
            'password': "test123"
        }

        cls.driver = get_webdriver()

        print(f"Done setting up all {cls.test_name} tests.")

    # Executed before every test.
    def setUp(self):
        print("Starting and setting up individual test...")


    def test_registration_correct(self):
        # Registering test user
        self.driver.get(self.BASE_URL + "/register")

        print("self.driver.current_url: ", self.driver.current_url)

        username_input = self.driver.find_element(By.ID, 'userNameInput')
        email_input = self.driver.find_element(By.ID, 'emailInput')
        password_input = self.driver.find_element(By.ID, 'passwordInput')
        signup_btn = self.driver.find_element(By.ID, 'signUpBtn')
        
        username_input.send_keys(self.test_user['username'])
        email_input.send_keys(self.test_user['email'])
        password_input.send_keys(self.test_user['password'])
        signup_btn.click()

        #If user is moved to the dashboard login is correct.
        self.assertEqual(self.driver.current_url, f"{self.BASE_URL}/dashboard", f'Expected browser URL to be: {self.BASE_URL}/dashboard. NOTE: THIS TEST DOES NOT WORK YET')

    # Executed after every test
    # Tear down the test
    def tearDown(self):
        print("Individual test done. Tearing down.")

    # This class method is started after ALL tests.
    # NOTE: Make sure the class_name is the same as in setUpClass()
    @classmethod
    def tearDownClass(cls):
        print("Tear down all tests...")
        # Close the browsers
        cls.driver.quit()
        print("Done tearing down all tests.")

