*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Library         RPA.Desktop
Library    RPA.RobotLogListener
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
Documentation     This Test Suite is for checking if tha data found under Explore > Explore Organizations table matches
...     with thw data found on the redirect page when users click 'See Shipments', 'See Payable Invoices' or 'See
...     Receivable Invoices'
...
...     As of 12/11/2023 m/d/y , the columns available in the explore org table are as follows
...     Org Name, Org Code, Total Weight, Total Volume, Total TEUs, Total Revenue w/o Tax, Total Revenu Tax Amount,
...     Total Revenue w/ Tax, Ttal Expenses w/o Tax, Total Expenses Tax Amount, Total Expenses w/ Tax, Total Margins,
...     Margin, Number of Shipments, Latest AP Post Datem Latest AR, Post Date, Latest Date Shipment Created, Shipments,
...     Payable Invoices, Receivable Invoices. Update steps if columns change
...
...     Note: 1.) Requires refactoring > Refactor verification step
...     2.) Unable to click on combo box, relying on using links where org types have been preset for now

*** Variables ***
${shipper_url}      https://passive-dashboard.expedock.com/explore/explore-organizations?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6&exploreTab=EXPLORE_SHIPMENTS&filters.shipment=eyJpZCI6ImJhYmI5YmFiLTAxMjMtNDQ1Ni1iODlhLWIxOGM1YTNiYjVkMyIsInR5cGUiOiJncm91cCIsImNoaWxkcmVuMSI6eyI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiOnsiaWQiOiI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiLCJ0eXBlIjoicnVsZSIsInByb3BlcnRpZXMiOnsiZmllbGQiOiJzaGlwbWVudC5kYXRlX3NoaXBtZW50X2NyZWF0ZWQiLCJ2YWx1ZVR5cGUiOlsiZGF0ZSJdLCJ2YWx1ZSI6W3sidmFsdWUiOiItMSIsInVuaXQiOiJZRUFSIn1dLCJ2YWx1ZVNyYyI6WyJ2YWx1ZSJdLCJvcGVyYXRvciI6ImdyZWF0ZXIiLCJmaWVsZFNyYyI6ImZpZWxkIn19fSwicHJvcGVydGllcyI6eyJjb25qdW5jdGlvbiI6IkFORCIsIm5vdCI6ZmFsc2V9fQ%3D%3D&unitSettings=eyJjdXJyZW5jeSI6IlVTRCIsImdyb3VwQnlEYXRlIjoiREFURV9TSElQTUVOVF9DUkVBVEVEIiwib3JnVHlwZSI6eyJ0eXBlIjoiT1JHX1RZUEUiLCJ0YXJnZXRVbml0IjoiU2hpcHBlciJ9LCJwZXJpb2RUeXBlIjoiTU9OVEhMWSIsInNoaXBtZW50Vm9sdW1lVW5pdCI6eyJ0YXJnZXRVbml0Ijoic2hpcG1lbnRzIiwidHlwZSI6IlNISVBNRU5UX0NPVU5UIn0sInZvbHVtZVVuaXQiOnsidGFyZ2V0VW5pdCI6Ik0zIiwidHlwZSI6IlZPTFVNRSJ9LCJ3ZWlnaHRVbml0Ijp7InRhcmdldFVuaXQiOiJLRyIsInR5cGUiOiJXRUlHSFQifX0%3D
${consignee_url}    https://passive-dashboard.expedock.com/explore/explore-organizations?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6&exploreTab=EXPLORE_SHIPMENTS&filters.shipment=eyJpZCI6ImJhYmI5YmFiLTAxMjMtNDQ1Ni1iODlhLWIxOGM1YTNiYjVkMyIsInR5cGUiOiJncm91cCIsImNoaWxkcmVuMSI6eyI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiOnsiaWQiOiI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiLCJ0eXBlIjoicnVsZSIsInByb3BlcnRpZXMiOnsiZmllbGQiOiJzaGlwbWVudC5kYXRlX3NoaXBtZW50X2NyZWF0ZWQiLCJ2YWx1ZVR5cGUiOlsiZGF0ZSJdLCJ2YWx1ZSI6W3sidmFsdWUiOiItMSIsInVuaXQiOiJZRUFSIn1dLCJ2YWx1ZVNyYyI6WyJ2YWx1ZSJdLCJvcGVyYXRvciI6ImdyZWF0ZXIiLCJmaWVsZFNyYyI6ImZpZWxkIn19fSwicHJvcGVydGllcyI6eyJjb25qdW5jdGlvbiI6IkFORCIsIm5vdCI6ZmFsc2V9fQ%3D%3D&unitSettings=eyJjdXJyZW5jeSI6IlVTRCIsImdyb3VwQnlEYXRlIjoiREFURV9TSElQTUVOVF9DUkVBVEVEIiwib3JnVHlwZSI6eyJ0eXBlIjoiT1JHX1RZUEUiLCJ0YXJnZXRVbml0IjoiQ29uc2lnbmVlIn0sInBlcmlvZFR5cGUiOiJNT05USExZIiwic2hpcG1lbnRWb2x1bWVVbml0Ijp7InRhcmdldFVuaXQiOiJzaGlwbWVudHMiLCJ0eXBlIjoiU0hJUE1FTlRfQ09VTlQifSwidm9sdW1lVW5pdCI6eyJ0YXJnZXRVbml0IjoiTTMiLCJ0eXBlIjoiVk9MVU1FIn0sIndlaWdodFVuaXQiOnsidGFyZ2V0VW5pdCI6IktHIiwidHlwZSI6IldFSUdIVCJ9fQ%3D%3D
${debtor_url}       https://passive-dashboard.expedock.com/explore/explore-organizations?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6&exploreTab=EXPLORE_SHIPMENTS&filters.shipment=eyJpZCI6ImJhYmI5YmFiLTAxMjMtNDQ1Ni1iODlhLWIxOGM1YTNiYjVkMyIsInR5cGUiOiJncm91cCIsImNoaWxkcmVuMSI6eyI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiOnsiaWQiOiI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiLCJ0eXBlIjoicnVsZSIsInByb3BlcnRpZXMiOnsiZmllbGQiOiJzaGlwbWVudC5kYXRlX3NoaXBtZW50X2NyZWF0ZWQiLCJ2YWx1ZVR5cGUiOlsiZGF0ZSJdLCJ2YWx1ZSI6W3sidmFsdWUiOiItMSIsInVuaXQiOiJZRUFSIn1dLCJ2YWx1ZVNyYyI6WyJ2YWx1ZSJdLCJvcGVyYXRvciI6ImdyZWF0ZXIiLCJmaWVsZFNyYyI6ImZpZWxkIn19fSwicHJvcGVydGllcyI6eyJjb25qdW5jdGlvbiI6IkFORCIsIm5vdCI6ZmFsc2V9fQ%3D%3D&unitSettings=eyJjdXJyZW5jeSI6IlVTRCIsImdyb3VwQnlEYXRlIjoiREFURV9TSElQTUVOVF9DUkVBVEVEIiwib3JnVHlwZSI6eyJ0eXBlIjoiT1JHX1RZUEUiLCJ0YXJnZXRVbml0IjoiRGVidG9yIn0sInBlcmlvZFR5cGUiOiJNT05USExZIiwic2hpcG1lbnRWb2x1bWVVbml0Ijp7InRhcmdldFVuaXQiOiJzaGlwbWVudHMiLCJ0eXBlIjoiU0hJUE1FTlRfQ09VTlQifSwidm9sdW1lVW5pdCI6eyJ0YXJnZXRVbml0IjoiTTMiLCJ0eXBlIjoiVk9MVU1FIn0sIndlaWdodFVuaXQiOnsidGFyZ2V0VW5pdCI6IktHIiwidHlwZSI6IldFSUdIVCJ9fQ%3D%3D
${creditor_url}     https://passive-dashboard.expedock.com/explore/explore-organizations?apiPartnerIds=dcbadbee-d78f-4337-89c9-3aa150cec6f6&exploreTab=EXPLORE_SHIPMENTS&filters.shipment=eyJpZCI6ImJhYmI5YmFiLTAxMjMtNDQ1Ni1iODlhLWIxOGM1YTNiYjVkMyIsInR5cGUiOiJncm91cCIsImNoaWxkcmVuMSI6eyI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiOnsiaWQiOiI4YThiODk5OS00NTY3LTQ4OWEtYmNkZS1mMThjNWEzYmI1ZDMiLCJ0eXBlIjoicnVsZSIsInByb3BlcnRpZXMiOnsiZmllbGQiOiJzaGlwbWVudC5kYXRlX3NoaXBtZW50X2NyZWF0ZWQiLCJ2YWx1ZVR5cGUiOlsiZGF0ZSJdLCJ2YWx1ZSI6W3sidmFsdWUiOiItMSIsInVuaXQiOiJZRUFSIn1dLCJ2YWx1ZVNyYyI6WyJ2YWx1ZSJdLCJvcGVyYXRvciI6ImdyZWF0ZXIiLCJmaWVsZFNyYyI6ImZpZWxkIn19fSwicHJvcGVydGllcyI6eyJjb25qdW5jdGlvbiI6IkFORCIsIm5vdCI6ZmFsc2V9fQ%3D%3D&unitSettings=eyJjdXJyZW5jeSI6IlVTRCIsImdyb3VwQnlEYXRlIjoiREFURV9TSElQTUVOVF9DUkVBVEVEIiwib3JnVHlwZSI6eyJ0eXBlIjoiT1JHX1RZUEUiLCJ0YXJnZXRVbml0IjoiQ3JlZGl0b3IifSwicGVyaW9kVHlwZSI6Ik1PTlRITFkiLCJzaGlwbWVudFZvbHVtZVVuaXQiOnsidGFyZ2V0VW5pdCI6InNoaXBtZW50cyIsInR5cGUiOiJTSElQTUVOVF9DT1VOVCJ9LCJ2b2x1bWVVbml0Ijp7InRhcmdldFVuaXQiOiJNMyIsInR5cGUiOiJWT0xVTUUifSwid2VpZ2h0VW5pdCI6eyJ0YXJnZXRVbml0IjoiS0ciLCJ0eXBlIjoiV0VJR0hUIn19

