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

