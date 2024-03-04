*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
#Test Teardown       Teardown

*** Variables ***
@{business_performance}
...                     Overview
#...                     Account Overview
...                     Branch Overview*
#...                     Department Overview
#...                     Most Profitable Routes
#...                     Top Expenses
...                     Shipment Reports
...                     Agent Report
...                     Staffing Reports
#...                     Carrier Reports [AIR]
#...                     Carrier Reports [SEA]
...                     Container Util

@{Overview-charts}
...                     Revenue for Latest Month
...                     Expenses for Latest Month
...                     Gross Margin for Latest Month
...                     Average Margin per Shipment for Latest Month
...                     Shipment Volume for Latest Month
...                     Files per Operator for Latest Month
...                     Margin (Net Profit) By Date Shipment Created
...                     Margin Percent By Date Shipment Created
...                     Revenue By Date Shipment Created
...                     Expenses By Date Shipment Created
...                     Shipment Volume By Date Shipment Created
...                     Shipments Per Milestone for Latest Month
...                     Top 20 Operators by Shipment Volume
...                     Top 20 Sales Reps by Net Profit
...                     Net Profit for Most Recent 12 months vs Previous 12 months
...                     Order to Cash Cycle in Days

#@{Account-Overview-charts}
#...                     Margin (Net Profit) By Account
#...                     Margin Percent By Account
#...                     Revenue By Account
#...                     Expenses By Account
#...                     Shipment Volume By Account

@{Branch-Overview-charts}
...                     Margin (Net Profit) By Branch
...                     Margin Percent By Branch
...                     Revenue By Branch
...                     Expenses By Branch
...                     Shipment Volume By Branch
...                     Milestones By Branch for Latest Month (2024 Jan)
...                     Shipments per Operator By Branch

@{Department-Overview-charts}
...                     Margin (Net Profit) By Department
...                     Margin Percent By Department
...                     Revenue By Department
...                     Expenses By Department
...                     Shipment Volume By Department

@{Most-Profitable-Routes-charts}
...                     Top 20 Most Profitable Routes

@{Top-Expenses-charts}
...                     Top 20 Expenses By Creditor
...                     Top 20 Expenses By Charge Code
...                     Expenses By Date Shipment
...                     Expenses for Most Recent 12 months vs Previous 12 months

@{Shipment-Reports-charts}
...                     \# Shipments by Branch and Month
...                     \# Shipments by Branch, Operator, and Month
...                     \# Shipments by Branch, Local Client, and Month
...                     \# Shipments by Controlling Customer, Local Client, and Month
...                     \# Shipments by Controlling Customer, Branch, and Month
...                     \# Shipments and Job Profit by Operator and Month

@{Agent-Report-charts}
...                     Top 20 Sending Agents by Net Profit
...                     Top 20 Receiving Agents by Net Profit
...                     Top 20 Sending Agents by Revenue
...                     Top 20 Receiving Agents by Revenue
...                     Top 20 Sending Agents by Expenses
...                     Top 20 Receiving Agents by Expenses
...                     Top 20 Sending Agents by Total Volume
...                     Top 20 Receiving Agents by Total Volume
...                     Top 20 Sending Agents by Total Weight
...                     Top 20 Receiving Agents by Total Weight
...                     Top 20 Sending Agents by Number of Shipments
...                     Top 20 Receiving Agents by Number of Shipments
...                     Top 20 Sending Agents by TEUs
...                     Top 20 Receiving Agents by TEUs
...                     Net Profit by Sending Agent
...                     Net Profit by Receiving Agent
...                     Revenue by Sending Agent
...                     Revenue by Receiving Agent
...                     Expenses by Sending Agent
...                     Expenses by Receiving Agent
...                     Total Volume by Sending Agent
...                     Total Volume by Receiving Agent
...                     Total Weight by Sending Agent
...                     Total Weight by Receiving Agent
...                     Number of Shipments by Sending Agent
...                     Number of Shipments by Receiving Agent
...                     TEUs by Sending Agent
...                     TEUs by Receiving Agent

@{Staffing-Reports-charts}
...     Top 20 Operations Staff By Net Profit
...     Top 20 Operations Staff By Expenses
...     Top 20 Operations Staff By Revenue
...     Top 20 Operations Staff By Shipment Volume

#@{Carrier-Reports-[AIR]-charts}
#...     Top 10 Carrier & Operations Staff by Chargeable Weight
#...     Top 10 Carrier by Chargeable Weight
#...     Top 10 Carrier & Operations Staff by Number of Shipments
#...     Top 10 Carrier by Number of Shipments
#...     Top 10 Carrier & Operations Staff by Revenue
#...     Top 10 Carrier by Revenue
#...     Top 10 Carrier & Operations Staff by Expenses
#...     Top 10 Carrier by Expenses
#...     Top 10 Carrier & Operations Staff by Gross Profit
#...     Top 10 Carrier by Gross Profit

