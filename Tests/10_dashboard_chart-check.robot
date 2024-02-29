*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown

*** Variables ***
@{main_tabs}
...     Business Performance
...     Operations
...     Accounting
...     Sales
...     Explore

${xpath_subtabs}    //li/a/div[@class="css-18afiq7-menuIcon"]/following-sibling::span

*** Test Cases ***
Verify charts in the native dashboards load sucessfully
    [Tags]      robot:exclude
    [Setup]     Run Keywords
    ...     Log-in to expedock      passive     ${username}     ${password}
    ...     AND     Click   .css-sneu20-menuText >> text="Dashboard"        #To collapse dashboard tab
    ...     AND     Click   .css-sneu20-menuText >> text="Business Performance"
    ...     AND     Click   .css-sneu20-menuText >> text="Operations"
    ...     AND     Click   .css-sneu20-menuText >> text="Accounting"
    ...     AND     Click   .css-sneu20-menuText >> text="Sales"

    #Get dashboard or sub-tab names
    @{SUB_TABS}=     Get Elements    xpath=${xpath_subtabs}
    ${filtered_subtab_names}=   Get name of all specified visible elements  @{SUB_TABS}

    #Loop and access each sub-tab or dashboard
        FOR    ${subtab_name}    IN    @{filtered_subtab_names}
            Log To Console    Starting check for dashboard: ${subtab_name}
            Click    .css-xutiuc-menuText-nestedMenuItems >> text="${subtab_name}"
            ${is_native}=     Check dashboard is native

        #Clear dashboard filters
            Wait For Elements State    button >> text="Advanced"    timeout=1 min
            Click    button >> text="Advanced"
            ${clearButton_state}=    Get element states     button >> text="Clear"   then    bool(value & visible)
                IF    ${clearButton_state}==${true}
                     Click    button >> text="Clear"
                END

        #Verify all charts are loaded in the dashboard before check starts
            Wait Until Keyword Succeeds    5min     30s     Verify all charts have loaded

        #Start chart checks if dashboard is a native dashboard
            Run Keyword If    ${is_native} == ${true}
            ...   Check dashboard charts    ${subtab_name}
            ...  ELSE
            ...    Set Test Message        ${\n}Dashboard: ${subtab_name} is a metabase dashboard. Skipped   append=True
        END

*** Keywords ***
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