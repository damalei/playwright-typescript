*** Settings ***
Library     RPA.FileSystem
Library    OperatingSystem
Library    RPA.Browser.Playwright
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource

*** Keywords ***
Log-in to expedock
    [Arguments]    ${env}    ${username}   ${password}
    New Browser    chromium    headless=false    #downloadsPath=C:\Users\immad\Code\expedock-robot-automation\
    New Context    viewport={'width': 1920, 'height': 1080}    acceptDownloads=True
    Delete All Cookies
    ${old_timeout} =    Set Browser Timeout    1m 30 seconds
    New Page       https://${env}-dashboard.expedock.com/
    Set Browser Timeout    ${old_timeout}
    Wait Until Keyword Succeeds    30s    .5s    Wait For Elements State    text="Welcome"   visible    timeout=1 min
    RPA.Browser.Playwright.Click          input#username
    Fill Text      input#username    ${username}
    RPA.Browser.Playwright.Click          input#password
    Fill Text      input#password    ${password}
    RPA.Browser.Playwright.Press Keys     input#password    Enter
    Sleep          10s

Teardown
    Run Keyword If Test Failed    Take Screenshot  fullPage=True

