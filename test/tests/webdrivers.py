import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FireFoxOptions
#from selenium.webdriver.edge.options import Options as EdgeOptions  #Does not work?
from msedge.selenium_tools import EdgeOptions 
from msedge.selenium_tools import Edge #Deprecated, but works.

def createDriverOptions(options):
    # Run in headless mode (No GUI) NOTE: Some pages block headless mode.
    options.add_argument('--headless') 
    # Get a big size for the browser or else the page might run as mobile version 
    options.add_argument("--window-size=1920,1080")
    # Bypass SSL Certificates
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--allow-running-insecure-content')

def getWebDriver():
    # Defaults back to chrome if no driver is given
    preferred_driver = os.getenv('WEBDRIVER', 'chrome')
    print(f"USING WEB DRIVER: {preferred_driver}")

    if preferred_driver == 'chrome':
        options = ChromeOptions()
        createDriverOptions(options)
        # Create a Chrome webdriver instance using the ChromeOptions object
        current_driver = webdriver.Chrome(options=options)
        current_driver.implicitly_wait(1)

    elif preferred_driver == 'firefox':
        options = FireFoxOptions()
        createDriverOptions(options)
        current_driver = webdriver.Firefox(options=options)

    elif preferred_driver == 'edge':
        options = EdgeOptions()
        # MS Edge first needs to use chromium for the other driver options to work??
        options.use_chromium = True
        createDriverOptions(options)
        current_driver = Edge(options=options)

    else:
        # Raise an exception or return None to signal that the driver was not set
        raise ValueError(f"Invalid preferred driver: {preferred_driver}. Choose from: chrome, firefox, or edge")

    # Make the driver wait at least 1 second every time after a find_element call is made,
    # before throwing a NoSuchElementException error.
    current_driver.implicitly_wait(1)

    return current_driver
