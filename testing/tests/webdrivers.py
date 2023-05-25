import os
from selenium import webdriver
from selenium.webdriver import EdgeOptions, ChromeOptions, FirefoxOptions

#from selenium.webdriver.chrome.options import Options as ChromeOptions
#from selenium.webdriver.firefox.options import Options as FireFoxOptions
##from selenium.webdriver.edge.options import Options as EdgeOptions  #Does not work?
#from msedge.selenium_tools import EdgeOptions 
#from msedge.selenium_tools import Edge #Deprecated, but works.

def configure_driver_options(option_object, options):

    if options['headless'] == 'true':
        # Run in headless mode (No GUI) NOTE: Some pages block headless mode.
        option_object.add_argument('--headless') 
    if options['device'] == 'desktop':
        # Get a desktop size for the browser
        option_object.add_argument("--window-size=1920,1080")
    elif options['device'] == 'mobile':
        option_object.add_argument("--window-size=360,760")
    elif options['device'] == 'tablet':
        option_object.add_argument("--window-size=810,1080")
    # Bypass SSL Certificates
    option_object.add_argument('--ignore-certificate-errors')
    option_object.add_argument('--allow-running-insecure-content')

def get_webdriver(preferred_driver='chrome', options={'headless': 'true', 'device': 'desktop'}):
    print(f"USING WEB DRIVER: {preferred_driver}")
    print(f"Options: {options}")

    if preferred_driver == 'chrome':
        option_object = ChromeOptions()
        configure_driver_options(option_object, options)
        # Create a Chrome webdriver instance using the ChromeOptions object
        current_driver = webdriver.Chrome(options=option_object)
        current_driver.implicitly_wait(1)

    elif preferred_driver == 'firefox':
        option_object = FirefoxOptions()
        configure_driver_options(option_object, options)
        current_driver = webdriver.Firefox(options=option_object)

    elif preferred_driver == 'edge':
        option_object = EdgeOptions()
        # MS Edge first needs to use chromium for the other driver options to work??
        option_object.use_chromium = True
        configure_driver_options(option_object, options)
        current_driver = webdriver.Edge(options=option_object)

    else:
        # Raise an exception or return None to signal that the driver was not set
        raise ValueError(f"Invalid preferred driver: {preferred_driver}. Choose from: chrome, firefox, or edge")

    # Make the driver wait at least 1 second every time after a find_element call is made,
    # before throwing a NoSuchElementException error.
    current_driver.implicitly_wait(1)

    return current_driver
