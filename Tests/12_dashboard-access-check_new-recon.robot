*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library    DateTime
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown

*** Variables ***
@{new_recon_tabs}
...     All
...     To Do
...     No Shipment Found
...     For Expedock
...     For Others
...     Matched
...     Done

${critical_test}    ${TRUE}

*** Test Cases ***
User opens the new recon dashboard
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="To-Do Dashboard"
   ${is_page_load}=  Run keyword and return status     Wait For Elements State    text="Reconciliation Results"
   Check verification step status       ${is_page_load}

User clicks on new recon dashboard tabs
    [Setup]     Run keywords    Run Keyword if      ${critical_test}==${False}       Skip    Test skipped. Critical test failed
    ...     AND     Set Browser Timeout    1min
    Log-in to expedock   passive     ${ap-username}     ${ap-password}
    Click    text="To-Do Dashboard"
    Wait For Elements State    text="Reconciliation Results"
    FOR    ${tab}    IN    @{new_recon_tabs}
        Click    text="${tab}"
        Wait For Elements State    text="Reconciliation Results"
        Run Keyword And Continue On Failure    Verify page loaded     .css-w1ako7-tableHeaderRow
    END

    
User clicks on Job Name links
    [Setup]     Run keywords    Run Keyword if      ${critical_test}==${False}       Skip    Test skipped. Critical test failed
    ...     AND     Set Browser Timeout    1min
    Log-in to expedock   passive     ${ap-username}     ${ap-password}
    Click    text="To-Do Dashboard"
    FOR    ${tab}    IN    @{new_recon_tabs}
        Click    text="${tab}"
        Wait For Elements State    text="Reconciliation Results"
        ${is_data_available}=  Run keyword and return status    Wait For Elements State    .css-1ff8xg2 >> nth=0
        IF    ${is_data_available}==${TRUE}
            ${job_name}=    Get Text    .css-1ff8xg2 >> nth=0
            Click   .css-1ff8xg2 >> nth=0
            Run Keyword And Continue On Failure    Verify page loaded     .css-10y4rjt >> text="Job ${job_name}"
            Click    text="Reconciliation Results"
        END
    END

User checks export button name adapts to tab opened
    [Setup]     Run keywords    Run Keyword if      ${critical_test}==${False}       Skip    Test skipped. Critical test failed
    ...     AND     Set Browser Timeout    1min
    Log-in to expedock   passive     ${ap-username}     ${ap-password}
    Click    text="To-Do Dashboard"
    FOR    ${tab}    IN    @{new_recon_tabs}
        Click    text="${tab}"
        Wait For Elements State    text="Reconciliation Results"
        Run Keyword And Continue On Failure    Get Element States    .css-mhgn7n >> text="Export “${tab}” tab"  validate    value & visible
    END

User clicks on export button on each tab
    [Setup]     Run keywords    Run Keyword if      ${critical_test}==${False}       Skip    Test skipped. Critical test failed
    ...     AND     Set Browser Timeout    1min
    Log-in to expedock   passive     ${ap-username}     ${ap-password}
    Click    text="To-Do Dashboard"
    ${date}=        Get Current Date    result_format=%Y-%m-%d
    FOR    ${tab}    IN    @{new_recon_tabs}
        Click    text="${tab}"
        Wait For Elements State    text="Reconciliation Results"
        Click    .css-mhgn7n >> text="Export “${tab}” tab"
        ${dl_promise}          Promise To Wait For Download    C:/Users/immad/Downloads/2024-03-15_${tab}_jobs.xlsx
        ${file_obj}=           Wait For    ${dl_promise}
        File Should Exist      ${file_obj}[saveAs]
    END


    

*** Keywords ***
Verify page loaded
    [Arguments]     ${component}
    ${is_page_load}=  Run keyword and return status     Wait For Elements State    ${component}
    Check verification step status       ${is_page_load}

Check verification step status
   [Arguments]     ${is_verified}
   IF    ${is_verified}==${True}
       Set Suite Variable    ${critical_test}   ${True}
   ELSE
       Set Suite Variable    ${critical_test}   ${False}
   END
    