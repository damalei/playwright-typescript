import { test, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import { ExploreContainers } from '../models/exploreContainers';
import { GlobalNativeTable } from '../models/globalNativeTable';

const GLOBALTIMEOUT = 300000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

test.describe.configure({
  mode: 'parallel',
  timeout: DEFAULT_GLOBAL_TIMEOUT_MS,
});

test.beforeEach(async ({ page }) => {
  await page.goto(`https://${process.env.ENV}-dashboard.expedock.com`);
  await page
    .locator('#username')
    .fill(`${process.env.FREIGHT_BI_CLIENT2_USER}`);
  await page
    .locator('#password')
    .fill(`${process.env.FREIGHT_BI_CLIENT2_USER}`);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL(
    `https://${process.env.ENV}-dashboard.expedock.com/**/`
  );
  await expect(page.getByTestId('account-user-name')).toBeVisible({
    timeout: GLOBALTIMEOUT,
  });
});

test.afterEach(async ({ page }) => {
  const globalNativeTable = new GlobalNativeTable(page);
  await globalNativeTable.editColumnButton.click();
  await globalNativeTable.editShowAll.click();
  await globalNativeTable.saveButton.click();
  await globalNativeTable.editColumnButton.click();
});

test.describe('User clicks edits column > save columns', () => {
  test('Shipments page', async ({ page }) => {
    const exploreShipments = new ExploreShipments(page);
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.globalNativeTable.editDisableAll.click();
    await exploreShipments.globalNativeTable.saveButton.click();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.goto();
    await expect
      .soft(exploreShipments.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect.soft(exploreShipments.columnForwarderReference).toBeVisible();
  });

  test('Organization page', async ({ page }) => {
    const exploreOrg = new ExploreOrganizations(page);
    await exploreOrg.goto();
    await exploreOrg.waitForReferenceComponent();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await exploreOrg.globalNativeTable.editDisableAll.click();
    await exploreOrg.globalNativeTable.saveButton.click();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await exploreOrg.goto();
    await expect
      .soft(exploreOrg.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect.soft(exploreOrg.columnOrganization).toBeVisible();
  });

  test('Payable Invoices page', async ({ page }) => {
    const explorePay = new ExplorePayableInvoices(page);
    await explorePay.goto();
    await explorePay.waitForReferenceComponent();
    await explorePay.globalNativeTable.editColumnButton.click();
    await explorePay.globalNativeTable.editDisableAll.click();
    await explorePay.globalNativeTable.saveButton.click();
    await explorePay.globalNativeTable.editColumnButton.click();
    await explorePay.goto();
    await expect
      .soft(explorePay.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect.soft(explorePay.columnInvoiceNumber).toBeVisible();
  });

  test('Receivable Invoices page', async ({ page }) => {
    const exploreRec = new ExploreReceivableInvoices(page);
    await exploreRec.goto();
    await exploreRec.waitForReferenceComponent();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await exploreRec.globalNativeTable.editDisableAll.click();
    await exploreRec.globalNativeTable.saveButton.click();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await exploreRec.goto();
    await expect
      .soft(exploreRec.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect.soft(exploreRec.columnInvoiceNumber).toBeVisible();
  });

  test('Container page', async ({ page }) => {
    const exploreCon = new ExploreContainers(page);
    await exploreCon.goto();
    await exploreCon.waitForReferenceComponent();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await exploreCon.globalNativeTable.editDisableAll.click();
    await exploreCon.globalNativeTable.saveButton.click();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await exploreCon.goto();
    await expect
      .soft(exploreCon.globalNativeTable.columnHeader.nth(2))
      .not.toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect.soft(exploreCon.columnContainer).toBeVisible();
    await expect
      .soft(exploreCon.columnShipmentForwarderReference)
      .toBeVisible();
  });
});
// })
