import { test, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';

let loginPage;
let editFilterFields;
test.describe.configure({ mode: 'serial' });
test.describe('TS 12 - User edits filter fields on Exceptions Management', () => {
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
        await editFilterFields.checkAddedFilterFieldsExceptionManagement();
      }
    }
  });

  test('[12.2] User saves added Filter Fields', async () => {
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkAddedFilterFieldsExceptionManagement();
  });

  test('[12.3] User removes added Filter Fields', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteFilterChipExceptionManagement();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.checkDeletedFilterChipsExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkDeletedFilterChipsExceptionManagement();
  });

  test('[12.4] User saves added Filter value', async () => {
    await editFilterFields.addFilterValuesExceptionManagement();
    await editFilterFields.checkAddedFilterValuesExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkAddedFilterValuesExceptionManagement();
  });

  test('[12.5] User removes added Filter value', async () => {
    await editFilterFields.deleteFilterValuesExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkDeletedFilterValuesExceptionManagement();
  });

  test.afterAll('[12.X] | Reverting dashboard to original state', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteRemainingFilterChipExceptionManagement();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.checkDeleteRemainingFilterChipExceptionManagement();

    await page.close();
  });
});
