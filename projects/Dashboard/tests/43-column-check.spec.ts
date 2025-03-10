import { test, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import {
  DASHBOARD_TIMEOUT_IN_MS,
  DEFAULT_TIMEOUT_IN_MS,
} from '../../constants';
import { waitForFilterSectionToLoad } from '../../utils';

test.describe.configure({
  mode: 'parallel',
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe('User clicks column names on Explore section table headers', () => {
  test('Clicking on Explore Shipment table headers, page should not break', async ({
    page,
  }) => {
    const exploreShipments = new ExploreShipments(page);
    await exploreShipments.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await exploreShipments.globalNativeTable.waitForReferenceComponent();
    const elements =
      await exploreShipments.globalNativeTable.getColumnElements();
    for (const element of elements) {
      let headerName =
        await exploreShipments.globalNativeTable.clickColumnName(element);
      console.log('click' + element);
      await expect
        .soft(exploreShipments.referenceComponent)
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      let isTableVisible =
        await exploreShipments.referenceComponent.isVisible();
      if (!isTableVisible) {
        console.error(`Error on column click: "${headerName}"`);
        exploreShipments.page.reload();
      } else {
      }
    }
  });

  test('Clicking on Explore Organization table headers, page should not break', async ({
    page,
  }) => {
    const exploreOrganizations = new ExploreOrganizations(page);
    await exploreOrganizations.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await exploreOrganizations.globalNativeTable.waitForReferenceComponent();
    const elements =
      await exploreOrganizations.globalNativeTable.getColumnElements();
    for (const element of elements) {
      let headerName =
        await exploreOrganizations.globalNativeTable.clickColumnName(element);
      console.log('click' + element);
      await expect
        .soft(exploreOrganizations.referenceComponent)
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      let isTableVisible =
        await exploreOrganizations.referenceComponent.isVisible();
      if (!isTableVisible) {
        console.error(`Error on column click: "${headerName}"`);
        exploreOrganizations.page.reload();
      } else {
      }
    }
  });

  test('Clicking on Payable Invoices table headers, page should not break', async ({
    page,
  }) => {
    const explorePayableInvoices = new ExplorePayableInvoices(page);
    await explorePayableInvoices.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await explorePayableInvoices.globalNativeTable.waitForReferenceComponent();
    const elements =
      await explorePayableInvoices.globalNativeTable.getColumnElements();
    for (const element of elements) {
      let headerName =
        await explorePayableInvoices.globalNativeTable.clickColumnName(element);
      console.log('click' + element);
      await expect
        .soft(explorePayableInvoices.globalNativeTable.referenceComponent)
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      let isTableVisible =
        await explorePayableInvoices.globalNativeTable.referenceComponent.isVisible();
      if (!isTableVisible) {
        console.error(`Error on column click: "${headerName}"`);
        explorePayableInvoices.page.reload();
      } else {
      }
    }
  });

  test('Clicking on Receivable Invoices table headers, page should not break', async ({
    page,
  }) => {
    const exploreReceivableInvoices = new ExploreReceivableInvoices(page);
    await exploreReceivableInvoices.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await exploreReceivableInvoices.globalNativeTable.waitForReferenceComponent();
    const elements =
      await exploreReceivableInvoices.globalNativeTable.getColumnElements();
    for (const element of elements) {
      let headerName =
        await exploreReceivableInvoices.globalNativeTable.clickColumnName(
          element
        );
      console.log('click' + element);
      await expect
        .soft(exploreReceivableInvoices.globalNativeTable.referenceComponent)
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      let isTableVisible =
        await exploreReceivableInvoices.globalNativeTable.referenceComponent.isVisible();
      if (!isTableVisible) {
        console.error(`Error on column click: "${headerName}"`);
        exploreReceivableInvoices.page.reload();
      } else {
      }
    }
  });
});
