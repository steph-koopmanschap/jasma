import time
import unittest
from selenium.webdriver.common.by import By
from utils.webdrivers import get_webdriver

class LoginTests(unittest.TestCase):

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

        # Registering test user
        cls.driver.get(cls.BASE_URL + "/register")

        username_input = cls.driver.find_element(By.ID, 'userNameInput')
        email_input = cls.driver.find_element(By.ID, 'emailInput')
        password_input = cls.driver.find_element(By.ID, 'passwordInput')
        signup_btn = cls.driver.find_element(By.ID, 'signUpBtn')
        
        username_input.send_keys(cls.test_user['username'])
        email_input.send_keys(cls.test_user['email'])
        password_input.send_keys(cls.test_user['password'])
        signup_btn.click()

        print("Done setting up all tests.")

    # Executed before every test.
    def setUp(self):
        print("Starting and setting up individual test...")


    def test_login_correct(self):
        # Open the browser
        self.driver.get(self.BASE_URL + "/login")

        # Get a screenshot to make sure the page works.
        self.driver.get_screenshot_as_file("screenshot_driver_login.png")
        print(self.driver.get_screenshot_as_file("screenshot_driver_login.png"))

        print("self.driver.current_url: ", self.driver.current_url)

        # Wait for a bit in case internet or response time is slow
        time.sleep(3)

        email_input = self.driver.find_element(By.ID, 'loginEmailInput')
        password_input = self.driver.find_element(By.ID, 'loginPasswordInput')
        login_btn = self.driver.find_element(By.ID, 'loginSubmitBtn')

        email_input.send_keys(self.test_user['email'])
        password_input.send_keys(self.test_user['password'])
        login_btn.click()

        # Wait for a bit in case internet or response time is slow
        time.sleep(5)

        #If user is moved to the dashboard login is correct.
        self.assertEqual(self.driver.current_url, f"{self.BASE_URL}/dashboard", f'Expected browser URL to be: {self.BASE_URL}/dashboard')

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