*** Test Cases ***
User checks data after clicking 'See Shipments' with Org Type > LOCAL CLIENT
    [Tags]  rerun
#    [Tags]    robot:exclude
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     RPA.Browser.Playwright.Click    text="Explore"
    ...     AND     Set Browser Timeout    1min
    ...     AND     RPA.Browser.Playwright.Click    text="Explore Organizations"
    Verify values between Explore organization and Explore Shipments

User checks data after clicking 'See Shipments' with Org Type > SHIPPER
#    [Tags]    robot:exclude
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${shipper_url}
    Verify values between Explore organization and Explore Shipments

User checks data after clicking 'See Shipments' with Org Type > CONSIGNEE
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${consignee_url}
    Verify values between Explore organization and Explore Shipments

User checks data after clicking 'See Shipments' with Org Type > DEBTOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To        ${debtor_url}
    Verify values between Explore organization and Explore Shipments

User checks data after clicking 'See Shipments' with Org Type > CREDITOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${creditor_url}
    Verify values between Explore organization and Explore Shipments

User checks data after clicking 'See Receivable' with Org Type > LOCAL CLIENT
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     RPA.Browser.Playwright.Click    text="Explore"
    ...     AND     Set Browser Timeout    1min
    ...     AND     RPA.Browser.Playwright.Click    text="Explore Organizations"
    Verify values between Explore Organization and Receivable Invoices

