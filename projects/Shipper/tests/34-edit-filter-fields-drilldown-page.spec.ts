import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants.ts';

let loginPage;
let editFilterFields;

test.describe('TS 34 - User edits filter fields on Drilldown Page', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await editFilterFields.loginToShipperDrilldown();
  });

  const filterFieldstoAdd = [
    'Page Last Updated On',
    'Last Leg Arrival Status',
    'Has Exceptions',
    'Chargeable weight',
    'Shipper Name',
  ];
  test('[34.1] User adds Filter Fields', async () => {
    await editFilterFields.waitForExceptionManagement();
    await editFilterFields.drilldownFailedToDepartOrArrive();

    for (const filterFields of filterFieldstoAdd) {
      if (filterFields === 'Page Last Updated On') {
        await editFilterFields.editFilterFields();
      }
      await editFilterFields.addFilterFields();
      await editFilterFields.searchFilterFields(filterFields);

      if (filterFields === 'Shipper Name') {
        await editFilterFields.updateFiltersFields();
        await editFilterFields.checkAddedFilterFieldsExplorePages();
      }
    }
  });
  test('[34.2] User saves added Filter Fields', async () => {
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreShipments();
    await editFilterFields.checkAddedFilterFieldsExplorePages();
  });

  test('[34.3] User removes Filter Fields', async () => {
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.drilldownFailedToDepartOrArrive();
    await editFilterFields.editFilterFields();
    await editFilterFields.removeFilterFieldsDrilldown();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreShipments();
    await editFilterFields.checkRemovedFilterFieldsDrilldown();
  });

  test('[34.4] User add  Filter values', async () => {
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.drilldownFailedToDepartOrArrive();
    await editFilterFields.addFilterValueDrilldown();
  });

  test('[34.5] User remove  Filter values', async () => {
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.drilldownFailedToDepartOrArrive();
    await editFilterFields.hasTrueValueLocator.click();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreShipments();
    await expect(page.getByRole('button', { name: 'True' })).not.toBeVisible();
  });
});
