import { test, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import { ExploreContainers } from '../models/exploreContainers';
import { GlobalNativeTable } from '../models/globalNativeTable';
import { GlobalFilterSection } from '../models/globalFilterSection';
import { DASHBOARD_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { logInAuth } from '../../utils';

test.describe.configure({
  mode: 'serial',
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe('User clicks edits column > save columns', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT2_USER}`,
      `${process.env.FREIGHT_BI_CLIENT2_PASS}`
    );
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test.afterEach(async ({}) => {
    const globalNativeTable = new GlobalNativeTable(page);
    const globalFilterSection = new GlobalFilterSection(page);
    await globalNativeTable.editColumnButton.click();
    await globalNativeTable.editShowAll.click();
    await globalNativeTable.saveButton.click();
    await globalFilterSection.buttonSaveModal.click();
    await globalNativeTable.editColumnButton.click();
  });
  test('Shipments page', async ({}) => {
    const exploreShipments = new ExploreShipments(page);
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.globalNativeTable.editDisableAll.click();
    await exploreShipments.globalNativeTable.saveButton.click();
    await exploreShipments.globalFilterSection.buttonSaveModal.click();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.goto();
    await expect
      .soft(exploreShipments.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreShipments.columnForwarderReference).toBeVisible();
  });

  test('Organization page', async ({}) => {
    const exploreOrg = new ExploreOrganizations(page);
    await exploreOrg.goto();
    await exploreOrg.waitForReferenceComponent();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await exploreOrg.globalNativeTable.editDisableAll.click();
    await exploreOrg.globalNativeTable.saveButton.click();
    await exploreOrg.globalFilterSection.buttonSaveModal.click();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await exploreOrg.goto();
    await expect
      .soft(exploreOrg.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreOrg.columnOrganization).toBeVisible();
  });

  test('Payable Invoices page', async ({}) => {
    const explorePay = new ExplorePayableInvoices(page);
    await explorePay.goto();
    // await explorePay.waitForReferenceComponent();
    await explorePay.globalNativeTable.waitForReferenceComponent();
    await explorePay.globalNativeTable.editColumnButton.click();
    await explorePay.globalNativeTable.editDisableAll.click();
    await explorePay.globalNativeTable.saveButton.click();
    await explorePay.globalFilterSection.buttonSaveModal.click();
    await explorePay.globalNativeTable.editColumnButton.click();
    await explorePay.goto();
    await expect
      .soft(explorePay.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(explorePay.columnInvoiceNumber).toBeVisible();
  });

  test('Receivable Invoices page', async ({}) => {
    const exploreRec = new ExploreReceivableInvoices(page);
    await exploreRec.goto();
    // await exploreRec.waitForReferenceComponent();
    await exploreRec.globalNativeTable.waitForReferenceComponent();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await exploreRec.globalNativeTable.editDisableAll.click();
    await exploreRec.globalNativeTable.saveButton.click();
    await exploreRec.globalFilterSection.buttonSaveModal.click();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await exploreRec.goto();
    await expect
      .soft(exploreRec.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreRec.columnInvoiceNumber).toBeVisible();
  });

  test('Container page', async ({}) => {
    const exploreCon = new ExploreContainers(page);
    await exploreCon.goto();
    await exploreCon.waitForReferenceComponent();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await exploreCon.globalNativeTable.editDisableAll.click();
    await exploreCon.globalNativeTable.saveButton.click();
    await exploreCon.globalFilterSection.buttonSaveModal.click();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await exploreCon.goto();
    await expect
      .soft(exploreCon.globalNativeTable.columnHeader.nth(2))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreCon.columnContainer).toBeVisible();
    await expect
      .soft(exploreCon.columnShipmentForwarderReference)
      .toBeVisible();
  });
});
