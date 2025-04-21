import { test, expect, Page } from '@playwright/test';
import { reconDashboard } from '../models/reconDashboard.ts';
import { FREIGHT_BI_BASE_URL } from '../../constants.ts';
import { getFormattedDateWithHyphens } from '../../utils.ts';

let page: Page;
let recon;
let date: string;

test.describe.serial('[87] Edit reconciliation filter fields', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    recon = new reconDashboard(page);
    await page.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    date = getFormattedDateWithHyphens();
  });

  test('[87.1] Client adds filter fields on the reconciliation table', async () => {
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

  test('[87.2] User adds field values on the reconciliation table', async () => {
    await recon.selectMultiSelectFilter('Invoice No.');
    await recon.selectDropdownMultiSelectFilterByIndex(2);
    await recon.selectDropdownMultiSelectFilterByIndex(1);
    await recon.toolTipButtonApplyFilter.click();
    await recon.selectMultiSelectFilter('Number of Reconciliation Attempt');
    await recon.selectUnitFilter('Amount', '1');
    await recon.toolTipButtonApplyFilter.click();
    await recon.selectCalendarFilter('Date Received');
    await recon.selectFromCalendarFilterRelativeDate('Today');
    const a = await recon.isFilterChipVisible(
      `Date Received is ${date} to ${date}`
    );
    const b = await recon.isFilterChipVisible('Invoice No. has 2 selections');
    const c = await recon.isFilterChipVisible(
      'Number of Reconciliation Attempt is 1'
    );
    await expect.soft(a).toBe(true);
    await expect.soft(b).toBe(true);
    await expect.soft(c).toBe(true);
  });

  test('[87.3] User removes field values on the reconciliation table', async () => {
    const count = await page.getByRole('button', { name: 'X' }).count();
    for (let i = 0; i < count; i++) {
      await page.getByRole('button', { name: 'X' }).nth(0).click();
    }
    const a = await recon.isFilterChipVisible(
      `Date Received is ${date} to ${date}`
    );
    const b = await recon.isFilterChipVisible('Invoice No. has 2 selections');
    const c = await recon.isFilterChipVisible(
      'Number of Reconciliation Attempt is 1'
    );
    await expect.soft(a).toBe(false);
    await expect.soft(b).toBe(false);
    await expect.soft(c).toBe(false);
  });
});
