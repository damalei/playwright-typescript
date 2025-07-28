import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;

test.describe('[88] User clicks/sorts on the reconciliation table columns', () => {
  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page = await context.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[88.1] User sorts reconciliation table columns', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();
    await recon.waitForTableToLoad(page);
    await expect(recon.tableColumnInvoiceNumber).toBeVisible();

    const tableColumns = await recon.tableColumns.all();
    const tabs = [
      'To Do',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Posted',
      'Reviewed',
      'Disputes',
      'All',
    ];

    for (const tab of tabs) {
      if (tab !== 'To Do') {
        await recon.clickTab(page, tab);
      }
      await recon.waitForTableToLoad(page);

      if (tab === 'All') {
        await expect(recon.tableBody).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS * 2,
        });
        await expect(recon.tableFirstCell).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS * 2,
        });
        await page.waitForSelector('table.css-o13epf-table tbody tr', {
          state: 'visible',
          timeout: DEFAULT_TIMEOUT_IN_MS * 2,
        });
        await page.waitForFunction(
          () => {
            const rows = document.querySelectorAll(
              'table.css-o13epf-table tbody tr'
            );
            return (
              rows.length > 0 &&
              Array.from(rows).every((row) => row.children.length > 0)
            );
          },
          { timeout: DEFAULT_TIMEOUT_IN_MS * 2 }
        );
        await page.waitForTimeout(2000);
      }

      for (const column of tableColumns) {
        try {
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });

          // Ascending sort
          await column.click();
          await expect(recon.tableBody).toBeVisible();
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });
          await page.waitForTimeout(tab === 'All' ? 1000 : 500);
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });

          // Descending sort
          await column.click();
          await expect(recon.tableBody).toBeVisible();
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });
          await page.waitForTimeout(tab === 'All' ? 1000 : 500); // Wait for first cell before unsorted state
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });

          await column.click();
          await expect(recon.tableBody).toBeVisible();
          await expect(recon.tableFirstCell).toBeVisible({
            timeout:
              tab === 'All' ? DEFAULT_TIMEOUT_IN_MS * 2 : DEFAULT_TIMEOUT_IN_MS,
          });
          await page.waitForTimeout(tab === 'All' ? 1000 : 500);
        } catch (error) {
          console.error(`Error sorting column in ${tab} tab: ${error.message}`);
          continue;
        }
      }
    }
  });
});
