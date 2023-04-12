from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FireFoxOptions

def getChromeDriver(): 
    # Create a ChromeOptions object and set headless option to True
    chrome_options = ChromeOptions()
    chrome_options.add_argument('--headless') #
    # Create a Chrome webdriver instance using the ChromeOptions object
    chrome_driver = webdriver.Chrome(options=chrome_options)
    return chrome_driver

def getFirefoxDriver():
    # Create a FireFox object and set headless option to True
    firefox_options = FireFoxOptions()
    firefox_options.add_argument('-headless')
    #Create firefox webdriver
    firefox_driver = webdriver.Firefox(options=firefox_options)
    return firefox_driver
