*** Settings ***
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
Test Teardown       Teardown

*** Test Cases ***
Automate record creation
    [Setup]   Run Keywords     Log-in to expedock app          staging      ${jms-uname-imma}         ${jms-password-imma}
    ...     AND     Set Browser Timeout    1min
    Go To    https://staging-app.expedock.com/tasks/fd7f8e65-9a42-4d34-bbbc-b54659339da1
    Wait For Elements State    text="Ingestion"   visible
#    Scroll To Element    xpath=//button[@fdprocessedid="h0pedj"]
    FOR  ${count}   IN RANGE    200
#        Scroll To Element    xpath=//button[@fdprocessedid="h0pedj"]
#        RPA.Browser.Playwright.Click   xpath=//button[@fdprocessedid="h0pedj"]
        RPA.Browser.Playwright.Click    xpath=//button[@aria-label="duplicate"] >> nth=0
        Sleep    5s
    END


#xpath=//*[@data-testid="EditIcon"] >> nth=0
*** Keywords ***
Log-in to expedock app
    [Arguments]    ${env}    ${username}   ${password}
    New Browser    chromium    headless=false    #downloadsPath=C:\Users\immad\Code\expedock-robot-automation\
    New Context    viewport={'width': 1920, 'height': 1080}    acceptDownloads=True
    Delete All Cookies
    ${old_timeout} =    Set Browser Timeout    1m 30 seconds
    New Page       https://${env}-app.expedock.com/
    Set Browser Timeout    ${old_timeout}
    Wait Until Keyword Succeeds    30s    .5s    Wait For Elements State    text="Welcome"   visible    timeout=1 min
    RPA.Browser.Playwright.Click          input#username
    Fill Text      input#username    ${username}
    RPA.Browser.Playwright.Click          input#password
    Fill Text      input#password    ${password}
    RPA.Browser.Playwright.Press Keys     input#password    Enter
    Sleep          10s
