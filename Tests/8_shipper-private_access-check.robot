*** Settings ***
#Suite Setup     Go to Shipper view landing page     passive
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library         RPA.Desktop
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown

*** Variables ***
${ship1}    S00004213   #DIAENGFS 1
${ship2}    S00004102   #DIAENGFS 2
${ship3}    S00004762   #STARLOGNYC
${ship4}    S00002159   #AUSTINJEWEL
${ship5}    S00004739   #ENGBEEMNL
${ship6}    S00004181   #USISRANYC

&{shipment_details}      num=S00004556   org=CN0PRD
${favicon_loc}          xpath=//link[@rel="shortcut icon"]
${searchbar_loc}        xpath=//input[@name="searchShipments"]
${shipmentcard_loc}     xpath=//div[@data-testid="shipment-card" and contains(@data-company-shipment-key, '${shipment_details}[num]')]

*** Test Cases ***
Verify shipper can log-in from the landing page
    Go to Shipper view landing page     passive
    Wait For Elements State    text=Let's track your shipment     visible
    RPA.Browser.Playwright.Click   text="Log in"
    Login to shipper view

Verify user can log-in from the shipment page
    #Open shipper landing page
    Go to Shipper view landing page     passive
    Wait For Elements State    text=Let's track your shipment     visible

    #Open a shipment
    RPA.Browser.Playwright.Click    ${searchbar_loc}
    Keyboard Input    insertText     ${shipment_details}[num]
    RPA.Browser.Playwright.Click    text="Track"
    Wait For Elements State         ${shipmentcard_loc}    visible
    RPA.Browser.Playwright.Click    ${shipmentcard_loc}

    #Wait for shipment page to load
    Wait For Elements State    xpath=//h5[contains(text(),'Shipment ${shipment_details}[num]')]   visible

    #Click on Login link
    RPA.Browser.Playwright.Click   text="Log in to your account"

    #Login
    Login to shipper view

Verify user can log-in from the request access modal
    #Open shipper landing page
    Go to Shipper view landing page     passive
    Wait For Elements State    text=Let's track your shipment     visible

    #Open a shipment
    RPA.Browser.Playwright.Click    ${searchbar_loc}
    Keyboard Input    insertText     ${shipment_details}[num]
    RPA.Browser.Playwright.Click    text="Track"
    Wait For Elements State         ${shipmentcard_loc}    visible
    RPA.Browser.Playwright.Click    ${shipmentcard_loc}

    #Wait for shipment page to load
    Wait For Elements State    xpath=//h5[contains(text(),'Shipment ${shipment_details}[num]')]   visible

    #Click on Documents Tab
    RPA.Browser.Playwright.Click    text=Documents

    #Click on Request now button
    RPA.Browser.Playwright.Click    text=REQUEST NOW

    #Click on Login
    RPA.Browser.Playwright.Click    text="Log In"

    #Login
    Login to shipper view


Verify shipper can log-out
    Log-in to shipper private dashboard
    RPA.Browser.Playwright.Click    xpath=//div[@data-testid="account-menu-trigger-uncollapsed"]
    RPA.Browser.Playwright.Click    xpath=//div[@data-testid="logout"]
    Wait For Elements State     input#mui-7
    Wait For Elements State     input#mui-8

Verify numbers under Exception Management Dashboard and Shipment page matches
    [Template]  Verify Exception Management Dashboard and shipment matches
        Failed to depart (Past 3 months)
        Failed to arrive (Past 3 months)

Verify shipper can search for the shipment within its org
    [Template]  Check shipment in shipper private view
        ${ship1}    ${true}
        ${ship2}    ${true}
        ${ship3}    ${true}
        
Verify shipper CANNOT search for the shipment outside its org
    [Template]  Check shipment in shipper private view
        ${ship4}    ${false}
        ${ship5}    ${false}
        ${ship6}    ${false}

*** Keywords ***
Check shipment in shipper private view
    [Arguments]     ${shipment_num}     ${expected}
    Log-in to shipper private dashboard
    RPA.Browser.Playwright.Click   text=Search Shipments
    Fill Text      xpath=//input[@name="searchShipments"]   ${shipment_num}
    RPA.Browser.Playwright.Click    text="Track"
    ${status}=  Run Keyword And Return Status    Wait For Elements State   xpath=//*[@data-testid="ArrowForwardIcon"] >> nth=1     visible
    IF    ${status}==${true} and ${expected}==${true}
        Set Test Message    ${\n}Pass. Shipment ${shipment_num} found  append=True
    ELSE IF   ${status}==${false} and ${expected}==${false}
        Set Test Message    ${\n}Pass. Shipment ${shipment_num} not found  append=True
    ELSE
        Fail    ${\n}Check shipment ${shipment_num}. Expected with results =${expected}
    END


Go to Shipper view landing page
    [Arguments]    ${env}
    New Browser    chromium    headless=false    #downloadsPath=C:\Users\immad\Code\expedock-robot-automation\
    New Context    viewport={'width': 1920, 'height': 1080}    acceptDownloads=True
    Delete All Cookies
    ${old_timeout} =    Set Browser Timeout    30 seconds
    New Page       https://apinvdemo.${env}-portal.expedock.com/search-shipments

Log-in to shipper private dashboard
    Go to Shipper view landing page     passive
    Wait For Elements State    text=Let's track your shipment     visible
    RPA.Browser.Playwright.Click   text="Log in"
    Login to shipper view

Verify Exception Management Dashboard and shipment matches
    [Arguments]     ${chart}
    Log-in to shipper private dashboard

    #Get Summary chart value
    ${card_value}=      Get Text    xpath=//div[@data-card-name="${chart}"] >> xpath=//h3[@data-testid="summary-link"]

    #Click View shipments CTA
    RPA.Browser.Playwright.Click    xpath=//div[@data-card-name="${chart}"] >> text="View shipments"

    #Wait for shipments table to load
    Wait For Elements State         xpath=//a[@class="css-1sk64wp"] >> nth=0   visible

    #Get footer shipment value
    ${table_total}=    Get Text       xpath=//div[@data-testid="filtered-shipments-footer"]/p
    ${table_total}=     Replace String    ${table_total}     ${SPACE}Shipments    ${EMPTY}

    #Assert if values match
    Should Be Equal As Numbers    ${card_value}    ${table_total}

Login to shipper view
    Wait For Elements State    text=Back to Search Shipments     visible
    Fill Secret      css=.css-hqatm4 >> nth=0   ${ship-user1}
    Fill Secret      css=.css-hqatm4 >> nth=0   ${ship-pass1}
    RPA.Browser.Playwright.Click   xpath=//button[contains(text(),'LOG IN')]
    Wait For Elements State    text=Exceptions Management Dashboard     visible
