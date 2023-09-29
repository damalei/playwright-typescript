*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource

*** Variables ***
@{business_performance}
...                     Overview
...                     Account Overview
...                     Branch Overview
...                     Department Overview
...                     Most Profitable Routes
...                     Top Expenses
...                     Shipment Reports
...                     Agent Report
...                     Staffing Report
...                     Carrier Reports [AIR]
...                     Carrier Reports [SEA]
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

@{Account-Overview-charts}
...                     Margin (Net Profit) By Account
...                     Margin Percent By Account
...                     Revenue By Account
...                     Expenses By Account

*** Test Cases ***
Verify page dashboard in Business Performance
    Log-in to expedock   passive     ${username}     ${password}
    Click    text="Business Performance"
    FOR    ${sub_menu}    IN    @{business_performance}
        Click on sub-menu           ${sub_menu}
        ${sub_menu}=    Replace String    ${sub_menu}    ${SPACE}   -
        ${chart_name}=  Set Variable    ${sub_menu}-charts
        Log    ${chart_name}
        Check dashboard loaded      @{${chart_name}}
    END

####### START OF NOTES #######
# Crawl is too fast. As a result, screenshots would show that the page is still loading
# Not great for checkig if page is able to load the charts
####### END OF NOTES #######
Verify pages
    Log-in to expedock   passive     ${username}     ${password}
    Crawl Site           https://passive-dashboard.expedock.com     max_number_of_page_to_crawl=100     max_depth_to_crawl=2

*** Keywords ***
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
           Wait For Elements State    text="${chart}"   visible    timeout=1 min
        END
