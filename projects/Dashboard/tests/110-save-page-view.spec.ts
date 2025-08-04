import { test, Page, expect } from '@playwright/test';
import { logInAuth } from '../../utils';
import { FREIGHT_BI_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { GlobalFilterSection } from '../models/globalFilterSection';
import { SideMenu } from '../models/sideMenu';
import { Overview } from '../models/overview';

test.describe.parallel('User saves a page view', () => {
  let page: Page;
  let globalFilterSection;
  let sideMenu;
  let overview;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT2_USER}`,
      `${process.env.FREIGHT_BI_CLIENT2_PASS}`
    );
    globalFilterSection = new GlobalFilterSection(page);
    sideMenu = new SideMenu(page);
    overview = new Overview(page);
  });

  test.skip('[110.1] User saves a page view from a hardcoded dashboard', async () => {
    await page.goto(FREIGHT_BI_BASE_URL + '/business-performance/overview');
    await globalFilterSection.sectionFilters.waitFor({ state: 'visible' });
    await overview.chartRevenueLastMonth.waitFor({
      state: 'visible',
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await globalFilterSection.setBasicTextFilter(
      'Transport Mode',
      'SEA',
      'AIR'
    );
    await globalFilterSection.setPeriodFieldType('Daily');
    await globalFilterSection.saveViewButton.click();
    await globalFilterSection.radioSaveAsNewView.click();
    const dashName = `TS-110.1-${Date.now()}`;
    await globalFilterSection.modalInputViewName.fill(dashName);
    await globalFilterSection.buttonSaveModal.click();
    await sideMenu.accSavedViews.click();
    await page.locator('li').getByLabel(dashName).click();
    await globalFilterSection.sectionFilters.waitFor({ state: 'visible' });
    const seaChip = await globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'SEA'
    );
    const airChip = await globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'AIR'
    );
    await expect
      .soft(overview.chartRevenueLastMonth)
      .toBeVisible({ timeout: 10_000 });
    await expect.soft(seaChip).toBe(true);
    await expect.soft(airChip).toBe(true);
    await expect
      .soft(page.locator('input[role="combobox"][value="Daily"]'))
      .toBeVisible();
  });
});
