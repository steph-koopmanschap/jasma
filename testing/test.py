# This file provides a test suite
#https://docs.python.org/3/library/unittest.html#unittest.TestCase.debug

import os
from dotenv import load_dotenv
load_dotenv()
import unittest
import HtmlTestRunner # Used for getting html output instead of console output from unittest
# Import all the tests
from tests.api_tests.test_all import ApiTest

#Run the test suite
if __name__=='__main__':  

    is_html_output = os.getenv('HTML', 'false')
    verbosity = int(os.getenv('VERBOSITY', '2'))
    test_suite = os.getenv('SUITE', 'api')
    test_to_execute = os.getenv('TEST', 'all')

    # Create the test loader
    test_loader = unittest.TestLoader()

    # Load all the tests and create the test suite.
    if test_to_execute == 'all':
        test_suite = test_loader.discover(start_dir=f'./tests/{test_suite}_tests', pattern='test_*.py')
    else:
        test_suite = test_loader.discover(start_dir=f'./tests/{test_suite}_tests', pattern=f"test_{test_to_execute}.py")

    if is_html_output == 'false':
        runner = unittest.TextTestRunner(verbosity=verbosity, descriptions=True)

    elif is_html_output == 'true':
        runner = HtmlTestRunner.HTMLTestRunner(
            output='reports', 
            combine_reports=True,
            report_title=f"JASMA {test_suite} Tests",
            report_name=f"JASMA_{test_suite}_test_report.html",
            add_timestamp=True,
            verbosity=verbosity
            )
    
    #Execute test
    runner.run(test_suite)
