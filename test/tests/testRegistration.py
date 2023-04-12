import time
import unittest
#import HtmlTestRunner # Used for getting html output instead of console output from unittest
from selenium.webdriver.common.by import By
from tests.webdrivers import getChromeDriver, getFirefoxDriver

class RegistrationTests(unittest.TestCase):

    #This class method is started before ALL tests.
    @classmethod
    def setUpClass(inst):
        print("Setting up all tests...")

        inst.BASE_URL = "http://localhost"

        inst.test_user = {
            'username': "test123",
            'email': "test@gmail.com",
            'password': "test123"
        }

        inst.chrome = getChromeDriver()
        inst.firefox = getFirefoxDriver()

        print("Done setting up all tests.")

    # Executed before every test.
    def setUp(self):
        print("Starting and setting up individual test...")


    def test_registration_correct(self):
        # Registering test user
        self.chrome.get(self.BASE_URL + "/register")

        print("self.chrome.current_url: ", self.chrome.current_url)

        userNameInput = self.chrome.find_element(By.ID, 'userNameInput')
        emailInput = self.chrome.find_element(By.ID, 'emailInput')
        passwordInput = self.chrome.find_element(By.ID, 'passwordInput')
        signUpBtn = self.chrome.find_element(By.ID, 'signUpBtn')
        
        userNameInput.send_keys(self.test_user['username'])
        emailInput.send_keys(self.test_user['email'])
        passwordInput.send_keys(self.test_user['password'])
        signUpBtn.click()

        #If user is moved to the dashboard login is correct.
        self.assertEqual(self.chrome.current_url, f"{self.BASE_URL}/dashboard", f'Expected browser URL to be: {self.BASE_URL}/dashboard. NOTE: THIS TEST DOES NOT WORK YET')

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
        inst.chrome.quit()
        inst.firefox.quit()
        print("Done tearing down all tests.")

#Run the tests
if __name__=='__main__':    
    # Verbosity Levels
    #   0 (quiet): you just get the total numbers of tests executed and the global result
    #   1 (default): you get the same plus a dot for every successful test or a F for every failure
    #   2 (verbose): you get the help string of every test and the result
    unittest.main(verbosity=2)




