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
#Resource        ../Tests/6_dashboard_sandboxing.robot

Test Teardown       Teardown

Documentation     This test suite covers testing for enabling sandboxing and disabling. It also checks if sanboxing
...        is successfully implemented across the pages or dashboards

*** Variables ***
${branch_1}     DFB
${branch_2}     HKR
${url_with_filter}      https://passive-dashboard.expedock.com/business-performance/overview?apiPartnerIds=36f84e54-05d7-444a-b2ac-09388cf62e2e&filters.shipment=eyJpZCI6IjM4YzI0MmI3LTdkN2UtNDVhOS04ZDI5LWYxODNiNjYyNjM4OCIsInR5cGUiOiJncm91cCIsInByb3BlcnRpZXMiOnsiY29uanVuY3Rpb24iOiJBTkQiLCJub3QiOmZhbHNlfSwiY2hpbGRyZW4xIjp7IjM0NmVlNWFjLWJiNjItNGI2MC1hM2Y4LTg5OWQ1NzI5NzRiYiI6eyJpZCI6IjM0NmVlNWFjLWJiNjItNGI2MC1hM2Y4LTg5OWQ1NzI5NzRiYiIsInR5cGUiOiJydWxlIiwicHJvcGVydGllcyI6eyJmaWVsZCI6InNoaXBtZW50LmRhdGVfc2hpcG1lbnRfY3JlYXRlZCIsIm9wZXJhdG9yIjoiYmV0d2VlbiIsInZhbHVlIjpbeyJ1bml0IjoiREFZIiwidmFsdWUiOiItOTAifSx7InVuaXQiOiJEQVkiLCJ2YWx1ZSI6IjAifV0sInZhbHVlU3JjIjpbInZhbHVlIiwidmFsdWUiXSwidmFsdWVUeXBlIjpbImRhdGUiLCJkYXRlIl0sImZpZWxkU3JjIjoiZmllbGQifX0sImE1OWFhMjJhLTdkZTItNDVmNy1hYmExLWVjYzcwYjBkNzllZSI6eyJpZCI6ImE1OWFhMjJhLTdkZTItNDVmNy1hYmExLWVjYzcwYjBkNzllZSIsInR5cGUiOiJncm91cCIsInByb3BlcnRpZXMiOnsiY29uanVuY3Rpb24iOiJPUiIsIm5vdCI6ZmFsc2V9LCJjaGlsZHJlbjEiOnsiMDk0YzliYjAtZDhiMS00ODIyLThkM2ItZDIxZDQ5MGMxNTY0Ijp7ImlkIjoiMDk0YzliYjAtZDhiMS00ODIyLThkM2ItZDIxZDQ5MGMxNTY0IiwidHlwZSI6InJ1bGUiLCJwcm9wZXJ0aWVzIjp7ImZpZWxkIjoic2hpcG1lbnQuYnJhbmNoIiwib3BlcmF0b3IiOiJlcXVhbCIsInZhbHVlIjpbIkRGQiJdLCJ2YWx1ZVNyYyI6WyJ2YWx1ZSJdLCJ2YWx1ZVR5cGUiOlsidGV4dCJdLCJpc0xvY2tlZCI6ZmFsc2UsImZpZWxkU3JjIjoiZmllbGQifX0sIjc3ZDNlZDY1LTRlNzktNDk4Mi1hZTk1LTc3MmRjN2RhZjlmZCI6eyJpZCI6Ijc3ZDNlZDY1LTRlNzktNDk4Mi1hZTk1LTc3MmRjN2RhZjlmZCIsInR5cGUiOiJydWxlIiwicHJvcGVydGllcyI6eyJmaWVsZCI6InNoaXBtZW50LmJyYW5jaCIsIm9wZXJhdG9yIjoiZXF1YWwiLCJ2YWx1ZSI6WyJIS1IiXSwidmFsdWVTcmMiOlsidmFsdWUiXSwidmFsdWVUeXBlIjpbInRleHQiXSwiaXNMb2NrZWQiOmZhbHNlLCJmaWVsZFNyYyI6ImZpZWxkIn19fX19fQ%3D%3D&unitSettings=eyJjdXJyZW5jeSI6IlVTRCIsImdyb3VwQnlEYXRlIjoiREFURV9TSElQTUVOVF9DUkVBVEVEIiwib3JnVHlwZSI6eyJ0YXJnZXRVbml0IjoiTG9jYWwgQ2xpZW50IiwidHlwZSI6Ik9SR19UWVBFIn0sInBlcmlvZFR5cGUiOiJNT05USExZIiwic2hpcG1lbnRWb2x1bWVVbml0Ijp7InRhcmdldFVuaXQiOiJzaGlwbWVudHMiLCJ0eXBlIjoiU0hJUE1FTlRfQ09VTlQifSwidm9sdW1lVW5pdCI6eyJ0YXJnZXRVbml0IjoiTTMiLCJ0eXBlIjoiVk9MVU1FIn0sIndlaWdodFVuaXQiOnsidGFyZ2V0VW5pdCI6IktHIiwidHlwZSI6IldFSUdIVCJ9fQ%3D%3D

