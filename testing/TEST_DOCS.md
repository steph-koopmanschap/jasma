# jasma-testing
Automated testing for JASMA with PyUnit

## How to start this test:
`<env variables> python test.py` <br />

To log the output of the test to a file: (recommended) <br />
`<env variables> python test.py > test.log`

## How to write new tests:

1. In test directory create your new test file.
2. For each test write a function called `test_<captial_letter>_<test_name>`

Each test in the file is executed in alphabetical order. 
With `<captial_letter>` you can control the order execution of each test.
Example

```python
def test_A_hello(self):
def test_B_world(self):
```

## Environment Variables:

### SUITE
- Description: Choose the testing suite to use. Api suite will test the api directly. end-user will use Selenium.
- Options: api, enduser | Default: api

### TEST
- Description: Choose to run all tests or a specific test in the tests directory. Do not include "test_" and ".py" in the filename.
- Options: all, <file_name_of_test> | Default: all

### HTML
- Description: Choose wether to create a html report or only log to console.
- Options: false, true | Default: false

### VERBOSITY
- Description: Choose verbosity of test logging.
- Options: 0, 1, 2 | Default: 2 <br />
Verbosity Levels <br />
- 0 (quiet): you just get the total numbers of tests executed and the global result
- 1 (default): you get the same plus a dot for every successful test or a F for every failure
- 2 (verbose): you get the help string of every test and the result

### WEBDRIVER
- Description: Choose which browser to use. This is only available in the end-user suite.
- Options: chrome, firefox, edge | Default: chrome

### HEADLESS
- Description: Choose to run browser in headless or GUI mode. This is only available in the end-user suite.
- Options: false, true | Default: true

### SCREENSHOTS
- Description: Choose to add screenshots in your tests. (Useful for debugging headless mode). This is only available in the end-user suite.
- options:: fale, true | Default: false