#@{Carrier-Reports-[SEA]-charts}
#...     Top 10 Carrier & Operations Staff by Chargeable Weight
#...     Top 10 Carrier by Chargeable Weight
#...     Top 10 Carrier & Operations Staff by Number of Shipments
#...     Top 10 Carrier by Number of Shipments
#...     Top 10 Carrier & Operations Staff by Revenue
#...     Top 10 Carrier by Revenue
#...     Top 10 Carrier & Operations Staff by Expenses
#...     Top 10 Carrier by Expenses
#...     Top 10 Carrier & Operations Staff by Gross Profit
#...     Top 10 Carrier by Gross Profit

@{Container-Util-charts}
...     Average Cost Per Container Space Used
...     Average Cost Per Container
...     Weight Shipped By Container Type
...     Volume Shipped By Container Type
...     Number Of Shipments Shipped By Container Type
#...     Container Summary       #Removed by team, experiment chart created by Rui

${search_this_shipment}     S00665399

*** Test Cases ***
#Verify page dashboard in Business Performance
#    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
#    ...       AND              Click    text="Business Performance"
#    FOR    ${sub_menu}    IN    @{business_performance}
#        Run Keyword And Continue On Failure    Check charts     ${sub_menu}
#    END

#Verify pages
#    [Documentation]     Crawl is too fast. As a result, screenshots would show that the page is still loading
#    ...                 Not great for checkig if page is able to load the charts
#    ...                 Can be useful in checking dead links
#    Log-in to expedock   passive     ${username}     ${password}
#    Crawl Site           https://passive-dashboard.expedock.com     max_number_of_page_to_crawl=100     max_depth_to_crawl=2

User clicks on Organization name from Explore > Explore Organization
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Organizations"
    Wait For Elements State    text="Org Name"  timeout=30s
    Click    text="Org Name"
    @{elements}=    Get Elements    xpath=//a[@rel="noreferrer"]
    Log Many    @{elements}
    Click   ${elements}[0]
    Switch Page    NEW
    Wait For Elements State    text="You’re viewing your relationship with this organization as your"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/organizations/   ignore_case=true

User clicks on See Payables from Explore > Explore Organization
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Organizations"
    Wait For Elements State    text="Org Name"  timeout=30s
    Click    text="Total Expenses w/o Tax"
    @{elements}=    Get Elements    xpath=//a[@rel="noreferrer"]
    Log Many    @{elements}
    Click   ${elements}[2]
    Switch Page    NEW
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/explore/payable-invoices?   ignore_case=true

User clicks on See Receivables from Explore > Explore Organization
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Organizations"
    Wait For Elements State    text="Org Name"  timeout=30s
    Click    text="Total Revenue w/o Tax"
    @{elements}=    Get Elements    xpath=//a[@rel="noreferrer"]
    Click   ${elements}[3]
    Switch Page    NEW
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/explore/receivable-invoices?   ignore_case=true

User clicks on Forwarder Reference from Explore > Explore Shipments
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Shipments"
    Wait For Elements State    text="Total Shipments:"  timeout=30s
    @{elements}=    Get Elements    xpath=//a[@rel="noopener noreferrer"]
    Click   ${elements}[0]
    Switch Page    NEW
    Wait For Elements State    text="Shipment Details"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/explore/shipment-details?   ignore_case=true

User clicks on Invoice Number from Explore > Payable Invoices
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Payable Invoices"
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    Wait For Elements State    text="Creditor"  timeout=30s
    @{elements}=    Get Elements    css=.css-p3mme2
    Click   ${elements}[0]
#    Switch Page    NEW
    Wait For Elements State    text="Invoice Details"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/invoice/posted/   ignore_case=true

User clicks on Job Number from Explore > Payable Invoices
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Payable Invoices"
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    Wait For Elements State    text="Creditor"  timeout=30s
    @{elements}=    Get Elements    xpath=//a[@rel="noopener noreferrer"]
    Click   ${elements}[0]
    Switch Page    NEW
    Wait For Elements State    text="Shipment Details"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/explore/shipment-details?   ignore_case=true

User clicks on Invoice Number from Explore > Receivable Invoices
    [Documentation]     Page opens in the same tab, as designed?
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Receivable Invoices"
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    Wait For Elements State    text="Debitor"  timeout=30s
    @{elements}=    Get Elements    css=.css-p3mme2
    Click   ${elements}[0]
    #Switch Page    NEW
    Wait For Elements State    text="Invoice Details"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/invoice/posted/   ignore_case=true

