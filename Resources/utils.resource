*** Settings ***
Library     RPA.FileSystem
Library    OperatingSystem
Library    RPA.Browser.Playwright
Library         String
Library         Collections
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource

*** Variables ***
${xpath_subtabs}    //li/a/div[@class="css-18afiq7-menuIcon"]/following-sibling::span

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
    [Arguments]     ${field}   ${field_text}     ${field_text1}     ${subtab_name}
    ${field_exists}=    Get Element States    xpath=//div[@data-testid="${field}-custom-multiple-text-field"]   then    bool(value & visible)
    IF    ${field_exists} == ${TRUE}
            Click   xpath=//div[@data-testid="${field}-custom-multiple-text-field"]
            ${status}=      Run Keyword And Return Status    Get Element By    text    ${field_text}
            ${status1}=      Run Keyword And Return Status    Get Element By    text    ${field_text1}
            IF    ${status} == ${True} and ${status1} == ${True}
                Set Test Message    ${\n}${subtab_name} > ${field}: Passed    append=True
            ELSE
                Run keyword and Continue on Failure    Fail    ${\n}${subtab_name} > ${field}: Failed   append=True
            END
    ELSE
                Set Test Message    ${\n}${subtab_name} > ${field}: Skipped     append=True
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

Get name of all specified visible elements
    [Arguments]     @{list}
    @{el_names}=    Create List    ${EMPTY}
        FOR    ${el}    IN    @{list}
            ${text}=    Get Text    ${el}
            Append To List    ${el_names}  ${text}
        END
        ${cleared_sub_tabs}=    Evaluate    [x for x in ${el_names} if x]
    [Return]    ${cleared_sub_tabs}

Check dashboard is native
    ${is_native}=   Run Keyword And Return Status    Wait For Elements State    css=.css-f40i2i-root >> css=.css-19b5ble   visible
    [Return]    ${is_native}

Check dashboard charts
    #Check dashboard charts for error messages
    [Arguments]     ${subtab_name}
    @{charts}=          Get Elements        .css-uu0t0f-title
    @{chart-names}=     Get name of all specified visible elements  @{charts}

        FOR    ${chart-name}    IN    @{chart-names}
            Log To Console    Checking chart: ${chart-name}
            Run keyword and continue on Failure     Check Charts     ${subtab_name}     ${chart-name}

        END

Check Charts
    [Arguments]     ${subtab_name}  ${chart-name}
        Scroll To Element    text=${chart-name}
        ${is_error}=        Get Element States         //div[@data-testid="data-component-${chart-name}"] >> text=error       then     bool(value & visible)
        ${is_na}=           Get Element States         //div[@data-testid="data-component-${chart-name}"] >> text=N/A       then     bool(value & visible)
        ${is_failed}=       Get Element States         //div[@data-testid="data-component-${chart-name}"] >> text=fail       then     bool(value & visible)
        ${is_noData}=       Get Element States         //div[@data-testid="data-component-${chart-name}"] >> text=No data       then     bool(value & visible)
           IF    ${is_error}==${true} or ${is_failed}==${true} or ${is_noData}==${true}
                Take Screenshot
                Run Keyword And Continue On Failure    Fail   ${\n}Chart issue: ${chart-name}    Append=True
            ELSE IF     ${is_na}==${true}
                Take Screenshot
                Run Keyword And Continue On Failure     Fail    ${\n}Detected N/A on ${subtab_name} > ${chart-name}. Possible N/A data point. Check screenshot  Append=True
            ELSE
                No Operation
            END

Verify all charts have loaded
    #Check number of .css-1sfs6lo-grid == number of .css-jesopd-boxBody
    ${el_grid}=     Get element count    .css-1sfs6lo-grid
    ${el_body}=     Get Element Count    .css-jesopd-boxBody
    ${el_box}=      Get Element Count    .css-17cff7m-box

        IF    ${el_body} != ${0}
                ${status_1}=      Run keyword and return status   Should Be Equal As Integers    ${el_grid}    ${el_body}
                ${status_2}=      Run keyword and return status   Should Be Equal As Integers    ${el_box}    ${el_body}
            IF   ${status_1} == ${True} or ${status_2} == ${True}
                RETURN  ${True}
            ELSE
                RETURN  ${False}
            END
        ELSE
             Fail
        END

