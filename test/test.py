# This file provides a test suite
# The individual tests in the tests folder can also be executed independently.
#https://docs.python.org/3/library/unittest.html#unittest.TestCase.debug

import unittest
from tests.testRegistration import RegistrationTests
from tests.testLogin import LoginTests

# Create the test loader
test_loader = unittest.TestLoader()

# Load the tests from the test classes
registration_tests = test_loader.loadTestsFromTestCase(RegistrationTests)
login_tests = test_loader.loadTestsFromTestCase(LoginTests)

# Create the test suite
test_suite = unittest.TestSuite([registration_tests, login_tests])

#Run the test suite
if __name__=='__main__':    
    # Verbosity Levels
    #   0 (quiet): you just get the total numbers of tests executed and the global result
    #   1 (default): you get the same plus a dot for every successful test or a F for every failure
    #   2 (verbose): you get the help string of every test and the result
    unittest.main(verbosity=2)
