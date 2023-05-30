import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FireFoxOptions
#from selenium.webdriver.edge.options import Options as EdgeOptions  #Does not work?
from msedge.selenium_tools import EdgeOptions 
from msedge.selenium_tools import Edge #Deprecated, but works.

def create_driver_options(optionsObject, options):
    if options['headless'] == 'true':
        # Run in headless mode (No GUI) NOTE: Some pages block headless mode.
        optionsObject.add_argument('--headless') 
    if options['device'] == 'desktop':
        # Get a desktop size for the browser
        optionsObject.add_argument("--window-size=1920,1080")
    elif options['device'] == 'mobile':
        optionsObject.add_argument("--window-size=360,760")
    elif options['device'] == 'tablet':
        optionsObject.add_argument("--window-size=810,1080")
    # Bypass SSL Certificates
    optionsObject.add_argument('--ignore-certificate-errors')
    optionsObject.add_argument('--allow-running-insecure-content')

def get_WebDriver(preferred_driver='chrome', options={'headless': 'true', 'device': 'desktop'}):
    print(f"USING WEB DRIVER: {preferred_driver}")
    print(f"Options: {options}")

    if preferred_driver == 'chrome':
        optionsObject = ChromeOptions()
        create_driver_options(optionsObject, options)
        # Create a Chrome webdriver instance using the ChromeOptions object
        current_driver = webdriver.Chrome(options=optionsObject)
        current_driver.implicitly_wait(1)

    elif preferred_driver == 'firefox':
        optionsObject = FireFoxOptions()
        create_driver_options(optionsObject, options)
        current_driver = webdriver.Firefox(options=optionsObject)

    elif preferred_driver == 'edge':
        optionsObject = EdgeOptions()
        # MS Edge first needs to use chromium for the other driver options to work??
        optionsObject.use_chromium = True
        create_driver_options(optionsObject, options)
        current_driver = Edge(options=optionsObject)
    else:
        # Raise an exception or return None to signal that the driver was not set
        raise ValueError(f"Invalid preferred driver: {preferred_driver}. Choose from: chrome, firefox, or edge")
    # Make the driver wait at least 1 second every time after a find_element call is made,
    # before throwing a NoSuchElementException error.
    current_driver.implicitly_wait(1)

    return current_driver