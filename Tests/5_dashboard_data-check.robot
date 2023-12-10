*** Settings ***
Library         RPA.FileSystem
Library         OperatingSystem
Library         RPA.Browser.Playwright
Library         String
Library         Collections
Resource    ../Resources/credentials.resource
Resource    ../Resources/config.resource
Resource    ../Resources/utils.resource
Documentation     As of 12/11/2023 m/d/y , the columns available in the explore org table are as follows
...     Org Name, Org Code, Total Weight, Total Volume, Total TEUs, Total Revenue w/o Tax, Total Revenu Tax Amount,
...     Total Revenue w/ Tax, Ttal Expenses w/o Tax, Total Expenses Tax Amount, Total Expenses w/ Tax, Total Margins,
...     Margin, Number of Shipments, Latest AP Post Datem Latest AR, Post Date, Latest Date Shipment Created, Shipments,
...     Payable Invoices, Receivable Invoices

*** Test Cases ***
User checks local client data when clicking 'See Shipments'
#    [Tags]    robot:exclude
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    ...     AND     Set Browser Timeout    1min
    ...     AND     Click    text="Explore Organizations"
    Verify values between Explore organization and Explore Shipments

User checks shipper data when clicking 'See Shipments'
    [Tags]    robot:exclude
    [Setup]   Run Keywords     Log-in to expedock   passive     ${username}     ${password}
    ...     AND     Click    text="Explore"
    ...     AND     Set Browser Timeout    1min
    ...     AND     Click    text="Explore Organizations"
    Click       xpath=//input[@value="Local Client"]
    ${option}       Get Element
    Get element by role
    #Click       xpath=//input[@id="mui-102-option-0"]
    Sleep    10s
#    Verify values between Explore organization and Explore Shipments
    



*** Keywords ***
Verify values between Explore organization and Explore Shipments
    ${table}=       Set Variable    xpath=//table[@class="MuiTable-root MuiTable-stickyHeader css-1mkkbhk"]

    #Get max numbers of rows on display
    ${rows}=    Get Elements    css=.css-195uojy-rowCell
    ${max}=      Get length  ${rows}

    #Get row where Org Name is not N/A
    FOR    ${count}    IN RANGE   1     ${max}
        ${e}=       Get Table Cell Element    ${table}    0    ${count}
        ${text}=    Get Text    ${e}
        IF    "${text}" != "N/A"  BREAK
    END
    ${last}=    Get Table Cell Element    ${table}    -1    ${count}
    ${max_col}=      Get Table Cell Index    ${last}
    @{row_values}=      Create List

    #Get values in the row
    FOR    ${col_count}    IN RANGE    ${max_col}
        ${e}=       Get Table Cell Element    ${table}    ${col_count}    ${count}
        ${text}=    Get Text    ${e}
        Append To List      ${row_values}   ${text}
    END

    #Click on See Shipments
    ${see_ship}=    Get Table Cell Element    ${table}    17    ${count}
    Click    ${see_ship}

    #Go to new tab
    Switch Page    NEW

    #Get values on the summary
    @{ship_vals}=       Create List
    ${summary_els}=    Get Elements    css=.css-pd02lq
    FOR    ${summary_el}    IN    @{summary_els}
        ${text}=    Get Text    ${summary_el}
        Append To List      ${ship_vals}   ${text}
    END

    #Assertions -- note this does not include 'margin' value
    Run Keyword And Continue On Failure     Assert string values    Total Shipments   ${row_values}[13]       ${ship_vals}[0]
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

Assert string values
    [Arguments]      ${column_name}     ${value_1}     ${value_2}
    ${status}=      Run Keyword and Return Status    Should Be Equal As Strings    ${value_1}    ${value_2}
    IF    ${status} == ${True}
        Set Test Message    ${column_name} match${\n}    append=True
   ELSE
        Fail    ${column_name}  explore org page: ${value_1} | see shipments page: ${value_2}
   END


    