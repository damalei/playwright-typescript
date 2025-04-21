import { test, expect, Page } from '@playwright/test';
import { reconDashboard } from '../models/reconDashboard.ts';
import { FREIGHT_BI_BASE_URL } from '../../constants.ts';

let page: Page;
let recon;

test.describe('[87] Edit reconciliation filter fields', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    recon = new reconDashboard(page);
  });

  test('[87.1] Client adds filter fields', async () => {
    await page.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await recon.buttonAddFilters.click();
    await recon.selectDropdownOption('Number of Reconciliation Attempt');
    await recon.buttonAddFilters.click();
    await recon.selectDropdownOption('Date Received');
    await recon.buttonAddFilters.click();
    await recon.selectDropdownOption('Invoice No.');
    await page.getByText('Reconciliation Results').click();
    const a = await recon.isCalendarSelectFieldAvailable('Date Received');
    const b = await recon.isMultiSelectFieldAvailable('Invoice No.');
    const c = await recon.isMultiSelectFieldAvailable(
      'Number of Reconciliation Attempt'
    );
    await expect.soft(a).toBe(true);
    await expect.soft(b).toBe(true);
    await expect.soft(c).toBe(true);
  });
});
