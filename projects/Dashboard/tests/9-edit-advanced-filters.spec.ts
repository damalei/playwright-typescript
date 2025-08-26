import { test, expect, Page } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments';
import { DASHBOARD_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { AdvancedFilterView } from '../models/advancedFilters';

let explorePayableInvoices;
let exploreShipments;
let advancedFilterView;

test.describe.configure({ mode: 'serial' });

test.describe('Edit, Save, and Remove filters on Advanced view', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);

    explorePayableInvoices = new ExplorePayableInvoices(page);
    exploreShipments = new ExploreShipments(page);
    advancedFilterView = new AdvancedFilterView(page);
  });

  test('[9.1] User adds filter values on the advance filter view', async () => {
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await advancedFilterView.waitForFilterFields();
    await advancedFilterView.clickAdvanceFilterBtn();
    await expect
      .soft(page.getByTestId('edit-filters-button'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });

    await advancedFilterView.clickEditFiltersBtn();
    await expect
      .soft(page.getByRole('button', { name: 'Filter Editor' }))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.clickShipmentFiltersBtn();
    await expect
      .soft(page.getByText('AndOrAdd ruleAdd group is'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });

    await advancedFilterView.clickAddedFilterFields1();
    await page.keyboard.type('Transport Mode');
    await advancedFilterView.clickShipmentTransportMode();
    await expect
      .soft(page.getByText('is', { exact: true }))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.clickShipmentTransportModeCondition();

    await advancedFilterView.addAdvanceFilterRule();
    await expect
      .soft(page.getByTestId('Shipment Filters').getByLabel('Open').nth(2))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.clickAddedFilterFields2();
    await page.keyboard.type('Has Exceptions');
    await advancedFilterView.BooleanHasExceptions();
    await expect
      .soft(page.getByLabel('NoYes'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await page.getByLabel('NoYes').check();

    await advancedFilterView.addAdvanceFilterRule();
    await expect
      .soft(page.getByTestId('Shipment Filters').getByLabel('Open').nth(3))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.clickAddedFilterFields3();
    await page.keyboard.type('Shipment Weight');
    await advancedFilterView.clickShipmentWeightFilter();
    await expect
      .soft(page.getByText('- KG'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.setShipmentWeightFilter();

    await advancedFilterView.clickAdvanceUpdateFiltersBtn();
    await exploreShipments.waitForReferenceComponent();
    await expect.soft(
      page.getByRole('button', { name: 'Has Exceptions is true', exact: true })
    ).toBeVisible;
    await expect.soft(
      page.getByRole('button', {
        name: 'Transport Mode is not empty',
        exact: true,
      })
    ).toBeVisible;
    await expect.soft(
      page.getByRole('button', {
        name: 'Shipment Weight is less than 20 KG',
        exact: true,
      })
    ).toBeVisible;
  });

  test('[9.2] User saves filter value/s on the advance filter view', async () => {
    await advancedFilterView.saveAdvancedFiltersBtn();
    await expect
      .soft(page.getByText('Your "Shipments" report has'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });

    await explorePayableInvoices.goto();
    await explorePayableInvoices.waitForReferenceComponent();
    await expect
      .soft(page.getByTestId('header-title'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });

    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await expect
      .soft(
        page.getByRole('button', {
          name: 'Has Exceptions is true',
          exact: true,
        })
      )
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect
      .soft(
        page.getByRole('button', {
          name: 'Transport Mode is not empty',
          exact: true,
        })
      )
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect
      .soft(
        page.getByRole('button', {
          name: 'Shipment Weight is less than 20 KG',
          exact: true,
        })
      )
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
  });

  test('[9.2] User remove filter value/s on the advance filter view', async () => {
    await advancedFilterView.clickAdvanceFilterBtn();
    await expect
      .soft(page.getByTestId('edit-filters-button'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await advancedFilterView.removeAdvanceFilters();
    await advancedFilterView.saveAdvancedFiltersBtn();
    await expect
      .soft(page.getByText('Your "Shipments" report has'))
      .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await explorePayableInvoices.goto();
    await explorePayableInvoices.waitForReferenceComponent();

    await exploreShipments.goto();
    await advancedFilterView.waitForFilterFields();
    await expect
      .soft(page.locator('span', { hasText: 'Transport Mode is not empty' }))
      .not.toBeVisible();
    await expect
      .soft(page.locator('span', { hasText: 'Has Exceptions is true' }))
      .not.toBeVisible();
    await expect
      .soft(
        page.locator('span', { hasText: 'Shipment Weight is less than 20 KG' })
      )
      .not.toBeVisible();
  });
});
