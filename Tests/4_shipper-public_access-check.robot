*** Settings ***
#Suite Setup     Go to Shipper view landing page     passive
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library         RPA.Desktop
Library         DateTime
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown

*** Variables ***
&{shipment_details}      num=S00004556   org=CN0PRD
${favicon_loc}          xpath=//link[@rel="shortcut icon"]
${searchbar_loc}        xpath=//input[@name="searchShipments"]
${shipmentcard_loc}     xpath=//div[@data-testid="shipment-card" and contains(@data-company-shipment-key, '${shipment_details}[num]')]

*** Test Cases ***
Verify shipper can log-in
    Go to Shipper view landing page     passive
    Wait Until Keyword Succeeds    30s    1s    Wait For Elements State    text=Let's track your shipment     visible

Verify favicon loads successfully
    [Tags]  re-run
    ${favicon_link}=    Get Attribute     ${favicon_loc}     href
    ${status}=      Run Keyword And Return Status    Should Contain    ${favicon_link}    xpd-usw-prd-company-logos.s3.amazonaws.com
    IF    ${status}==${True}
        Set Test Message    Favicon available: ${favicon_link}
    ELSE
         Fail   Check favicon
    END
#    New Page        ${favicon_link}
#    Sleep    10s
#    Find Element    image:./Resources/images/favicon_expedock.png
#    Find Element    image:./Resources/images/favicon_expedock-2.png

Verify user can search for a record and access the shipment details page
    [Tags]  re-run
    #--- Set expected URL
    ${shipper_details_url}          Set Variable   https://apinvdemo.passive-portal.expedock.com/details/${shipment_details}[num]%20(${shipment_details}[org])?breadcrumbs=%7B%22name%22%3A%22Search+Shipments%22%2C%22link%22%3A%22%2Fsearch-shipments%3Fquery%3D${shipment_details}[num]%22%7D&query=${shipment_details}[num]

    #--- Search for a shipment
    RPA.Browser.Playwright.Click    ${searchbar_loc}
    Keyboard Input    insertText     ${shipment_details}[num]
    RPA.Browser.Playwright.Click    text="Track"
    Wait For Elements State         ${shipmentcard_loc}    visible
    RPA.Browser.Playwright.Click    ${shipmentcard_loc}

    #--- Verify Shipment details page URL
    Get Url     ==  ${shipper_details_url}

    #--- Verify Shipment Details page has the corerct tabs
    Run Keyword and COntinue on Failure      Click by role    tab    Summary
    Run Keyword and COntinue on Failure      Click by role    tab    Documents
    Run Keyword and COntinue on Failure      Click by role    tab    Cost per SKU
    Run Keyword and COntinue on Failure      Click by role    tab    Invoices to Pay
    Run Keyword and COntinue on Failure      Click by role    tab    Container Utilization
    Run Keyword and COntinue on Failure      Click by role    tab    Exceptions Management

Verify user can request for access
    [Template]  Verify user can request for access
        Documents
        Cost per SKU
        Invoices to Pay
        Container Utilization
        Exceptions Management

*** Keywords ***
Go to Shipper view landing page
    [Arguments]    ${env}
    New Browser    chromium    headless=false    #downloadsPath=C:\Users\immad\Code\expedock-robot-automation\
    New Context    viewport={'width': 1920, 'height': 1080}    acceptDownloads=True
    Delete All Cookies
    ${old_timeout} =    Set Browser Timeout    1m 30 seconds
    New Page       https://apinvdemo.${env}-portal.expedock.com/search-shipments

Verify user can request for access
    [Arguments]     ${tab}
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

    #Click on a Tab
    RPA.Browser.Playwright.Click    text="${Tab}"

    #Click on Request now button
    RPA.Browser.Playwright.Click    text="REQUEST NOW"

    #Create an identifier
    ${date}=    Get Current Date    result_format=%m%d%Y%H%M%S

    #Fill-out fields
    Wait For Elements State    text=Fill out this form to express your interest     visible
    Fill Text   xpath=//div[@data-testid="paywall-request-modal"] >> css=.css-u74uof >> nth=0    QA${date} Name
    Fill Text   xpath=//div[@data-testid="paywall-request-modal"] >> css=.css-u74uof >> nth=1     QA${date} Org
    Fill Text   xpath=//div[@data-testid="paywall-request-modal"] >> css=.css-u74uof >> nth=2     imma.damalerio+QA${date}@expedock.com

    #Click Submit Request
    RPA.Browser.Playwright.Click    text="SUBMIT REQUEST"

    #Assert that modal was closed and toast notification appears
    ${status}=      Run keyword and return status   Wait For Elements State    text=Fill out this form to express your interest     hidden
    ${status1}=      Run keyword and return status  Wait For Elements State    text="Your request has been submitted!"  visible
    IF    ${status}== ${true} and ${status1}== ${true}
        Set Test Message    ${\n}Pass. Request sent successfully in ${tab} tab   append=True
    ELSE
         Fail   Fail. Check request submission at ${tab} tab
    END