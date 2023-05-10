import time
import unittest
from selenium.webdriver.common.by import By
from tests.webdrivers import getWebDriver

class RegistrationTests(unittest.TestCase):

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

        print(f"Done setting up all {inst.test_name} tests.")

    # Executed before every test.
    def setUp(self):
        print("Starting and setting up individual test...")


    def test_registration_correct(self):
        # Registering test user
        self.driver.get(self.BASE_URL + "/register")

        print("self.driver.current_url: ", self.driver.current_url)

        userNameInput = self.driver.find_element(By.ID, 'userNameInput')
        emailInput = self.driver.find_element(By.ID, 'emailInput')
        passwordInput = self.driver.find_element(By.ID, 'passwordInput')
        signUpBtn = self.driver.find_element(By.ID, 'signUpBtn')
        
        userNameInput.send_keys(self.test_user['username'])
        emailInput.send_keys(self.test_user['email'])
        passwordInput.send_keys(self.test_user['password'])
        signUpBtn.click()

        #If user is moved to the dashboard login is correct.
        self.assertEqual(self.driver.current_url, f"{self.BASE_URL}/dashboard", f'Expected browser URL to be: {self.BASE_URL}/dashboard. NOTE: THIS TEST DOES NOT WORK YET')

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

