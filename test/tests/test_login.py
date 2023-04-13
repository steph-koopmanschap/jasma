import time
import unittest
from selenium.webdriver.common.by import By
from tests.webdrivers import getWebDriver

class LoginTests(unittest.TestCase):

    #This class method is started before ALL tests.
    @classmethod
    def setUpClass(inst):
        inst.test_name = "Login"
        print(f"Setting up all {inst.test_name} tests...")

        inst.BASE_URL = "http://localhost"

        inst.test_user = {
            'username': "test123",
            'email': "test@gmail.com",
            'password': "test123"
        }

        inst.driver = getWebDriver()

        # Registering test user
        inst.driver.get(inst.BASE_URL + "/register")

        userNameInput = inst.driver.find_element(By.ID, 'userNameInput')
        emailInput = inst.driver.find_element(By.ID, 'emailInput')
        passwordInput = inst.driver.find_element(By.ID, 'passwordInput')
        signUpBtn = inst.driver.find_element(By.ID, 'signUpBtn')
        
        userNameInput.send_keys(inst.test_user['username'])
        emailInput.send_keys(inst.test_user['email'])
        passwordInput.send_keys(inst.test_user['password'])
        signUpBtn.click()

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

        emailInput = self.driver.find_element(By.ID, 'loginEmailInput')
        passwordInput = self.driver.find_element(By.ID, 'loginPasswordInput')
        loginBtn = self.driver.find_element(By.ID, 'loginSubmitBtn')

        emailInput.send_keys(self.test_user['email'])
        passwordInput.send_keys(self.test_user['password'])
        loginBtn.click()

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
    def tearDownClass(inst):
        print("Tear down all tests...")
        # Close the browsers
        inst.driver.quit()
        print("Done tearing down all tests.")


