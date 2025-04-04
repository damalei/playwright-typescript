import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;
let newPage: Page;

test.describe('[35] User access the Recon Dashboard page tabs', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[35.1] Client clicks on the Recon Dashboard page tabs', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();

    const tabs = [
      'To Do',
      'All',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Matched',
      'Done',
      'Disputes',
    ];

    for (const tab of tabs) {
      if (tab !== 'To Do') {
        await recon.clickTab(page, tab);
      }
      await recon.clickJobLink();
      await expect
        .soft(page.getByTestId('recon-extracted-data-section'))
        .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
      await expect(
        page.getByRole('heading', { name: 'Reconciliation Summary' })
      ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

      await expect.soft(recon.reconViewDocumentsTab).toBeVisible();
      await expect
        .soft(page.locator('.react-transform-element > .MuiBox-root'))
        .toBeVisible();

      await recon.clickReconViewAccrualTab();
      await expect.soft(page.getByTestId('accrual-tab-panel')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });

      await recon.clickReconViewNotesTab();
      await expect.soft(page.getByTestId('notes-form')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
      await expect.soft(page.getByTestId('notes-tab-panel')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
      await page.goBack();
    }

    await page.close();
  });

  test('[35.2] Operator clicks on the Recon Dashboard page tabs', async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    recon = new reconDashboard(page);
    await recon.loginToReconDashboard(
      `${process.env.RECON_OPERATOR_USER}`,
      `${process.env.RECON_OPERATOR_PASS}`
    );
    await expect(page.getByTestId('account-user-name')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await recon.gotoReconDashboard();
    const tabs = [
      'To Do',
      'All',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Matched',
      'Done',
      'Disputes',
    ];

    for (const tab of tabs) {
      if (tab !== 'To Do') {
        await recon.clickTab(page, tab);
      }
      await recon.clickJobLink();
      await expect
        .soft(page.getByTestId('recon-extracted-data-section'))
        .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
      await expect
        .soft(page.getByRole('heading', { name: 'Reconciliation Summary' }))
        .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

      await expect.soft(recon.reconViewDocumentsTab).toBeVisible();
      await expect
        .soft(page.locator('.react-transform-element > .MuiBox-root'))
        .toBeVisible();

      await recon.clickReconViewAccrualTab();
      await expect.soft(page.getByTestId('accrual-tab-panel')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });

      await recon.clickReconViewNotesTab();
      await expect.soft(page.getByTestId('notes-form')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
      await expect.soft(page.getByTestId('notes-tab-panel')).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
      await page.goBack();
    }

    await page.close();
  });
});
