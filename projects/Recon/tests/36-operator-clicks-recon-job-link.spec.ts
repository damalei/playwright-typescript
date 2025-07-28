import { test, expect, Page } from '@playwright/test';
import { reconDashboard } from '../models/reconDashboard.ts';

let page: Page;
let recon;

test.describe('Recon Operator User Access', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    recon = new reconDashboard(page);
    await recon.loginToReconDashboard(
      `${process.env.RECON_OPERATOR_USER}`,
      `${process.env.RECON_OPERATOR_PASS}`
    );
  });

  test('[36.1] Operator clicks on the "Job Link" from the Recon Dashboard page', async () => {
    await recon.gotoReconDashboard();

    const tabs = [
      'To Do',
      'All',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Posted',
      'Reviewed',
      'Disputes',
    ];

    for (const tab of tabs) {
      if (tab !== 'To Do') {
        await recon.clickTab(page, tab);
      }

      await recon.clickJobLink();
      await recon.reconAppJobLink.click();
      const newPage = await page.context().waitForEvent('page');
      await newPage.waitForURL('https://app.expedock.com/**');
      await newPage.waitForLoadState('domcontentloaded');

      try {
        await newPage.waitForLoadState('networkidle', {
          timeout: 10000,
        });
      } catch (e) {}

      await newPage.waitForSelector('body', { state: 'visible' });
      await newPage
        .waitForSelector('img', { state: 'attached' })
        .catch(() => {});
      await expect(newPage.getByTestId('job-document-tab')).toBeVisible();
      await expect(
        newPage.getByRole('tabpanel', { name: 'Document' })
      ).toBeVisible();
      await newPage.close();
      await page.bringToFront();

      if (tab !== 'Disputes') {
        await recon.clickReconBreadcrumb();
      }
    }
    await page.close();
  });
});
