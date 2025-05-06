import { Page, test, expect } from '@playwright/test';
import {
  FREIGHT_BI_BASE_URL,
  DASHBOARD_TIMEOUT_IN_MS,
  DEFAULT_TIMEOUT_IN_MS,
} from '../../constants';
import { ExploreShipments } from '../models/exploreShipments';
import { ExploreContainers } from '../models/exploreContainers';
import { GlobalFilterSection } from '../models/globalFilterSection';
import {
  waitForFilterSectionToLoad,
  getFormattedDateTime,
  removeSpacesAndColons,
  waitDashboardLoad,
  logInAuth,
  waitforTablePageLoad,
} from '../../utils';
import { SavedViews } from '../models/savedViews';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import { ExploreOrganizations } from '../models/exploreOrganizations';

let dateNow;
let cleanDateNow;
let newCustomDashboardPageName;
let newExploreShipmentsPageName;
let newExploreContainersPageName;
let newPayableInvoicesPageName;
let newReceivableInvoicesPageName;
let newOrganizationsPageName;
let saveNewPage: SavedViews;

test.describe.configure({
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe.serial('[94] User Save Dashboard As New Page', () => {
  let page: Page;
  let globalFilterSection: GlobalFilterSection;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT_USER}`,
      `${process.env.FREIGHT_BI_CLIENT_PASS}`
    );
    globalFilterSection = new GlobalFilterSection(page);
    saveNewPage = new SavedViews(page);
    await page.goto(FREIGHT_BI_BASE_URL + '/explore/explore-shipments');
    dateNow = getFormattedDateTime().replace(' ', '').slice(0, -3);
    cleanDateNow = removeSpacesAndColons(dateNow);
  });
  //CUSTOM PAGE
  test('[94.1] User saves a new page from a Custom Page [Shipment Reports]', async () => {
    newCustomDashboardPageName = `ShipRep${cleanDateNow}`;

    await saveNewPage.linkBusinessPerformanceDashboardList.click();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await saveNewPage.linkShipmentReportsDashboard.click();
    const dashboardHeaderName =
      await saveNewPage.shipmentReportsHeader.textContent();
    console.log(dashboardHeaderName);
    await expect(saveNewPage.shipmentReportsHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFields = [
      'Page Last Updated On',
      'Shipment Weight',
      'Has Exceptions',
      'Packs Uom',
      'Packs',
    ];
    for (const field of filterFields) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }
    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '20';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();
    const selectedCurrency = 'PHP';
    await saveNewPage.setCurrency(selectedCurrency);
    await saveNewPage.saveAsNewView(newCustomDashboardPageName);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitDashboardLoad(page);

    await expect
      .soft(page.getByText(`Derived from ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByRole('heading', { name: newCustomDashboardPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByRole('button', { name: 'Transport Mode is not empty' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        page.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.locator(`input[role="combobox"][value="${selectedCurrency}"]`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(page.getByRole('link', { name: newCustomDashboardPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  //EXPLORE SHIPMENTS
  test('[94.2] User saves a new page from Explore Shipments', async ({
    browser,
  }) => {
    newExploreShipmentsPageName = `ExpShip${cleanDateNow}`;

    const newPage = await page.context().newPage();
    const exploreShipments = new ExploreShipments(newPage);
    const saveNewPage = new SavedViews(newPage);
    const globalFilterSection = new GlobalFilterSection(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL + '/explore/explore-shipments');
    await exploreShipments.waitForReferenceComponent();
    const dashboardHeaderName = await newPage
      .locator('h5[data-testid="header-title"]')
      .textContent();
    console.log(dashboardHeaderName);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFieldsExploreShipments = [
      'Page Last Updated On',
      'Packs Uom',
      'Shipment Weight',
      'Packs',
      'Has Exceptions',
    ];
    for (const field of filterFieldsExploreShipments) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }

    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '100';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();

    await saveNewPage.addPacksFilterValue('1');

    const selectedCurrency = 'PHP';
    await saveNewPage.setCurrency(selectedCurrency);
    await saveNewPage.saveAsNewView(newExploreShipmentsPageName);
    await waitForFilterSectionToLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await exploreShipments.waitForReferenceComponent();
    await newPage.waitForTimeout(1000);

    await expect
      .soft(newPage.getByText(`Derived from Explore ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByRole('heading', { name: newExploreShipmentsPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', { name: 'Transport Mode is not empty' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.locator(`input[role="combobox"][value="${selectedCurrency}"]`)
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByText('Packs1'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(newPage.getByRole('link', { name: newExploreShipmentsPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await newPage.close();
  });

  //EXPLORE CONTAINERS
  test('[94.3] User saves a new page from Explore Containers', async ({
    browser,
  }) => {
    newExploreContainersPageName = `ExpCont${cleanDateNow}`;

    const newPage = await page.context().newPage();
    const exploreContainers = new ExploreContainers(newPage);
    const saveNewPage = new SavedViews(newPage);
    const globalFilterSection = new GlobalFilterSection(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL + '/explore/containers');
    await exploreContainers.waitForReferenceComponent();
    const dashboardHeaderName = await newPage
      .locator('h5[data-testid="header-title"]')
      .textContent();
    console.log(dashboardHeaderName);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFields = [
      'Page Last Updated On',
      'Packs Uom',
      'Shipment Weight',
      'Has Exceptions',
    ];
    for (const field of filterFields) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }

    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '100';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();
    await saveNewPage.saveAsNewView(newExploreContainersPageName);
    await waitForFilterSectionToLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await newPage.waitForTimeout(1000);

    await expect
      .soft(newPage.getByText(`Derived from Explore ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('heading', { name: newExploreContainersPageName })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', { name: 'Transport Mode is not empty' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(newPage.getByRole('link', { name: newExploreContainersPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await newPage.close();
  });

  //PAYABLE INVOICES
  test('[94.4] User saves a new page from Payable Invoices', async ({
    browser,
  }) => {
    newPayableInvoicesPageName = `PayInv${cleanDateNow}`;

    const newPage = await page.context().newPage();
    const explorePayableInvoices = new ExplorePayableInvoices(newPage);
    const saveNewPage = new SavedViews(newPage);
    const globalFilterSection = new GlobalFilterSection(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL + '/explore/payable-invoices');
    await waitforTablePageLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    const dashboardHeaderName = await newPage
      .locator('h5[data-testid="header-title"]')
      .textContent();
    console.log(dashboardHeaderName);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFields = [
      'Page Last Updated On',
      'Packs Uom',
      'Shipment Weight',
      'Packs',
      'Has Exceptions',
    ];
    for (const field of filterFields) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }

    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '100';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();

    await saveNewPage.addPacksFilterValue('1');

    const selectedCurrency = 'PHP';
    await saveNewPage.setCurrency(selectedCurrency);
    await saveNewPage.saveAsNewView(newPayableInvoicesPageName);
    await waitForFilterSectionToLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await newPage.waitForTimeout(1000);

    await expect
      .soft(newPage.getByText(`Derived from ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByRole('heading', { name: newPayableInvoicesPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', { name: 'Transport Mode is not empty' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.locator(`input[role="combobox"][value="${selectedCurrency}"]`)
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByText('Packs1'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(newPage.getByRole('link', { name: newPayableInvoicesPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await newPage.close();
  });

  //RECEIVABLE INVOICES
  test('[94.5] User saves a new page from Receivable Invoices', async ({
    browser,
  }) => {
    newReceivableInvoicesPageName = `RecInv${cleanDateNow}`;

    const newPage = await page.context().newPage();
    const exploreReceivableInvoices = new ExploreReceivableInvoices(newPage);
    const saveNewPage = new SavedViews(newPage);
    const globalFilterSection = new GlobalFilterSection(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL + '/explore/receivable-invoices');
    await exploreReceivableInvoices.waitForReferenceComponent();
    const dashboardHeaderName = await newPage
      .locator('h5[data-testid="header-title"]')
      .textContent();
    console.log(dashboardHeaderName);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFields = [
      'Page Last Updated On',
      'Packs Uom',
      'Shipment Weight',
      'Packs',
      'Has Exceptions',
    ];
    for (const field of filterFields) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }

    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '100';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();

    await saveNewPage.addPacksFilterValue('1');

    const selectedCurrency = 'PHP';
    await saveNewPage.setCurrency(selectedCurrency);
    await saveNewPage.saveAsNewView(newReceivableInvoicesPageName);
    await waitForFilterSectionToLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await newPage.waitForTimeout(1000);

    await expect
      .soft(newPage.getByText(`Derived from ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('heading', { name: newReceivableInvoicesPageName })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', { name: 'Transport Mode is not empty' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.locator(`input[role="combobox"][value="${selectedCurrency}"]`)
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByText('Packs1'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(newPage.getByRole('link', { name: newReceivableInvoicesPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await newPage.close();
  });

  //ORGANIZATIONS
  test('[94.6] User saves a new page from Organizations', async ({
    browser,
  }) => {
    newOrganizationsPageName = `ExpOrg${cleanDateNow}`;

    const newPage = await page.context().newPage();
    const exploreOrganizations = new ExploreOrganizations(newPage);
    const saveNewPage = new SavedViews(newPage);
    const globalFilterSection = new GlobalFilterSection(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL + '/explore/explore-organizations');
    await exploreOrganizations.waitForReferenceComponent();
    const dashboardHeaderName = await newPage
      .locator('h5[data-testid="header-title"]')
      .textContent();
    console.log(dashboardHeaderName);

    await globalFilterSection.editBasicFiltersButton.click();
    const filterFields = [
      'Page Last Updated On',
      'Packs Uom',
      'Shipment Weight',
      'Packs',
      'Has Exceptions',
    ];
    for (const field of filterFields) {
      await globalFilterSection.addFilterFieldButton.click();
      await globalFilterSection.searchFilterField.fill(field);
      await globalFilterSection.clickFilterField(field);
    }

    await globalFilterSection.updateFilterField.click();
    await saveNewPage.closeDefaultDateShipmentCreated.click();
    await saveNewPage.addPageLastUpdatedDateFilterValue();
    const { hasDateRange, hasYearToDate } =
      await saveNewPage.getDateRangeState();
    await saveNewPage.addPacksUomFilterValue();
    await saveNewPage.addHasExceptionsFilterValue();

    await saveNewPage.openAdvancedFilters();
    await saveNewPage.addAdvancedShipmentFilters();
    await saveNewPage.addTransportModeFilterValue();
    await saveNewPage.addShipmentWeightFilterValue();
    const shipmentWeightValue = '100';
    await saveNewPage.setShipmentWeight(shipmentWeightValue);

    await saveNewPage.buttonUpdateAdvancedFilters.click();
    await saveNewPage.buttonBasicFiltersView.click();

    await saveNewPage.addPacksFilterValue('1');

    const selectedCurrency = 'PHP';
    await saveNewPage.setCurrency(selectedCurrency);
    await saveNewPage.saveAsNewView(newOrganizationsPageName);
    await waitForFilterSectionToLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(newPage, DEFAULT_TIMEOUT_IN_MS);
    await newPage.waitForTimeout(1000);

    await expect
      .soft(newPage.getByText(`Derived from Explore ${dashboardHeaderName}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByRole('heading', { name: newOrganizationsPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Shipment Weight' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Has Exceptions' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.locator('label', { hasText: 'Packs Uom' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', { name: 'Transport Mode is not empty' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.getByRole('button', {
          name: `Shipment Weight is less than ${shipmentWeightValue} KG`,
        })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        newPage.locator(`input[role="combobox"][value="${selectedCurrency}"]`)
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(newPage.getByText('Packs1'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect.soft(hasDateRange || hasYearToDate).toBeTruthy();

    await saveNewPage.linkSavedViews.click();
    await expect
      .soft(newPage.getByRole('link', { name: newOrganizationsPageName }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await newPage.close();
  });

  test.afterAll(async ({ browser }) => {
    const newPage = await page.context().newPage();
    const saveNewPage = new SavedViews(newPage);

    await newPage.goto(FREIGHT_BI_BASE_URL);

    const viewsToDelete = [
      newCustomDashboardPageName,
      newExploreShipmentsPageName,
      newExploreContainersPageName,
      newPayableInvoicesPageName,
      newReceivableInvoicesPageName,
      newOrganizationsPageName,
    ].filter(Boolean);

    await saveNewPage.linkSavedViews.click();
    await newPage.waitForTimeout(2000);

    for (const viewName of viewsToDelete) {
      const viewLink = newPage.getByRole('link', { name: viewName });
      try {
        await viewLink.waitFor({ state: 'visible', timeout: 5000 });
        await viewLink.hover();
        await newPage.waitForTimeout(1000);

        await saveNewPage.buttonMoreActions.click();
        await newPage.waitForTimeout(500);
        await saveNewPage.buttonDeleteSavedView.click();
        await newPage.waitForTimeout(500);
        await saveNewPage.buttonDeleteViewModal.click();

        await expect(viewLink).not.toBeVisible({ timeout: 5000 });
        await newPage.waitForTimeout(1000);
      } catch (error) {
        console.log(`Failed to delete view ${viewName}: ${error.message}`);
      }
    }

    await newPage.close();
  });
});
