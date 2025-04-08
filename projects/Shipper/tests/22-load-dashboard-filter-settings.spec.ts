import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login';
import { EditFilterFields } from '../models/editFilterFields';
import { AccountControl } from '../models/accountControl';
import { areListsEqual, waitForFilterSectionToLoad } from '../../utils';
import { SHIPPER_VIZ_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { GlobalFilterSection } from '../../Dashboard/models/globalFilterSection';

let loginPage: LoginPage;
let newHeaderList: string[];
let page: Page;
let editFilterFields;
let accountControl;
let originPort1: { key: string; value: string };
let originPort2: { key: string; value: string };
let dischargePort1: { key: string; value: string };
let dischargePort2: { key: string; value: string };
let dischargeEta;
let globalFilterSection: GlobalFilterSection;

test.describe.serial('Load Dashboard Filter Settings', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    accountControl = new AccountControl(page);
    globalFilterSection = new GlobalFilterSection(page);
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
    await editFilterFields.editFilterFields();
    await editFilterFields.deleteRemainingFilterChipExceptionManagement();
    await editFilterFields.updateFiltersFields();
    await editFilterFields.saveViewDashboard();
    await editFilterFields.checkDeleteRemainingFilterChipExceptionManagement();
  });

  test('[22.2] Exceptions Management - User clicks the browser back button until the first edit is shown', async () => {
    await page.goto(SHIPPER_VIZ_BASE_URL + '/exceptions-management');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    originPort1 = await editFilterFields.clickDropdownValuePort(
      'Origin Port-custom-multiple-text-field',
      '0'
    );
    originPort2 = await editFilterFields.clickDropdownValuePort(
      'Origin Port-custom-multiple-text-field',
      '0'
    );
    dischargePort1 = await editFilterFields.clickDropdownValuePort(
      'Discharge Port-custom-multiple-text-field',
      '1'
    );

    await page.goBack();
    await page.getByTestId('Discharge Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeVisible();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeHidden();
  });

  test('[22.2] Explore Shipment - User clicks the browser back button until the first edit is shown', async () => {
    await page.goto(SHIPPER_VIZ_BASE_URL + '/explore-shipments');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    originPort1 = await editFilterFields.clickDropdownValuePort(
      'Origin Port-custom-multiple-text-field',
      '0'
    );
    originPort2 = await editFilterFields.clickDropdownValuePort(
      'Origin Port-custom-multiple-text-field',
      '0'
    );
    dischargePort1 = await editFilterFields.clickDropdownValuePort(
      'Discharge Port-custom-multiple-text-field',
      '1'
    );

    await page.goBack();
    await page.getByTestId('Discharge Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeVisible();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
    await page.getByTestId('Origin Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${originPort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${originPort1.key}']`))
      .toBeHidden();
  });

  test('[22.2] Explore Container - User clicks the browser back button until the first edit is shown', async () => {
    await page.goto(SHIPPER_VIZ_BASE_URL + '/explore-containers');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    dischargePort1 = await editFilterFields.clickDropdownValuePort(
      'Discharge Port-custom-multiple-text-field',
      '1'
    );
    dischargePort2 = await editFilterFields.clickDropdownValuePort(
      'Discharge Port-custom-multiple-text-field',
      '1'
    );
    dischargeEta = await globalFilterSection.setBasicDateFilter(
      'Discharge Port ETA',
      'Today'
    );

    await page.goBack();
    await expect
      .soft(page.locator('//p[contains(text(), "Today")]'))
      .toBeHidden();
    await page.getByTestId('Discharge Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort2.key}']`))
      .toBeVisible();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Discharge Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator('//p[contains(text(), "Today")]'))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeVisible();

    await page.goBack();
    await page.getByTestId('Discharge Port-custom-multiple-text-field').click();
    await expect
      .soft(page.locator('//p[contains(text(), "Today")]'))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort2.key}']`))
      .toBeHidden();
    await expect
      .soft(page.locator(`//span[text()='${dischargePort1.key}']`))
      .toBeHidden();
  });
});
