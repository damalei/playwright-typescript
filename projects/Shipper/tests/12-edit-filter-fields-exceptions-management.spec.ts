import { test, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';

let loginPage;
let editFilterFields;

test.describe('User edits filter fields on Exceptions Management', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
  });

  const filterFieldstoAdd = [
    'Shipment Weight',
    'Has Exceptions',
    'Page Last Updated On',
    'Shipper Name',
  ];
  test('[12.1] User adds Filter Fields', async () => {
    await editFilterFields.waitForExceptionManagement();
    for (const filterFields of filterFieldstoAdd) {
      if (filterFields === 'Shipment Weight') {
        await editFilterFields.editFilterFields();
      }
      await editFilterFields.addFilterFields();
      await editFilterFields.searchFilterFields(filterFields);

      if (filterFields === 'Shipper Name') {
        await editFilterFields.updateFiltersFields();
        await editFilterFields.checkAddedFilterFields();
      }
    }
  });

  test('[12.2] User saves added Filter Fields', async () => {
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardtoCheck();
    await editFilterFields.checkAddedFilterFields();
  });

  test('[12.3] User removes added Filter Fields', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteFilterChip();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.checkDeletedFilterChips();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardtoCheck();
    await editFilterFields.checkDeletedFilterChips();
  });

  test('[12.4] User saves added Filter value', async () => {
    await editFilterFields.addFilterValues();
    await editFilterFields.checkAddedFilterValues();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardtoCheck();
    await editFilterFields.checkAddedFilterValues();
  });

  test('[12.5] User removes added Filter value', async () => {
    await editFilterFields.deleteFilterValues();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardtoCheck();
    await editFilterFields.checkDeletedFilterValues();
  });

  test.afterAll('[12.X] | Reverting dashboard to original state', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteRemainingFilterChip();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.checkDeleteRemainingFilterChip();
  });
});
