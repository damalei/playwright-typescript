*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library    RPA.RobotLogListener
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
Documentation     This test suite covers testing for enabling sandboxing and disabling. It also checks if sanboxing
...        is successfully implemented across the pages or dashboards

*** Variables ***
${url_user_manage}  https://passive-dashboard.expedock.com/user-management?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6

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
    Add sandbox option    Sales Rep     Shirley Shea (OFRS)
    Add sandbox option    Sales Rep     Melissa Williams (MW)
    Add sandbox option    Operator      Nina Shelton (ILQE)
    Add sandbox option    Operator      Tina Sheppard (YPBJ)
    Add sandbox option    Branch        HK1
    Add sandbox option    Branch        BNW
    Add sandbox option    Department    FJL
    Add sandbox option    Department    LIN

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
    Assert sandboxing fields    Branch    HK1BNWBranch
    Assert sandboxing fields    Department    FJLLINDepartment
    Assert sandboxing fields    Operator    Nina Shelton (ILQE)Tina Sheppard (YPBJ)
    Assert sandboxing fields    Sales Representative    Shirley Shea (OFRS)Melissa Williams (MW)

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
        Set Test Message    Field sanboxing successful for field: ${field}${\n}  append=True
    ELSE
        Fail    Missing Sandbox value for field: ${field}
    END

Clear combobox by label
    [Arguments]     ${label}
    ${field}=      Get Element By  Label    ${label}    exact=True
    Click   ${field}
    ${clear}=   Get Element By Role    button   name=Clear
    Click   ${clear}












    