User checks data after clicking 'See Receivable' with Org Type > SHIPPER
    [Tags]  rerun
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${shipper_url}
    Verify values between Explore Organization and Receivable Invoices

User checks data after clicking 'See Receivable' with Org Type > CONSIGNEE
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${consignee_url}
    Verify values between Explore Organization and Receivable Invoices

User checks data after clicking 'See Receivable' with Org Type > DEBTOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${debtor_url}
    Verify values between Explore Organization and Receivable Invoices

User checks data after clicking 'See Receivable' with Org Type > CREDITOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${creditor_url}
    Verify values between Explore Organization and Receivable Invoices

User checks data after clicking 'See Payable' with Org Type > LOCAL CLIENT
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     RPA.Browser.Playwright.Click    text="Explore"
    ...     AND     Set Browser Timeout    1min
    ...     AND     RPA.Browser.Playwright.Click    text="Explore Organizations"
    Verify values between Explore Organization and Payable Invoices

User checks data after clicking 'See Payable' with Org Type > SHIPPER
    [Tags]  rerun
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${shipper_url}
    Verify values between Explore Organization and Payable Invoices

User checks data after clicking 'See Payable' with Org Type > CONSIGNEE
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${consignee_url}
    Verify values between Explore Organization and Payable Invoices

User checks data after clicking 'See Payable' with Org Type > DEBTOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${debtor_url}
    Verify values between Explore Organization and Payable Invoices

User checks data after clicking 'See Payable' with Org Type > CREDITOR
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Set Browser Timeout    1min
    ...     AND     Go To    ${creditor_url}
    Verify values between Explore Organization and Payable Invoices

