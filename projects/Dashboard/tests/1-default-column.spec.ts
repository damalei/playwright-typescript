import { test, Page, expect } from '@playwright/test';

const GLOBALTIMEOUT = 60000
test.describe.configure({ mode: 'serial' });

const orgColumns: string[] = [
    'Organization',
    'Org Code',
    'Total Shipment Weight (KG)',
    'Total Shipment Volume (M³)',
    'Total Shipment TEUs',
    'Number of Shipments',
    'Unposted Expenses excl. Tax (USD)',
    'Total Expenses excl. Tax (USD)',
    'Total Expenses incl. Tax (USD)',
    'Unposted Revenue excl. Tax (USD)',
    'Total Revenue excl. Tax (USD)',
    'Total Revenue incl. Tax (USD)',
    'Profit excl. Tax (USD)',
    'Profit % excl. Tax',
    'Profit incl. Tax (USD)',
    'Profit % incl. Tax',
    'Latest AP Post Date',
    'Latest AR Post Date',
    'Latest Shipment Created Date (GMT+08:00)',
    'Shipments',
    'Payable Invoices',
    'Receivable Invoices'
  ]

const payColumns: string[] = [
    'Invoice Number',
    'Page Last Updated On (GMT+08:00)',
    'Data Last Retrieved On (GMT+08:00)',
    'Creditor Code',
    'Creditor',
    'Invoice Date',
    'Post Date',
    'Due Date',
    'Already Due',
    'Due Within',
    'Payment Status',
    'Date Fully Paid',
    'Paid on Time',
    'Invoice Amount excl. Tax (USD)',
    'Invoice Amount incl. Tax (USD)',
    'Outstanding Amount incl. Tax (USD)',
    'Is Posted',
    'Transaction Type',
    'AP Time to Bill (in days)',
    'AP Time to Pay (in days)',
    'Job Numbers',
    'Earliest Shipment Creation Date (GMT+08:00)',
    'Latest Shipment ETA (GMT+08:00)',
    'Earliest Shipment ETD (GMT+08:00)',
    'Database ID'
]

const rcvColumns: string[] = [
    'Invoice Number',
    'Page Last Updated On (GMT+08:00)',
    'Data Last Retrieved On (GMT+08:00)',
    'Debtor Code',
    'Debtor',
    'Invoice Date',
    'Post Date',
    'Due Date',
    'Already Due',
    'Due Within',
    'Payment Status',
    'Date Fully Paid',
    'Paid on Time',
    'Invoice Amount excl. Tax (USD)',
    'Invoice Amount incl. Tax (USD)',
    'Outstanding Amount incl. Tax (USD)',
    'Is Posted',
    'Transaction Type',
    'AR Time to Bill (in days)',
    'AR Time to Collect (in days)',
    'Job Numbers',
    'Earliest Shipment Creation Date (GMT+08:00)',
    'Latest Shipment ETA (GMT+08:00)',
    'Earliest Shipment ETD (GMT+08:00)',
    'Database ID'
]

const shipColumns: string[] = [
    'Forwarder Reference',
    'Page Last Updated On (GMT+08:00)',
    'Data Last Retrieved On (GMT+08:00)',
    'Date Shipment Created (GMT+08:00)',
    'House Bill',
    'Master Bill',
    'Consol Number',
    'Transport Mode',
    'Shipment Weight (KG)',
    'Shipment Volume (M³)',
    'Shipment TEUs',
    'Shipment Origin',
    'Shipment Destination',
    'Unposted Expenses excl. Tax (USD)',
    'Total Expenses excl. Tax (USD)', 
    'Total Expenses incl. Tax (USD)',
    'Unposted Revenue excl. Tax (USD)',
    'Total Revenue excl. Tax (USD)',
    'Total Revenue incl. Tax (USD)', 
    'Profit excl. Tax (USD)',
    'Profit % excl. Tax',
    'Profit incl. Tax (USD)', 
    'Profit % incl. Tax'
]
  

test.describe("Default Column check", () => {
  let page: Page;
  test.beforeAll(async({browser}) => {
    page = await browser.newPage();
    await page.goto('https://passive-dashboard.expedock.com/');
  })

    test('Explore > Organization', async () => {
        test.slow
        await page.getByTestId('menu-item-explore').locator('div').filter({ hasText: 'Explore' }).click()
        await page.getByRole('link', { name: 'Organizations' }).click()
        for (const column of orgColumns) {
            await expect.soft(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible()
        }
        })  


    test('Explore > Payable Invoices', async () => {
        test.slow
        await page.getByRole('link', { name: 'Payable Invoices', exact: true }).click()
        for (const column of payColumns) {
            await expect.soft(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible()
        }
        })

    test('Explore > Receivable Invoices', async () => {
        test.slow
        await page.getByRole('link', { name: 'Receivable Invoices', exact: true }).click()
        for (const column of rcvColumns) {
            await expect.soft(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible()
        }
        }) 
        
    test('Explore > Shipments', async () => {
        test.slow
        await page.getByRole('link', { name: 'Shipments', exact: true }).click()
        // await rcvColumns.forEach(async (column) => {
        //     await expect.soft(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
        //     });
        for (const column of shipColumns) {
            await expect.soft(page.getByRole('columnheader', { name: column, exact: true })).toBeVisible()
        }
    })  

    

})
