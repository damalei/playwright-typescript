import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;

test.describe('[80] Recon Dashboard User Access', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[80.1] Client clicks on "To-Do Dashboard" link from the side menu', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();
    await expect(
      page.getByRole('tab', { name: 'To Do', selected: true })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await recon.expectExportButtonVisible(page, 'To Do');

    const tabs = [
      'All',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Matched',
      'Done',
      'Disputes',
    ];
    for (const tab of tabs) {
      await recon.clickTab(page, tab);
      await recon.expectExportButtonVisible(page, tab);

      const commonElements = [
        ['combobox', 'External Assignee'],
        ['combobox', 'Branch'],
        ['button', 'Add a Filter'],
        ['textbox', 'Enter an invoice or reference'],
        ['heading', 'Invoice View'],
        ['heading', 'Shipment View'],
        ['button', 'Edit Column View'],
      ] as const;

      for (const [role, name] of commonElements) {
        await expect
          .soft(page.getByRole(role, { name }))
          .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
      }
    }
  });
});
