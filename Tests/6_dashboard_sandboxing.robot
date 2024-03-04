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
${sales_1}      Alyssa Jones (AJ)
${sales_2}      Melissa Williams (MW)
${ops_1}        Melody Thomas (MT)
${ops_2}        Jason Robinson (JR)
${branch_1}     HK1
${branch_2}     TFU
${dept_1}       FES
${dept_2}       FIS

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
    ${edit_access}=     Set Variable        xpath=//*[@data-testid='EditIcon'] >> nth=0
    Click      ${edit_access}

    #--- Wait for modal to appear
    Wait For Elements State    text="Update User"   visible

    #---Clearing possible existing values in sandbox fields
    Run Keyword And Ignore Error     Clear combobox by label     Sales Rep
    Run Keyword And Ignore Error     Clear combobox by label     Operator
    Run Keyword And Ignore Error     Clear combobox by label     Branch
    Run Keyword And Ignore Error     Clear combobox by label     Department

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
    Assert sandboxing fields    Branch    ${branch_1}   ${branch_2}     Overview
    Assert sandboxing fields    Department    ${dept_1}     ${dept_2}   Overview
    Assert sandboxing fields    Operator    ${ops_1}    ${ops_2}    Overview
    Assert sandboxing fields    Sales Rep    ${sales_1}  ${sales_2}  Overview

User checks on each native dashboard that the sandbox filters are enabled
    [Setup]     Run Keywords
    ...     Log-in to expedock      passive     ${username}     ${password}
    ...     AND     Click   .css-sneu20-menuText >> text="Dashboard"        #To collapse dashboard tab
    ...     AND     Click   .css-sneu20-menuText >> text="Business Performance"
    ...     AND     Click   .css-sneu20-menuText >> text="Operations"
    ...     AND     Click   .css-sneu20-menuText >> text="Accounting"
    ...     AND     Click   .css-sneu20-menuText >> text="Sales"
#    ...     AND     Click   .css-sneu20-menuText >> text="Explore"

    #---Get dashboard or sub-tab names
    @{SUB_TABS}=     Get Elements    xpath=${xpath_subtabs}
    ${filtered_subtab_names}=   Get name of all specified visible elements  @{SUB_TABS}

    #---Loop and access each sub-tab or dashboard
        FOR    ${subtab_name}    IN    @{filtered_subtab_names}
            Log To Console    Starting check for dashboard: ${subtab_name}
            Click    .css-xutiuc-menuText-nestedMenuItems >> text="${subtab_name}"

    #---Check if dashboard is a native dashboard
            ${is_native}=     Check dashboard is native

    #---Start fields checks if yes
            IF    ${is_native} == ${true}

    #---Verify all charts are loaded in the dashboard before check starts
                Wait Until Keyword Succeeds    5min     30s     Verify all charts have loaded

    #---Start check if fields contain sandbox filters
                Assert if fields contain sandbox filters    ${subtab_name}

    #---Log skip dashboard message if non-native
            ELSE
                 Set Test Message        ${\n}Dashboard: ${subtab_name} is a metabase dashboard. Skipped   append=True
            END
        END


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
    ${edit_access}=     Set Variable        xpath=//*[@data-testid='EditIcon'] >> nth=0
    Click      ${edit_access}

    #--- Wait for modal to appear
    Wait For Elements State    text="Update User"   visible

    #---Clearing possible existing values in sandbox fields
    Run keyword and continue on failure     Clear combobox by label     Sales Rep
    Run keyword and continue on failure     Clear combobox by label     Operator
    Run keyword and continue on failure     Clear combobox by label     Branch
    Run keyword and continue on failure     Clear combobox by label     Department

    #--- Disable sandboxing
    ${checker}=     Get Element By    Label    Can only access shipments
    ${checker_value}=   Get Attribute    ${checker}    value
    Run Keyword If    '${checker_value}' == 'true'   Click   ${checker}

    #--- Click Save
    Scroll To Element    xpath=//button[contains(text(),'Save')]
#    Click   xpath=//button[contains(text(),'Save')]
    Click    button >> text="Save"
    Wait For Elements State    text="Update User"   hidden

    #--- Close browser
    Close Browser

    #--- Re-open and login to test account
    Log-in to expedock   passive     ${username}     ${password}

    #--- Verify that sandboxing is disabled
    Click   text="Business Performance"
    Click by role    link    Overview
    Run Keyword And Continue On Failure     Wait For Elements State    xpath=//label[contains(text(),'Branch')]    visible
    Run Keyword And Continue On Failure     Wait For Elements State    xpath=//label[contains(text(),'Department')]    visible
    Run Keyword And Continue On Failure     Wait For Elements State    xpath=//label[contains(text(),'Operator')]  visible
    Run Keyword And Continue On Failure     Wait For Elements State    xpath=//label[contains(text(),'Sales Rep')]  visible

*** Keywords ***
Add sandbox option
    [Arguments]     ${label}    ${option_name}
    ${field}=       Get element by  label   ${label}    exact=True
    Click     ${field}
    ${option}=    Get Element By Role    option   name=${option_name}
    Click    ${option}



Clear combobox by label
    [Arguments]     ${label}
#    ${field}=      Get Element By  Label    ${label}    exact=True
#    Click   ${field}
#    ${clear}=   Get Element By Role    button   name=Clear
#    Click   ${clear}

    ${field}=      Get Element By  Label    ${label}    exact=True
    Click   ${field}
    ${clear}=   Get Element By Role    button   name=Clear
    ${is_clear_visible}=    Get Element States    ${clear}  then    bool(value & visible)
    IF    ${is_clear_visible} == ${TRUE}
        Click    ${clear}
    ELSE
        No Operation
    END

Assert if fields contain sandbox filters
    [Arguments]     ${subtab_name}
    Assert sandboxing fields    Branch    ${branch_1}   ${branch_2}     ${subtab_name}
    Assert sandboxing fields    Department    ${dept_1}     ${dept_2}   ${subtab_name}
    Assert sandboxing fields    Operator    ${ops_1}    ${ops_2}    ${subtab_name}
    IF  '${subtab_name}'=='Overview'
        Assert sandboxing fields    Sales Representative    ${sales_1}  ${sales_2}      ${subtab_name}
    ELSE
        Assert sandboxing fields    Sales Rep    ${sales_1}  ${sales_2}      ${subtab_name}
    END












    
