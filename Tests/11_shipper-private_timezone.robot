*** Settings ***
#Suite Setup     Go to Shipper view landing page     passive
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library         RPA.Desktop
Library    RPA.Browser
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown


*** Test Cases ***
User opens shipper view > shipment on a different timezone (Local Time)
    Go to Shipper view landing page with a set timezone     passive     Asia/Manila
    Login to shipper view
    RPA.Browser.Playwright.Click       text="Shipments"
    Wait For Elements State    text="Origin Port"
    Run keyword and continue on Failure     Verify date fields has the correct timezone     Origin Port Etd     +08:00
    Run keyword and continue on Failure     Verify date fields has the correct timezone     Origin Port Atd     +08:00
    Run keyword and continue on Failure     Verify date fields has the correct timezone     Discharge Port Eta     +08:00
    Run keyword and continue on Failure     Verify date fields has the correct timezone     Discharge Port Ata     +08:00
#    Run keyword and continue on Failure     Verify date fields has the correct timezone     Last Leg Eta    +08:00

User opens shipper view > shipment on a different timezone (GMT Time)
    Go to Shipper view landing page with a set timezone     passive     Europe/London
    Login to shipper view
    RPA.Browser.Playwright.Click       text="Shipments"
    Wait For Elements State    text="Origin Port"
    Verify date fields has the correct timezone     Origin Port Etd     +00:00
    Verify date fields has the correct timezone     Origin Port Atd     +00:00
    Verify date fields has the correct timezone     Discharge Port Eta     +00:00
    Verify date fields has the correct timezone     Discharge Port Ata     +00:00
#    Verify date fields has the correct timezone     Last Leg Eta    +00:00

#User shares a URL to a user in a different timezone
    

*** Keywords ***
Verify date fields has the correct timezone
    [Arguments]      ${field_name}      ${expected_timezone}
    ${field_text}=      RPA.Browser.Playwright.Get Text    //label[@id="${field_name}"]
    Should Contain    ${field_text}    ${expected_timezone}
    RPA.Browser.Playwright.Click      //label[@id="${field_name}"]/..
    ${field_text}=       RPA.Browser.Playwright.Get Text    css=.ant-select-selection-item >> nth=0
    Should Contain    ${field_text}    ${expected_timezone}

Go to Shipper view landing page with a set timezone
    [Arguments]    ${env}   ${timezone}
    New Browser    chromium    headless=false    #downloadsPath=C:\Users\immad\Code\expedock-robot-automation\
    New Context    viewport={'width': 1920, 'height': 1080}    acceptDownloads=True     timezoneId=${timezone}
    ${old_timeout} =    Set Browser Timeout    1 minute
    New Page       https://dashdemo.${env}-portal.expedock.com/search-shipments

Login to shipper view
    RPA.Browser.Playwright.Click    text="Log in"
    Wait For Elements State    text=Back to Search Shipments     visible
    Fill Secret      css=.css-hqatm4 >> nth=0   $ship-user2
    Fill Secret      css=.css-hqatm4 >> nth=0   $ship-pass2
    RPA.Browser.Playwright.Click   xpath=//button[contains(text(),'LOG IN')]
    Wait For Elements State    text=Exceptions Management Dashboard     visible

