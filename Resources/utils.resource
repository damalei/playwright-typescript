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
    Run Keyword If Test Failed    RPA.Browser.Playwright.Take Screenshot  fullPage=True

Check for 'No data' text on page
    [Arguments]     ${sub_menu}
    #This is to check that the page does not contain the following text 'No data found' and 'No data to display'
#    ${status}=  Wait For Elements State    text="No data found"
    ${count}=   Get Element Count    text="No data found"
#    Run Keyword if  ${status} == ${True}    Fail    Missing data on page
    Run Keyword if  ${count} > ${0}    Fail    Missing data on ${sub_menu}

Click by role
    [Arguments]     ${role}     ${name}
    ${el}=  Get Element By Role    ${role}  name=${name}    exact=True
    RPA.Browser.Playwright.Click    ${el}

Click by strategy
    [Arguments]     ${strategy}   ${text}
    ${el}=   Get Element By    Label    ${text}     exact=True
    RPA.Browser.Playwright.Click    ${el}

#Assert sandboxing fields
#    [Arguments]     ${field}   ${field_text}
#    Click by strategy    label    ${field}
#    ${status}=      Run Keyword And Return Status    Get Element By    text    ${field_text}
#    IF    ${status} == ${True}
#        Set Test Message    Field sanboxing enabled successfully for field: ${field}${\n}  append=True
#    ELSE
#        Fail    Missing Sandbox value for field: ${field}
#    END

Assert sandboxing fields
    [Arguments]     ${field}   ${field_text}     ${field_text1}
#    Click by strategy    label    ${field}
#    Click   xpath=//label[text()='${field}']
#    Click   text='${field}'
    Click   xpath=//div[@data-testid="${field}-custom-multiple-text-field"]
    ${status}=      Run Keyword And Return Status    Get Element By    text    ${field_text}
    ${status1}=      Run Keyword And Return Status    Get Element By    text    ${field_text1}
    IF    ${status} == ${True} and ${status1} == ${True}
        Set Test Message    Field sanboxing enabled successfully for field: ${field}${\n}  append=True
    ELSE
        Fail    Missing Sandbox value for field: ${field}
    END

Assert sandboxing fields disabled
    [Arguments]     ${field_name}
    ${field}=   Get Element By    Label    ${field_name}
    ${msg}=     Run Keyword And Expect Error    *    Get Attribute    ${field}    text
    ${status}=  Run keyword and Return Status   Should Contain    ${msg}    AttributeError: Attribute 'text' not found!
    IF    ${status} == ${True}
        Set Test Message    Field sanboxing disabled successfully for field: ${field}${\n}  append=True
    ELSE
        Fail    ${field_name}: ${msg}
    END

