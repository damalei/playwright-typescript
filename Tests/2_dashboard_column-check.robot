*** Settings ***
Suite Setup     Log-in to expedock   passive     ${username}     ${password}
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
Test Teardown       Teardown

*** Variables ***
@{shipment_columns}

*** Test Cases ***
#Verify that when user clicks column names, the page does not refresh to an empty page (Operation > Negative Profit Shipments)
#    Click       text="Operations"
#    Click       text="Negative Profit Shipments"
#    Wait For Elements State    text=Total Shipments:    timeout=30s
#    Click on column header names    Total Shipments:

Verify that when user clicks column names, the page does not refresh to an empty page (Explore > Explore Shipments)
    Click       text="Explore"
    Click       text="Explore Shipments"
    Wait For Elements State    text=Total Shipments:    timeout=30s
    Click on column header names    Total Shipments:

Verify that when user clicks column names, the page does not refresh to an empty page (Explore > Payable Invoices)
    Click       text="Explore"
    Click       text="Payable Invoices"
    Wait For Elements State    text=Total Invoices:     timeout=30s
    Click on column header names    Total Invoices:

Verify that when user clicks column names, the page does not refresh to an empty page (Explore > Receivable Invoices)
    Click       text="Explore"
    Click       text="Receivable Invoices"
    Wait For Elements State    text=Total Invoices:     timeout=30s
    Click on column header names    Total Invoices:

Verify that when user clicks column names, the page does not refresh to an empty page (Explore > Explore Organizations)
    Click       text="Explore"
    Click       text="Explore Organizations"
    Wait For Elements State    text=Total Organizations:     timeout=30s
    Click on column header names    Total Organizations:

*** Keywords ***
Click on column header names
    [Arguments]     ${reference_text}
    @{elements}=     Get Elements    css=.css-ta4bw4
    FOR    ${element}    IN    @{elements}
        ${option_value} =   Get Text    ${element}
        Click    ${element}
        Run Keyword And Continue On Failure    Wait For Elements State    text=${reference_text}  timeout=30s
    END
