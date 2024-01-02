*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library         RPA.RobotLogListener
Resource        ../Resources/credentials.resource
Resource        ../Resources/config.resource
Resource        ../Resources/utils.resource
Documentation     This test suite covers testing for enabling sandboxing and disabling. It also checks if sanboxing
...        is successfully implemented across the pages or dashboards

*** Variables ***
${url_user_manage}  https://passive-dashboard.expedock.com/user-management?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6
${sales_1}      Shirley Mayo (LGQG)
${sales_2}      Melissa Williams (MW)
${ops_1}        Mario Kidd (CXHK)
${ops_2}        Omar Watson (GSYQ)
${branch_1}     HK1
${branch_2}     OIJ
${dept_1}       FJL
${dept_2}       LIN

*** Test Cases ***
User enables sandboxing
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    #--- Go to User management page
    Go To    ${url_user_manage}

    #--- Search for a user
    Click by strategy   Label   Email
    Keyboard Input    insertText    ${username}
    Click by role    button    Search

    #-- Click edit access on first result
    ${edit_access}=     Set Variable        xpath=//*[@data-testid="EditIcon"] >> nth=0
    Click      ${edit_access}

    #--- Wait for modal to appear
    Wait For Elements State    text="Update User"   visible

    #---Clearing possible existing values in sandbox fields
    Run keyword and continue on failure     Clear combobox by label     Sales Rep
    Run keyword and continue on failure     Clear combobox by label     Operator
    Run keyword and continue on failure     Clear combobox by label     Branch
    Run keyword and continue on failure     Clear combobox by label     Department

    #--- Input options for sandbox fields
    Add sandbox option    Sales Rep     ${sales_1}
    Add sandbox option    Sales Rep     ${sales_2}
    Add sandbox option    Operator      ${ops_1}
    Add sandbox option    Operator      ${ops_2}
    Add sandbox option    Branch        ${branch_1}
    Add sandbox option    Branch        ${branch_2}
    Add sandbox option    Department    ${dept_1}
    Add sandbox option    Department    ${dept_2}

    #--- Enable sandboxing
    ${checker}=     Get Element By    Label    Can only access shipments
    ${checker_value}=   Get Attribute    ${checker}    value
    Run Keyword If    '${checker_value}' == 'false'   Click   ${checker}

    #--- Click Save
    Click by role    button     Save

    #--- Close browser
    Close Browser

    #--- Re-open and login to test account
    Log-in to expedock   passive     ${username}     ${password}

    #--- Verify that sandboxing is enabled
    Click   text="Business Performance"
    Click by role    link    Overview
    Assert sandboxing fields    Branch    ${branch_1}${branch_2}Branch
    Assert sandboxing fields    Department    ${dept_1}${dept_2}Department
    Assert sandboxing fields    Operator    ${ops_1}${ops_2}
    Assert sandboxing fields    Sales Representative    ${sales_1}${sales_2}

User disables sandboxing
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min

    #--- Go to User management page
    Go To    ${url_user_manage}

    #--- Search for a user
    Click by strategy   Label   Email
    Keyboard Input    insertText    ${username}
    Click by role    button    Search

    #-- Click edit access on first result
    ${edit_access}=     Set Variable        xpath=//*[@data-testid="EditIcon"] >> nth=0
    Click      ${edit_access}

    #--- Wait for modal to appear
    Wait For Elements State    text="Update User"   visible

    #--- Disable sandboxing
    ${checker}=     Get Element By    Label    Can only access shipments
    ${checker_value}=   Get Attribute    ${checker}    value
    Run Keyword If    '${checker_value}' == 'true'   Click   ${checker}

    #--- Click Save
    Click by role    button     Save

    #--- Close browser
    Close Browser

    #--- Re-open and login to test account
    Log-in to expedock   passive     ${username}     ${password}

    #--- Verify that sandboxing is disabled
    Click   text="Business Performance"
    Click by role    link    Overview
    Run Keyword And Continue On Failure     Assert sandboxing fields disabled    Branch    ${EMPTY}
    Run Keyword And Continue On Failure     Assert sandboxing fields disabled    Department    ${EMPTY}
    Run Keyword And Continue On Failure     Assert sandboxing fields disabled    Operator    ${EMPTY}
    Run Keyword And Continue On Failure     Assert sandboxing fields disabled    Sales Representative    ${EMPTY}

*** Keywords ***
Add sandbox option
    [Arguments]     ${label}    ${option_name}
    ${field}=       Get element by  label   ${label}    exact=True
    Click     ${field}
    ${option}    Get Element By Role    option   name=${option_name}
    Click    ${option}

Assert sandboxing fields
    [Arguments]     ${field}   ${field_text}
    Click by strategy    label    ${field}
    ${status}=      Run Keyword And Return Status    Get Element By    text    ${field_text}
    IF    ${status} == ${True}
        Set Test Message    Field sanboxing enabled successfully for field: ${field}${\n}  append=True
    ELSE
        Fail    Missing Sandbox value for field: ${field}
    END

Clear combobox by label
    [Arguments]     ${label}
    ${field}=      Get Element By  Label    ${label}    exact=True
    Click   ${field}
    ${clear}=   Get Element By Role    button   name=Clear
    Click   ${clear}

Assert sandboxing fields disabled
    [Arguments]     ${field_name}   ${field_text}
    ${field}=   Get Element By    Label    ${field_name}
    ${msg}=     Run Keyword And Expect Error    *    Get Attribute    ${field}    text
    ${status}=  Run keyword and Return Status   Should Contain    ${msg}    AttributeError: Attribute 'text' not found!
    IF    ${status} == ${True}
        Set Test Message    Field sanboxing disabled successfully for field: ${field}${\n}  append=True
    ELSE
        Fail    ${field_name}: ${msg}
    END












    