*** Keywords ***
Verify values between Explore organization and Explore Shipments
    ${table}=       Set Variable    xpath=//table[@class="MuiTable-root MuiTable-stickyHeader css-1mkkbhk"]

    #Get max numbers of rows on display under Explore Org
    ${rows}=        Get Elements        xpath=//tr[@data-testid="explore-table-row"]
    ${max}=         Get length  ${rows}

    #Get row where Org Name is not N/A
    FOR    ${count}    IN RANGE   1     ${max}
        ${e}=       Get Table Cell Element    ${table}    0    ${count}
        ${text}=    Get Text    ${e}
        IF    "${text}" != "N/A"  BREAK
    END
    ${last}=            Get Table Cell Element      ${table}    -1    ${count}
    ${max_col}=         Get Table Cell Index        ${last}
    @{row_values}=      Create List

    #Get values in the row
    FOR    ${col_count}    IN RANGE    ${max_col}
        ${e}=       Get Table Cell Element    ${table}    ${col_count}    ${count}
        ${text}=    Get Text    ${e}
        Append To List      ${row_values}   ${text}
    END

    #Click on See Shipments
    ${see_ship}=    Get Table Cell Element    ${table}    17    ${count}
    RPA.Browser.Playwright.Click    ${see_ship}

    #Go to new tab
    Switch Page    NEW

    #Get values on the summary
    @{ship_vals}=       Create List
    ${summary_els}=    Get Elements    css=.css-pd02lq
    FOR    ${summary_el}    IN    @{summary_els}
        ${text}=    Get Text    ${summary_el}
        Append To List      ${ship_vals}   ${text}
    END

    #Removing the comma from Total shipments from the Explore Shipments page
    ${ship_val0_clean}=     Replace String  ${ship_vals}[0]     ,     ${EMPTY}

    #Assertions -- note this does not include 'margin' value because margin value is expected to not match
    Run Keyword And Continue On Failure     Assert string values    Total Shipments   ${row_values}[13]       ${ship_val0_clean}
    Run Keyword And Continue On Failure     Assert string values    Total Weight   ${row_values}[2]       ${ship_vals}[1]
    Run Keyword And Continue On Failure     Assert string values    Total Volume   ${row_values}[3]       ${ship_vals}[2]
    Run Keyword And Continue On Failure     Assert string values    Total TEUs      ${row_values}[4]       ${ship_vals}[3]
    Run Keyword And Continue On Failure     Assert string values    Total Expenses w/o Tax      ${row_values}[8]       ${ship_vals}[4]
    Run Keyword And Continue On Failure     Assert string values    Total Expenses Tax Amount   ${row_values}[9]       ${ship_vals}[5]
    Run Keyword And Continue On Failure     Assert string values    Total Expenses w/ Tax       ${row_values}[10]       ${ship_vals}[6]
    Run Keyword And Continue On Failure     Assert string values    Total Revenue w/o Tax       ${row_values}[5]       ${ship_vals}[7]
    Run Keyword And Continue On Failure     Assert string values    Total Revenue Tax Amount    ${row_values}[6]       ${ship_vals}[8]
    Run Keyword And Continue On Failure     Assert string values    Total Revenue w/ Tax        ${row_values}[7]       ${ship_vals}[9]
    Run Keyword And Continue On Failure     Assert string values    Total Margins               ${row_values}[11]       ${ship_vals}[10]

Verify values between Explore Organization and Receivable Invoices
    ${table}=       Set Variable    xpath=//table[@class="MuiTable-root MuiTable-stickyHeader css-1mkkbhk"]

    #Get max numbers of rows on display under Explore Org
    ${rows}=        Get Elements        xpath=//tr[@data-testid="explore-table-row"]
    ${max}=         Get length  ${rows}

    #Get row where Org Name is not N/A
    FOR    ${count}    IN RANGE   1     ${max}
        ${e}=       Get Table Cell Element    ${table}    0    ${count}
        ${text}=    Get Text    ${e}
        IF    "${text}" != "N/A"  BREAK
    END
    ${last}=            Get Table Cell Element      ${table}    -1    ${count}
    ${max_col}=         Get Table Cell Index        ${last}
    @{row_values}=      Create List

    #Get values in the row
    FOR    ${col_count}    IN RANGE    ${max_col}
        ${e}=       Get Table Cell Element    ${table}    ${col_count}    ${count}
        ${text}=    Get Text    ${e}
        Append To List      ${row_values}   ${text}
    END

    #Click on See Receivables
    ${see_ship}=    Get Table Cell Element    ${table}    19    ${count}   #changed here
    RPA.Browser.Playwright.Click    ${see_ship}

    #Go to new tab
    Switch Page    NEW

    #Get values on the summary
    @{ship_vals}=       Create List
    ${summary_els}=    Get Elements    css=.css-pd02lq
    FOR    ${summary_el}    IN    @{summary_els}
        ${text}=    Get Text    ${summary_el}
        Append To List      ${ship_vals}   ${text}
    END

    #Removing the comma from Total shipments from the Explore Shipments page
    ${ship_val0_clean}=     Replace String  ${ship_vals}[0]     ,     ${EMPTY}

    #Assertions -- note this does not include 'margin' value because margin value is expected to not match
    Run Keyword And Continue On Failure     Assert string values    Total Revenue w/o Tax       ${row_values}[5]       ${ship_vals}[2]       #changed here
    Run Keyword And Continue On Failure     Assert string values    Total Revenue Tax Amount    ${row_values}[6]       ${ship_vals}[4]       #changed here
    Run Keyword And Continue On Failure     Assert string values    Total Revenue w/ Tax        ${row_values}[7]       ${ship_vals}[6]       #changed here

