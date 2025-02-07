import { test, Page, expect } from '@playwright/test';
import { waitForAdvanceSnackBar, waitForFilterSectionToLoad, waitForSnackBar } from '../../utils';
import { SideMenu } from '../models/sideMenu';
import { DASHBOARD_TIMEOUT_IN_MS, DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { DashboardBuilder } from '../models/dashboardBuilder';
import { getFormattedDate } from '../../utils';

const dashboard2 =
  FREIGHT_BI_BASE_URL +
  '/dashboard-builder/c3f63950-8ce7-4529-b29d-31a92c6f7941'; //QA TEST Template (AP DASH DEMO)
const dashboard1 =
  FREIGHT_BI_BASE_URL +
  '/dashboard-builder/b0e04ce7-3c36-4e96-bd00-55fdf08eae5a';

test.describe('Edit and save filters fields on Dashboard Builder', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test('[10.1] User adds filter FIELDS from the basic view', async () => {
    const side = new SideMenu(page);
    const dashbuild = new DashboardBuilder(page);
    await side.userProfile.click();
    await side.dashboardBuilderOption.click();
    await dashbuild.loadDashboard('QA Test Template');
    await dashbuild.globalFilterSection.editBasicFiltersButton.click();
    await dashbuild.globalFilterSection.addFilterFieldButton.click();
    await dashbuild.globalFilterSection.clickFilterField(
      'Page Last Updated On'
    );
    await dashbuild.globalFilterSection.updateFilterField.click();
    await dashbuild.globalFilterSection.page.reload();
    await waitForFilterSectionToLoad(
      dashbuild.globalFilterSection.page,
      DASHBOARD_TIMEOUT_IN_MS
    );
    await expect
      .soft(page.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: 10000 });
  });

  test('[10.2] User saves filter fields from the basic', async () => {
    const dashbuild = new DashboardBuilder(page);
    await dashbuild.globalFilterSection.saveViewButton.click();
    await waitForSnackBar(dashbuild.page, 10000);
    await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2);
    await waitForFilterSectionToLoad(
      dashbuild.globalFilterSection.page,
      DASHBOARD_TIMEOUT_IN_MS
    );
    await expect
      .soft(page.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: 10000 });
  });

  test('[10.3] User removes filter fields from the basic', async () => {
    const dashbuild = new DashboardBuilder(page);
    await page.goto(dashboard2);
    await dashbuild.globalFilterSection.editBasicFiltersButton.click();
    await dashbuild.globalFilterSection.lastFilterFieldClear.click();
    await dashbuild.globalFilterSection.updateFilterField.click();
    await dashbuild.globalFilterSection.saveViewButton.click();
    await waitForSnackBar(dashbuild.page, 10000);
    await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2);
    await waitForFilterSectionToLoad(
      dashbuild.globalFilterSection.page,
      DASHBOARD_TIMEOUT_IN_MS
    );
    await expect
      .soft(page.locator('label', { hasText: 'Page Last Updated On' }))
      .not.toBeVisible({ timeout: 10000 });
  });
});

test.describe('Edit and save filters VALUES on Dashboard Builder', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test('[10.4] User saves a filter value from the basic and advance view', async () => {
    const dashbuild = new DashboardBuilder(page);
    await page.goto(dashboard2);
    await dashbuild.globalFilterSection.setBasicTextFilter(
      'Transport Mode',
      'SEA',
      'AIR'
    );
    await dashbuild.globalFilterSection.setBasicDateFilter(
      'Shipment ETD',
      'Today'
    );
    await dashbuild.globalFilterSection.advanceViewButton.click();
    await dashbuild.globalFilterSection.setAdvanceTextFilter(
      0,
      'Container Mode',
      'FCL'
    );
    await dashbuild.globalFilterSection.advanceUpdateFiltersButton.click();
    await dashbuild.globalFilterSection.saveViewButton.click();
    await waitForSnackBar(dashbuild.page, 10000);
    await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2);
    await dashbuild.globalFilterSection.advanceViewButton.click();
    const date = await getFormattedDate()
    const today_relative = await dashbuild.checkElement(page, page.locator('span', { hasText: 'Shipment ETD is Today' }))
    const today_date = await dashbuild.checkElement(page, page.locator('span', { hasText: `Shipment ETD is between ${date} and ${date}` }))
    await expect
      .soft(
        page.locator('span', {

          hasText: 'Transport Mode is SEA and 1 other filters',
        })
      )
      .toBeVisible();
    await expect.soft(today_relative || today_date).toBe(true)
    await expect
      .soft(page.locator('span', { hasText: 'Container Mode is FCL' }))
      .toBeVisible();
  });

  test('[10.5] User removes and saves a filter value from the basic and advance view', async () => {
    const dashbuild = new DashboardBuilder(page);
    await dashbuild.globalFilterSection.basicViewButton.click();
    await dashbuild.globalFilterSection.removeBasicDateFilter('Shipment ETD');
    await dashbuild.globalFilterSection.removeBasicTextFilter(
      'Transport Mode',
      2
    );
    await dashbuild.globalFilterSection.advanceViewButton.click();
    await dashbuild.globalFilterSection.removeAdvanceTextFilter(
      'Container Mode'
    );
    await dashbuild.globalFilterSection.saveViewButton.click();
    await waitForSnackBar(dashbuild.page, 10000);
    await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2);
    await dashbuild.globalFilterSection.advanceViewButton.click();
    await expect
      .soft(dashbuild.globalFilterSection.advanceEditFiltersButton)
      .toBeVisible();
    await expect
      .soft(
        page.locator('span', {
          hasText: 'Transport Mode is SEA and 1 other filters',
        })
      )
      .not.toBeVisible();
    await expect
      .soft(page.locator('span', { hasText: 'Shipment ETD is Today' }))
      .not.toBeVisible();
    await expect
      .soft(page.locator('span', { hasText: 'Container Mode is FCL' }))
      .not.toBeVisible();
  });
});
