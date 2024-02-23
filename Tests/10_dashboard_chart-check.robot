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

@{el_names}        ${empty}

${xpath_subtabs}    //li/a/div[@class="css-18afiq7-menuIcon"]/following-sibling::span

*** Test Cases ***
Verify charts in the native dashboards load sucessfully
    [Setup]     Run Keywords
    ...     Log-in to expedock      passive     ${username}     ${password}
    ...     AND     Click   .css-sneu20-menuText >> text="Dashboard"        #To collapse dashboard tab
    ...     AND     Click   .css-sneu20-menuText >> text="Business Performance"
    ...     AND     Click   .css-sneu20-menuText >> text="Operations"
    ...     AND     Click   .css-sneu20-menuText >> text="Accounting"
    ...     AND     Click   .css-sneu20-menuText >> text="Sales"
    @{SUB_TABS}=     Get Elements    xpath=${xpath_subtabs}
    ${filtered_subtab_names}=   Get name of all specified visible elements  @{SUB_TABS}
    FOR    ${subtab_name}    IN    @{filtered_subtab_names}
        Click    .css-xutiuc-menuText-nestedMenuItems >> text="${subtab_name}"
        ${is_native}=     Check dashboard is native
        Run Keyword If    ${is_native} == ${true}
        ...   Check dashboard charts        ${subtab_name}
        ...  ELSE
        ...    Set Test Message        ${\n}Dashboard: ${subtab_name} is a metabase dashboard. Skipped   append=True
    END

*** Keywords ***
Get name of all specified visible elements
    [Arguments]     ${list}
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
    [Arguments]     ${dashboard_name}
    Wait For Elements State    .css-jesopd-boxBody  visible
    @{charts}=  Get Elements    css=.css-17cff7m-box
#    ${filtered_chart_names}=    Get name of all specified visible elements  @{charts}
    FOR    ${chart}    IN    @{charts}
        Scroll To Element    ${chart}
        ${is_error}=    Run Keyword And Return Status    Wait For Elements State    ${chart} >> text= failed
        ${is_na}=    Run Keyword And Return Status    Wait For Elements State    ${chart} >> text= error
        ${is_failed}=   Run Keyword And Return Status    Wait For Elements State    ${chart} >> text= n/a
        ${is_no_data}

        if ${is+er

    END


