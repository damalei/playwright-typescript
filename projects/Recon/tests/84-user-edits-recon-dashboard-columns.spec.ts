import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;

test.describe('[84] User edits the reconciliation table columns', () => {
  const columns = ['Okay to Post', 'Times Shown To Customer'];
  const tabs = [
    'All',
    'To Do',
    'No Shipment Found',
    'For Expedock',
    'For Other Users',
    'Posted',
    'Reviewed',
    'Disputes',
  ];

  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page = await context.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[84.1] User adds columns to the reconciliation table', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();
    await recon.waitForTableToLoad(page);
    await expect(
      page.getByRole('tab', { name: 'To Do', selected: true })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await recon.expectExportButtonVisible(page, 'To Do');

    await recon.buttonEditColumnView.click();

    for (const columnName of columns) {
      await recon.toggleColumnVisibility(columnName, true);
    }

    await recon.reconciliationResultsHeading.click();
    await expect(
      page.getByRole('heading', { name: 'Successfully saved column' })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await page.reload();
    await recon.waitForTableToLoad(page);

    for (const columnName of columns) {
      const columnHeader = await recon.getColumnHeader(columnName);
      await columnHeader.scrollIntoViewIfNeeded();
      await expect(columnHeader).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    }

    for (const tab of tabs) {
      await recon.clickTab(page, tab);
      await recon.waitForTableToLoad(page);
      await recon.expectExportButtonVisible(page, tab);

      for (const columnName of columns) {
        const columnHeader = await recon.getColumnHeader(columnName);
        await columnHeader.scrollIntoViewIfNeeded();
        await expect(columnHeader).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
      }
    }
  });

  test('[84.2] User removes columns from the reconciliation table', async () => {
    await recon.buttonEditColumnView.click();
    for (const columnName of columns) {
      await recon.toggleColumnVisibility(columnName, false);
    }

    await recon.reconciliationResultsHeading.click();
    await expect(
      page.getByRole('heading', { name: 'Successfully saved column' })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await page.reload();
    await recon.waitForTableToLoad(page);

    for (const tab of tabs) {
      await recon.clickTab(page, tab);
      await recon.waitForTableToLoad(page);
      await recon.expectExportButtonVisible(page, tab);

      for (const columnName of columns) {
        const columnHeader = await recon.getColumnHeader(columnName);
        await expect(columnHeader).not.toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
      }
    }
  });
});
