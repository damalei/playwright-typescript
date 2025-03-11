import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login';
import { EditFilterFields } from '../models/editFilterFields';
import { AccountControl } from '../models/accountControl';
import { areListsEqual } from '../../utils';

let loginPage: LoginPage;
let newHeaderList: string[];
let page: Page;
let editFilterFields;
let accountControl;

test.describe('Load Dashboard Filter Settings', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    accountControl = new AccountControl(page);
    await loginPage.goto();
    await accountControl.accountControlLoginToShipper();
    await editFilterFields.waitForExceptionManagement();
    await editFilterFields.gotoExploreShipmentsDashboard();
  });

  const filterFieldstoAdd = [
    'Page Last Updated On',
    'Last Leg Arrival Status',
    'Has Exceptions',
    'Chargeable weight',
    'Shipper Name',
  ];
  test('22.3 - User edits dashboard and refreshes the page', async () => {
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
    await page.reload();
    await expect(page).toHaveURL(/.*shipments/);
    await editFilterFields.checkAddedFilterFieldsExplorePages();
    await editFilterFields.addFilterValuesExplorePages();
    await editFilterFields.checkAddedFilterValuesExplorePages();
    await editFilterFields.waitForShipmentsReferenceComponent();
    await editFilterFields.checkAddedFilterValuesExplorePages();
    await editFilterFields.shipmentsForwarderReferenceSort.click();

    const expectedHeaderList = await editFilterFields.swapColumns(page, 1, 2);
    newHeaderList = await editFilterFields.dragSourceToTargetColumn(page, 1, 2);
    const listState = await areListsEqual(expectedHeaderList, newHeaderList);
    await expect.soft(listState).toBe(true);

    await page.reload();
    await expect(page).toHaveURL(/.*shipments/);
    await expect.soft(listState).toBe(true);
    await editFilterFields.waitForShipmentsReferenceComponent();
    await editFilterFields.checkAddedFilterValuesExplorePages();
    await editFilterFields.checkAddedFilterFieldsExplorePages();
  });

  test('22.5 - New user updates the filter fields on a page', async () => {
    await loginPage.goto();
    await accountControl.loginToShipperNewUser();
    await editFilterFields.waitForExceptionManagement();

    const filterFieldstoAdd = [
      'Shipment Weight',
      'Has Exceptions',
      'Page Last Updated On',
      'Shipper Name',
    ];
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

  test('Exception Management- New User saves added Filter Fields', async () => {
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkAddedFilterFieldsExceptionManagement();
  });

  test('Exception Management-New User removes added Filter Fields', async () => {
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteFilterChipExceptionManagement();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.checkDeletedFilterChipsExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkDeletedFilterChipsExceptionManagement();
  });

  test('Exception Management-New User saves added Filter value', async () => {
    await editFilterFields.addFilterValuesExceptionManagement();
    await editFilterFields.checkAddedFilterValuesExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkAddedFilterValuesExceptionManagement();
  });

  test('New User removes added Filter value', async () => {
    await editFilterFields.deleteFilterValuesExceptionManagement();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.navigateDashboardBackToExceptionManagement();
    await editFilterFields.checkDeletedFilterValuesExceptionManagement();
  });

  test.afterAll(
    'Exception Management-Reverting dashboard to original state',
    async () => {
      await editFilterFields.editFilterFields();
      await editFilterFields.deleteRemainingFilterChipExceptionManagement();
      await editFilterFields.updateFiltersFields();
      await editFilterFields.saveViewDashboard();
      await editFilterFields.checkDeleteRemainingFilterChipExceptionManagement();
    }
  );
});