*** Test Cases ***
User saves a basic filter
#    [Tags]  robot:exclude
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
#--- Start of notes:
#--- Changing this section because dropdown options are not predictable, options that are shown by default vary
#    ...     AND     Clear filter
#    ${basic-filters-button}      Get Element By    TestID    basic-filters-button
#    Click   ${basic-filters-button}
#
#    #---Click branch field
#    ${branch-field-label}=    Get Element By    label    Branch   exact=true
#    Click   ${branch-field-label}
#
#    #---Wait for listbox to appear
#    ${branch-list-role}=    Get Element By Role    listbox      name=Branch
#    Wait For Elements State    ${branch-list-role}      visible
#
#    #--Select first option from list
#    Keyboard Key    action    key
#    Click   text="ASI"
#    Click   text="BGS"
#--- End of notes

    #-- Go to URL with filter already set
    Go To    ${url_with_filter}
    
    #--Save filter
    Click   text="Save Filters"

    #--Move away from the current dashboard
#    ${side-account-overview}=   Get Element By    TestID    sidebar-tab-ACCOUNT_OVERVIEW
#    Click       ${side-account-overview}
    Click   text="Declaration Reports"

    #--Move back to previous dashboard
    ${side-overview}=   Get Element By    TestID    sidebar-tab-OVERVIEW
    Click       ${side-overview}

    #--Verify that basic filters was saved successfully
    Assert sandboxing fields    Branch    ${branch_1}   ${branch_2}

User deletes a saved basic filter
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Click   text="Business Performance"
    ${side-overview}=   Get Element By    TestID    sidebar-tab-OVERVIEW
    Click       ${side-overview}
    Assert sandboxing fields    Branch    ${branch_1}   ${branch_2}

    ${advance-button}=      Get Element By     TestID   advanced-filters-button
    Click   ${advance-button}
    ${clear-button}=        Get Element By      TestID      advanced-filters-clear-btn
    Click   ${clear-button}

    ${basic-filters-button}      Get Element By    TestID    basic-filters-button
    Click   ${basic-filters-button}

    #--Move away from the current dashboard
#    ${side-account-overview}=   Get Element By    TestID    sidebar-tab-ACCOUNT_OVERVIEW
#    Click       ${side-account-overview}
    Click   text="Declaration Reports"

    #--Move back to previous dashboard
    ${side-overview}=   Get Element By    TestID    sidebar-tab-OVERVIEW
    Click       ${side-overview}

    #--Verify filter save is successful
    Assert sandboxing fields disabled   Branch

*** Keywords ***
Clear filter
    Click   text="Business Performance"
    ${side-overview}=   Get Element By    TestID    sidebar-tab-OVERVIEW
    Click       ${side-overview}
    ${advance-button}=      Get Element By     TestID   advanced-filters-button
    Click   ${advance-button}
    ${clear-button}=        Get Element By      TestID      advanced-filters-clear-btn
    Click   ${clear-button}