Verify values between Explore Organization and Payable Invoices
    ${table}=       Set Variable    xpath=//table[@class="MuiTable-root MuiTable-stickyHeader css-1mkkbhk"]

    #Get max numbers of rows on display under Explore Org
    ${rows}=        Get Elements        xpath=//tr[@data-testid="explore-table-row"]
    ${max}=         Get length  ${rows}

    #Get row where Org Name is not N/A
    FOR    ${count}    IN RANGE   1     ${max}
        ${e}=       Get Table Cell Element    ${table}    0    ${count}
        ${text}=    Get Text    ${e}
        IF    "${text}" != "N/A"  BREAK
    END
    ${last}=            Get Table Cell Element      ${table}    -1    ${count}
    ${max_col}=         Get Table Cell Index        ${last}
    @{row_values}=      Create List

    #Get values in the row
    FOR    ${col_count}    IN RANGE    ${max_col}
        ${e}=       Get Table Cell Element    ${table}    ${col_count}    ${count}
        ${text}=    Get Text    ${e}
        Append To List      ${row_values}   ${text}
    END

    #Click on See Receivables
    ${see_ship}=    Get Table Cell Element    ${table}    18    ${count}   #changed here
    RPA.Browser.Playwright.Click    ${see_ship}

    #Go to new tab
    Switch Page    NEW

    #Get values on the summary
    @{ship_vals}=       Create List
    ${summary_els}=    Get Elements    css=.css-pd02lq
    FOR    ${summary_el}    IN    @{summary_els}
        ${text}=    Get Text    ${summary_el}
        Append To List      ${ship_vals}   ${text}
    END

    #Removing the comma from Total shipments from the Explore Shipments page
    ${ship_val0_clean}=     Replace String  ${ship_vals}[0]     ,     ${EMPTY}

    #Assertions -- note this does not include 'margin' value because margin value is expected to not match
    Run Keyword And Continue On Failure     Assert string values    Total Expenses w/o Tax          ${row_values}[8]       ${ship_vals}[2]       #changed here
    Run Keyword And Continue On Failure     Assert string values    Total Expenses Tax Amount       ${row_values}[9]       ${ship_vals}[4]       #changed here
    Run Keyword And Continue On Failure     Assert string values    Total Expenses w/ Tax           ${row_values}[10]       ${ship_vals}[6]       #changed here

Assert string values
    [Arguments]      ${column_name}     ${value_1}     ${value_2}
    IF  '${value_1}' == 'N/A' or '${value_1}' == '0.00 USD'
        Zero check   ${column_name}     ${value_1}   ${value_2}
    ELSE
        Value check      ${column_name}     ${value_1}   ${value_2}
    END

Zero check
    [Arguments]      ${column_name}     ${value_1}   ${value_2}
    ${zero_check}=  Run Keyword And Return Status    Should Be Equal As Strings    0.00 USD    ${value_2}
    ${zero_check2}=  Run Keyword And Return Status    Should Be Equal As Strings    N/A    ${value_2}

    IF    ${zero_check} == ${True} or ${zero_check2} == ${True}
        Set Test Message    ${column_name} match explore org page: ${value_1} | see shipments page: ${value_2} ${\n}    append=True
    ELSE
         Fail      MISMATCH! ${column_name} explore org page: ${value_1} | see shipments page: ${value_2}   append=True
    END

Value check
    [Arguments]     ${column_name}     ${value_1}   ${value_2}
    ${status}=      Run Keyword and Return Status    Should Be Equal As Strings    ${value_1}    ${value_2}
    IF    ${status} == ${True}
        Set Test Message    ${column_name} match explore org page: ${value_1} | see shipments page: ${value_2} ${\n}    append=True
    ELSE
        Fail      MISMATCH! ${column_name} explore org page: ${value_1} | see shipments page: ${value_2}   append=True
    END

