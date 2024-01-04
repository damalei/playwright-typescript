*** Settings *** 
Library     RPA.FileSystem
Library    OperatingSystem
Library    RPA.Browser.Playwright
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
Test Teardown       Teardown

*** Variables ***
@{agent_reports}           
...                        Top 20 Sending Agents by Net Profit
...                        Top 20 Receiving Agents by Net Profit
...                        Top 20 Sending Agents by Revenue
...                        Top 20 Receiving Agents by Revenue
...                        Top 20 Sending Agents by Expenses
...                        Top 20 Receiving Agents by Expenses
...                        Top 20 Sending Agents by Total Volume
...                        Top 20 Receiving Agents by Total Volume
...                        Top 20 Sending Agents by Total Weight
...                        Top 20 Receiving Agents by Total Weight
...                        Top 20 Sending Agents by Number of Shipments
...                        Top 20 Receiving Agents by Number of Shipments
...                        Top 20 Sending Agents by TEUs
...                        Top 20 Receiving Agents by TEUs

@{consignee_reports}            
...                         Top 20 Consignees by Revenue
...                         Top 20 Consignees by Expenses
...                         Top 20 Consignees by Total Volume
...                         Top 20 Consignees by Total Weight
...                         Top 20 Consignees by Number of Shipments
...                         Top 20 Consignees by TEUs
...                         Top 20 Consignees by Margin (Net Profit)

@{staffing_reports}
...                        Top 20 Operations Staff By Net Profit
...                        Top 20 Operations Staff By Expenses
...                        Top 20 Operations Staff By Revenue
...                        Top 20 Operations Staff By Shipment Volume                 

*** Test Cases ***
#KCE REPORTS
Check data count of Top X charts on tabular view - Debtor Report
...    [Documentation]     scope of this ticket is custom dashboards only
    Log-in to expedock    passive    ${kce-username}   ${kce-password}
    Click    text="Sales"
    Click    text="Debtor Report"
    Get data count of top X chart    Top 20 Debtors by Revenue
    Get data count of top X chart    Top 20 Debtors by Number of Shipments
    # Get data count of top X chart    Top 20 Sending Agents by Net Profit
    # Get data count of top X chart    $topchart

Check data count of Top X charts on tabular view - Agent Report
    Log-in to expedock    passive    ${kce-username}   ${kce-password}
    Click    text="Business Performance"
    Click    text="Agent Report"
    FOR    ${agent_report}    IN    @{agent_reports}
         Get data count of top X chart    ${agent_report}
    END

KCE: Check data count of Top X charts on tabular view - Consignee Report
    Log-in to expedock    passive    ${kce-username}   ${kce-password}
    Click    text="Sales"
    Click    text="Consignee Report"
    FOR    ${consignee_report}    IN    @{consignee_reports}
         Get data count of top X chart    ${consignee_report}
    END

Check data count of Top X charts on tabular view - Staffing Report
    Log-in to expedock    passive    ${kce-username}   ${kce-password}
    Click    text="Business Performance"
    Click    text="Staffing Reports"
    FOR    ${staffing_report}    IN    @{staffing_reports}
         Get data count of top X chart    ${staffing_report}
    END

#CLEARFREIGHT REPORTS
Check data count of Top X charts on tabular view - Debtor Report
...    [Documentation]     scope of this ticket is custom dashboards only
    Log-in to expedock    passive    ${clear-username}   ${clear-password}
    Click    text="Sales"
    Click    text="Debtor Report"
    Get data count of top X chart    Top 20 Debtors by Revenue

Check data count of Top X charts on tabular view - Agent Report
    Log-in to expedock    passive    ${clear-username}   ${clear-password} 
    Click    text="Business Performance"
    Click    text="Agent Report"
    FOR    ${agent_report}    IN    @{agent_reports}
         Get data count of top X chart    ${agent_report}
    END

ClearFreight: Check data count of Top X charts on tabular view - Consignee Report
    [Tags]  rerun
    Log-in to expedock    passive    ${clear-username}   ${clear-password} 
    Click    text="Sales"
    Click    text="Consignee Report"
    FOR    ${consignee_report}    IN    @{consignee_reports}
         Get data count of top X chart    ${consignee_report}
    END

Check data count of Top X charts on tabular view - Staffing Report
    Log-in to expedock    passive    ${clear-username}   ${clear-password} 
    Click    text="Business Performance"
    Click    text="Staffing Reports"
    FOR    ${staffing_report}    IN    @{staffing_reports}
         Get data count of top X chart    ${staffing_report}
    END
    
#TRANSGLOBAL REPORTS
Transglobal: Check data count of Top X charts on tabular view - Staffing Report
    Log-in to expedock    passive    ${clear-username}   ${clear-password} 
    Click    text="Business Performance"
    Click    text="Staffing Reports"
    FOR    ${staffing_report}    IN    @{staffing_reports}
         Get data count of top X chart    ${staffing_report}
    END

*** Keywords ***

Get data count of top X chart
    [Arguments]    ${topchart}
    Wait For Elements State    //*[@data-testid="data-component-${topchart}"]     Visible       timeout=1min
    Click                  //*[@data-testid="data-component-${topchart}"] >> //*[@data-testid="table-view-btn"]
    ${text}=               Wait Until Keyword Succeeds    3 min     5 sec    RPA.Browser.Playwright.Get Text    //*[@data-testid="data-component-${topchart}"] >> //p[@class="MuiTablePagination-displayedRows css-1chpzqh"]
    Log To Console    ${text}
    Set Test Message        ${\n}${topchart} count is ${text}    append=yes
                 
