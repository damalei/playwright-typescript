import { test, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';

let loginPage;
let editFilterFields;
test.describe.configure({ mode: 'serial' });
test.describe('TS 44 - User edits filter fields on Explore Containers', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
    await editFilterFields.waitForExceptionManagement();
    await editFilterFields.gotoExploreContainersDashboard();
  });

  const filterFieldstoAdd = [
    'Page Last Updated On',
    'Last Leg Arrival Status',
    'Has Exceptions',
    'Chargeable weight',
    'Shipper Name',
  ];
  test('[44.1] User adds Filter Fields', async () => {
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

  test('[44.2] User saves added Filter Fields', async () => {
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreContainers();
    await editFilterFields.checkAddedFilterFieldsExplorePages();
  });

  test('[44.3] User removes added Filter Fields', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteFilterChipExplorePages();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.checkDeletedFilterChipsExplorePages();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreContainers();
    await editFilterFields.checkDeletedFilterChipsExplorePages();
  });

  test('[44.4] User saves added Filter value', async () => {
    await editFilterFields.addFilterValuesExplorePages();
    await editFilterFields.checkAddedFilterValuesExplorePages();
    await page.waitForLoadState('domcontentloaded');
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreContainers();
    await editFilterFields.checkAddedFilterValuesExplorePages();
  });

  test('[44.5] User removes added Filter value', async () => {
    await editFilterFields.deleteFilterValuesExplorePages();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExploreContainers();
    await editFilterFields.checkDeletedFilterValuesExplorePages();
  });

  test.afterAll('[44.X] | Reverting dashboard to original state', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteRemainingFilterChipExplorePages();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.checkDeleteRemainingFilterChipExplorePages();
  });
});
