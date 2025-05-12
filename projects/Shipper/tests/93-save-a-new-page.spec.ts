import { test, Page, expect } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants.ts';
import { getFormattedDateTime } from '../../utils.ts';
import { removeSpacesAndColons } from '../../utils.ts';

let loginPage;
let editFilterFields;
let saveViewName;
let cleanDateNow;
let dateNow;
let page: Page;

test.describe.configure({
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe('TS 93 - User saves as new page ', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
    dateNow = getFormattedDateTime().replace(' ', '').slice(0, -3);
    cleanDateNow = removeSpacesAndColons(dateNow);
  });

  const exceptionManagementFiltersFields = [
    'Shipment Weight',
    'Has Exceptions',
    'Page Last Updated On',
    'Shipper Name',
  ];

  const explorePagesFiltersFields = [
    'Page Last Updated On',
    'Last Leg Arrival Status',
    'Has Exceptions',
    'Packs',
    'Shipper Name',
  ];

  test('[93.1] User saves a new page from the Exception Management Page', async () => {
    saveViewName = `ExMan${cleanDateNow}`;
    await editFilterFields.waitForExceptionManagement();

    for (const filterFields of exceptionManagementFiltersFields) {
      if (filterFields === 'Shipment Weight') {
        await editFilterFields.editFilterFields();
      }
      await editFilterFields.addFilterFields();
      await editFilterFields.searchFilterFields(filterFields);

      if (filterFields === 'Shipper Name') {
        await editFilterFields.updateFiltersFields();
      }
    }

    await editFilterFields.dateCreatedPicker.click();
    await editFilterFields.yearToDateOption.click();
    await editFilterFields.addFilterValuesExceptionManagement();

    await editFilterFields.saveNewView(saveViewName);
    await editFilterFields.waitForExceptionManagement();
    await editFilterFields.checkAddedFilterValuesExceptionManagement();

    await expect(editFilterFields.filtersSection).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.derivedFromExceptions).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldShipperName).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldHasExceptions).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldShipmentWeight).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldPageLastUpdated).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });

    await expect(editFilterFields.inputDateFilter).toHaveValue(
      /Is between 2025 Jan 01 and Today|Year to Date/,
      { timeout: DASHBOARD_TIMEOUT_IN_MS }
    );

    await editFilterFields.viewSavedViewListDropdown.click();
    const viewLink = page.getByLabel(saveViewName);
    await expect(viewLink).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  });

  test('[93.2] User saves a new page from the Explore Shipments Page', async () => {
    saveViewName = `ExShip${cleanDateNow}`;

    await editFilterFields.gotoExploreShipmentsDashboard();

    for (const filterFields of explorePagesFiltersFields) {
      if (filterFields === 'Page Last Updated On') {
        await editFilterFields.editFilterFields();
      }
      await editFilterFields.addFilterFields();
      await editFilterFields.searchFilterFields(filterFields);

      if (filterFields === 'Shipper Name') {
        await editFilterFields.updateFiltersFields();
      }
    }

    await editFilterFields.dateCreatedPicker.click();
    await editFilterFields.yearToDateOption.click();
    await editFilterFields.addFilterValuesExplorePages();

    await editFilterFields.saveNewView(saveViewName);
    await editFilterFields.waitForShipmentsReferenceComponent();
    await editFilterFields.checkAddedFilterValuesExplorePages();

    await expect(editFilterFields.filtersSection).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.derivedFromExploreShipments).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldShipperName).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldHasExceptions).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldPacks).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldLastLegArrivalStatus).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldPageLastUpdated).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.inputDateFilter).toHaveValue(
      /Is between 2025 Jan 01 and Today|Year to Date/,
      { timeout: DASHBOARD_TIMEOUT_IN_MS }
    );
    const viewLink = page.getByLabel(saveViewName);
    await expect(viewLink).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  });

  test('[93.3] User saves a new page from the Explore Containers Page', async () => {
    saveViewName = `ExCont${cleanDateNow}`;

    await editFilterFields.gotoExploreContainersDashboard();

    for (const filterFields of explorePagesFiltersFields) {
      if (filterFields === 'Page Last Updated On') {
        await editFilterFields.editFilterFields();
      }
      await editFilterFields.addFilterFields();
      await editFilterFields.searchFilterFields(filterFields);

      if (filterFields === 'Shipper Name') {
        await editFilterFields.updateFiltersFields();
      }
    }

    await editFilterFields.dateCreatedPicker.click();
    await editFilterFields.yearToDateOption.click();
    await editFilterFields.addFilterValuesExplorePages();

    await editFilterFields.saveNewView(saveViewName);
    await editFilterFields.waitForContainerNumberReference();
    await editFilterFields.checkAddedFilterValuesExplorePages();

    await expect(editFilterFields.filtersSection).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.derivedFromExploreContainers).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldShipperName).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldHasExceptions).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldLastLegArrivalStatus).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.fieldPageLastUpdated).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(editFilterFields.inputDateFilter).toHaveValue(
      /Is between 2025 Jan 01 and Today|Year to Date/,
      { timeout: DASHBOARD_TIMEOUT_IN_MS }
    );
    const viewLink = page.getByLabel(saveViewName);
    await expect(viewLink).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  });

  test('[93.4] User deletes all created saved views', async () => {
    // Get all created view names
    const viewNames = [
      `ExMan${cleanDateNow}`,
      `ExShip${cleanDateNow}`,
      `ExCont${cleanDateNow}`,
    ];

    await page.reload();
    await page
      .getByRole('main')
      .waitFor({ state: 'visible', timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect(page.getByText('Dashboards')).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await editFilterFields.viewSavedViewListDropdown.click();
    await page.waitForTimeout(2000);

    for (const viewName of viewNames) {
      try {
        const viewLink = page.getByLabel(viewName);
        await viewLink.waitFor({ state: 'visible', timeout: 5000 });
        await viewLink.hover();
        await page.waitForTimeout(1000);
        await editFilterFields.deleteSavedView();
        await expect(viewLink).not.toBeVisible({ timeout: 5000 });
        await expect(page.getByLabel(viewName)).not.toBeVisible({
          timeout: 5000,
        });
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log(`Failed to delete view ${viewName}: ${error.message}`);
      }
    }
  });
});
