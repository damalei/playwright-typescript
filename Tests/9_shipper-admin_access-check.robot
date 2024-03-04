*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource

*** Test Cases ***
User navigates to 'Shipper Portal User Management' > To Approve page
    [Documentation]     Verifies that admin user can load the "To approve" tab of Shipper Portal User Management page
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    //div[@data-testid="account-user-info"]
    Click    text="Shipper Portal User Management"
    Keyboard Key    press    Escape
    Click    .css-70qvj9 >> p >> text="To Approve"
    Wait For Elements State    text="No matching shipper portal orgs found with the request's email domain"

User navigates to 'Shipper Portal User Management' > Approved page
    [Documentation]     Verifies that admin user can load the "Approved" tab of Shipper Portal User Management page
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    //div[@data-testid="account-user-info"]
    Click    text="Shipper Portal User Management"
    Keyboard Key    press    Escape
    Click    .css-70qvj9 >> p >> text="Approved"
    Wait For Elements State    text="Accounts may be either active or inactive:"

User navigates to Organization Management page
    [Documentation]     Verifies that admin user can load the Organization Management page
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    //div[@data-testid="account-user-info"]
    Click    text="Organization Management"
    Keyboard Key    press    Escape
    Wait For Elements State    button >> text="Add Organization"



*** Keywords ***