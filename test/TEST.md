# How to start this test:
`<env variables> python test.py`

## Environment Variables:

### Description: Choose which browser to use.

WEBDRIVER 
options: chrome, firefox, edge | Default: chrome

### Description: Choose wether to create a html report or only log to console.

HTML      
options: false, true | Default: false

### Description: Choose verbosity of test logging.

Verbosity Levels
- 0 (quiet): you just get the total numbers of tests executed and the global result
- 1 (default): you get the same plus a dot for every successful test or a F for every failure
- 2 (verbose): you get the help string of every test and the result
VERBOSITY 
options: 0, 1, 2 | Default: 2

### Description: Choose to run browser in headless or GUI mode.

HEADLESS  
options: false, true | Default: true

### Description: Choose to run all tests or a specific test. Do not include ".py" in the filename.

TEST      
options: all, <file_name_of_test> | Default: all