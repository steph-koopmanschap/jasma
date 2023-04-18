# This file provides a test suite
#https://docs.python.org/3/library/unittest.html#unittest.TestCase.debug

import os
from dotenv import load_dotenv
load_dotenv()
import unittest
import HtmlTestRunner # Used for getting html output instead of console output from unittest
from tests.test_login import LoginTests

#login_tests = test_loader.loadTestsFromTestCase(LoginTests)
# Create the test suite
    #test_suite = unittest.TestSuite([login_tests])

#Run the test suite
if __name__=='__main__':  

    is_html_output = os.getenv('HTML', 'false')
    verbosity = int(os.getenv('VERBOSITY', '2'))
    test_to_execute = os.getenv('TEST', 'all')

    # Create the test loader
    test_loader = unittest.TestLoader()

    # Load all the tests and create the test suite.
    if test_to_execute == 'all':
        test_suite = test_loader.discover(start_dir='./tests', pattern='test_*.py')
    else:
        test_suite = test_loader.discover(start_dir='./tests', pattern=f"{test_to_execute}.py")

    if is_html_output == 'false':
        unittest.main(verbosity=verbosity)

    elif is_html_output == 'true':
        runner = HtmlTestRunner.HTMLTestRunner(
            output='reports', 
            combine_reports=True,
            report_title="JASMA Tests",
            report_name=f"test_report.html",
            add_timestamp=True,
            verbosity=verbosity
            )
        runner.run(test_suite)
