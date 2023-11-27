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

*** Test Cases ***
Create AN Job
    Log-in to expedock app          passive      ${jms-uname}         ${jms-password}
    ${name}=                        Create a task name
    Create a task                   ${name}
    Filter by QATEST
    Scroll To Element    text="${name}"
    Wait Until Keyword Succeeds     20s     1s      RPA.Browser.Playwright.Click    text="${name}"
    Sleep    1min

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

Create a task name
    ${date}=        Get Current Date    result_format=%Y%m%d%H%M
    ${name}=        Set variable    QATEST${date}
    [return]       ${name}

Create a task
    [Arguments]     ${name}
    Wait Until Keyword Succeeds     10s     1s      RPA.Browser.Playwright.Click    text="+ Create Task"
    Wait Until Keyword Succeeds     10s     1s      RPA.Browser.Playwright.Click    xpath=//textarea[@data-testid="task-name-textfield"]
#    Keyboard Input      insertText      ${name}
    Fill Text    xpath=//textarea[@data-testid="task-name-textfield"]    ${name}
    RPA.Browser.Playwright.Click    xpath=//input[@data-testid="task-reference-textfield"]
    Keyboard Input      insertText      ${name}tri
    RPA.Browser.Playwright.Click    xpath=//div[@id="company-select"]
    Wait Until Keyword Succeeds     10s     1s      RPA.Browser.Playwright.Click    xpath=//li[@data-testid="AP Invoice (Demo)"]
    RPA.Browser.Playwright.Click    text="Create Task"

Filter by QATEST
    RPA.Browser.Playwright.Click    xpath=//input[@aria-label="search tasks (at least three characters)"]
    RPA.Browser.Playwright.Press Keys      xpath=//input[@aria-label="search tasks (at least three characters)"]       Control+A
    RPA.Browser.Playwright.Press Keys      xpath=//input[@aria-label="search tasks (at least three characters)"]       Delete
    Keyboard Input      insertText      QATEST
    RPA.Browser.Playwright.Press Keys      xpath=//input[@aria-label="search tasks (at least three characters)"]       Enter