User clicks on Job Number from Explore > Receivable Invoices
    [Documentation]     Some job numbers are empty, as designed?
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Receivable Invoices"
    Wait For Elements State    text="Total Invoices:"  timeout=30s
    Wait For Elements State    text="Debitor"  timeout=30s
    @{elements}=    Get Elements    xpath=//a[@rel="noopener noreferrer"]
    Click   ${elements}[0]
    Switch Page    NEW
    Wait For Elements State    text="Shipment Details"  timeout=30s
    ${url}=     Get Url
    Should Contain    ${url}    dashboard.expedock.com/explore/shipment-details?   ignore_case=true
    Sleep    5s
    
User searches a shipment under Explore details
    [Documentation]     Verifies that user can view the shipment details after a search
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Shipment Details"
    Fill Text    //input[@data-testid="search-bar-field"]   ${search_this_shipment}
    Sleep   10s
    Click    text="FIND"
    Get Element States      h5 >> .css-1isyst2 >> text=${search_this_shipment}      then       bool(value & visible)
    Get Element States    h6 >> .css-s72vqw >> text="Shipment Details"      then       bool(value & visible)

User edits 'org type' and clicks on Org Name on Explore Organizations page
    [Documentation]     Verifies that org type is retained when user access the Org Main page
    [Template]      User edits org type and clicks on Org Name
        Shipper
        Consignee
        Local Client
        Debtor
        Creditor

User edits 'currency' and clicks on Org Name on Explore Organizations page
    [Documentation]     Verifies that org type is retained when user access the Org Main page
    [Template]      User edits '<field>>' and clicks on Org Name on Explore Organizations page
        CURRENCY    PHP
        CURRENCY    TJS

User edits 'weight' and clicks on Org Name on Explore Organizations page
    [Documentation]     Verifies that org type is retained when user access the Org Main page
    [Template]      User edits '<field>>' and clicks on Org Name on Explore Organizations page
        WEIGHT    MT
        WEIGHT    LB

User edits 'volume' and clicks on Org Name on Explore Organizations page
    [Documentation]     Verifies that org type is retained when user access the Org Main page
    [Template]      User edits '<field>>' and clicks on Org Name on Explore Organizations page
        VOLUME    MT
        VOLUME    LB

*** Keywords ***
User edits org type and clicks on Org Name
    [Arguments]     ${org_type}
    Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Organizations"
    Wait For Elements State    text="Org Name"  visible     timeout=1 min
    Click    xpath=//div[@title="ORG TYPE"]
    Keyboard key    press    Delete
    Keyboard Input    insertText    ${org_type}
    Keyboard Key    press    ArrowDown
    Keyboard Key    press    Enter
    Wait For Elements State    text="Org Name"  visible     timeout=1 min
    Click    text="Org Name"
    Click    tr >> .css-1mabvd7-cell >> a >> nth=0
    Switch Page    NEW
    Wait For Elements State    text="You’re viewing your relationship with this organization as your"
    Get Element States    .css-1a1ajbi >> text="${org_type}"     then       bool(value & visible)
    Close Browser

User edits '<field>>' and clicks on Org Name on Explore Organizations page
    [Arguments]     ${title}    ${currency}
    Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    Click    text="Explore Organizations"
    Wait For Elements State    text="Org Name"  visible     timeout=1 min
    Click    xpath=//div[@title="${title}"]
    Keyboard key    press    Delete
    Keyboard Input    insertText    ${currency}
    Sleep    2s
    Keyboard Key    press    ArrowDown
    Keyboard Key    press    Enter
    Wait For Elements State    text="Org Name"  visible     timeout=1 min
    Click    text="Org Name"
    Click    tr >> .css-1mabvd7-cell >> a >> nth=0
    Switch Page    NEW
    Wait For Elements State    text="You’re viewing your relationship with this organization as your"
    Get Element States    .css-kxu0dz >> //div[@title="CURRENCY"] >> //input[@value="${currency}"]     then       bool(value & visible)
    Close Browser


Check charts
        [Arguments]     ${sub_menu}
        Click on sub-menu           ${sub_menu}
        ${sub_menu}=    Replace String    ${sub_menu}    ${SPACE}   -
        ${chart_name}=  Set Variable    ${sub_menu}-charts
        Run keyword and continue on failure     Check dashboard loaded      @{${chart_name}}
        Check for 'No data' text on page    ${sub_menu}

Click on sub-menu
        [Arguments]     ${sub_menu}
        TRY
                Click    text="${sub_menu}"
        EXCEPT
                ${sub_menu}=    Convert To Upper Case    ${sub_menu}
                ${sub_menu}=    Replace String    ${sub_menu}    ${SPACE}   _
                Click    xpath=//li[@data-testid="sidebar-tab-${sub_menu}"]
        END

Check dashboard loaded
        [Arguments]     @{charts}
        FOR    ${chart}    IN    @{charts}
            #Focus    text="${chart}"
           Wait For Elements State    text="${chart}"   visible    timeout=1 min
        END




