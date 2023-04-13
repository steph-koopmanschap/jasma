# This file provides a test suite
#https://docs.python.org/3/library/unittest.html#unittest.TestCase.debug

# How to start this test:
# WEBDRIVER=chrome HTML=true VERBOSITY=2 python test.py

import os
import unittest
import HtmlTestRunner # Used for getting html output instead of console output from unittest
#from tests.test_login import LoginTests

# If HTML=true then a html test report will be generated
# By default no html report will be generated
is_html_output = os.getenv('HTML', 'false')
# Verbosity Levels
#   0 (quiet): you just get the total numbers of tests executed and the global result
#   1 (default): you get the same plus a dot for every successful test or a F for every failure
#   2 (verbose): you get the help string of every test and the result
verbosity = int(os.getenv('VERBOSITY', '2'))

# Create the test loader
test_loader = unittest.TestLoader()

#login_tests = test_loader.loadTestsFromTestCase(LoginTests)
# Create the test suite
    #test_suite = unittest.TestSuite([login_tests])

# Load all the tests and create the test suite.
test_suite = test_loader.discover(start_dir='./tests', pattern='test_*.py')

#Run the test suite
if __name__=='__main__':    
    if is_html_output == 'false':
        unittest.main(verbosity=verbosity)
    elif is_html_output == 'true':
        runner = HtmlTestRunner.HTMLTestRunner(output='reports')
        runner.run(test_suite)
