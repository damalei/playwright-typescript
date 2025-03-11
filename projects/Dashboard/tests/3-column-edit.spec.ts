import { test, expect, Page, BrowserContext } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import { ExploreContainers } from '../models/exploreContainers';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';
import { logInAuth, removeTextBetweenPatterns } from '../../utils';

/**
 * Developer's Note:
 * Keep the console.log statements for troubleshooting and history tracking of the columns
 * in the non-prod and prod environments
 */

test.beforeAll(() => {
  require('util').inspect.defaultOptions.maxArrayLength = null;
  require('util').inspect.defaultOptions.depth = null;
});

test.describe.configure({
  mode: 'parallel',
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe('User clicks edits column > show all', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT_USER}`,
      `${process.env.FREIGHT_BI_CLIENT_PASS}`
    );
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('Shipments page', async ({}) => {
    const exploreShipments = new ExploreShipments(page);
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.globalNativeTable.editShowAll.click();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    const pageList1 =
      await exploreShipments.globalNativeTable.getHeaderList(page);
    await exploreShipments.goto();
    const url = await page.url();
    const cleaned = removeTextBetweenPatterns(url, '//', '-');
    await page.goto(cleaned);
    await exploreShipments.waitForReferenceComponent();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.globalNativeTable.editShowAll.click();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    const pageList2 =
      await exploreShipments.globalNativeTable.getHeaderList(page);
    const missingInDefault = pageList2.filter(
      (column) => !pageList1.includes(column)
    );
    const missingInAll = pageList1.filter(
      (column) => !pageList2.includes(column)
    );
    console.log('Columns missing in default view:', missingInDefault);
    console.log('Columns missing in show all view:', missingInAll);
    console.log('Columns in the non-prod environment:', pageList1);
    console.log('Columns in the PROD environment:', pageList2);
    expect(missingInDefault.length).toBe(0);
    expect(missingInAll.length).toBe(0);
  });

  test('Organization page', async ({}) => {
    const org = new ExploreOrganizations(page);
    await org.goto();
    await org.waitForReferenceComponent();
    await org.globalNativeTable.editColumnButton.click();
    await org.globalNativeTable.editShowAll.click();
    await org.globalNativeTable.editColumnButton.click();
    const pageList1 = await org.globalNativeTable.getHeaderList(page);
    await org.goto();
    const url = await page.url();
    const cleaned = removeTextBetweenPatterns(url, '//', '-');
    await page.goto(cleaned);
    await org.waitForReferenceComponent();
    await org.globalNativeTable.editColumnButton.click();
    await org.globalNativeTable.editShowAll.click();
    await org.globalNativeTable.editColumnButton.click();
    const pageList2 = await org.globalNativeTable.getHeaderList(page);
    const missingInDefault = pageList2.filter(
      (column) => !pageList1.includes(column)
    );
    const missingInAll = pageList1.filter(
      (column) => !pageList2.includes(column)
    );
    console.log('Columns missing in default view:', missingInDefault);
    console.log('Columns missing in show all view:', missingInAll);
    console.log('Columns in the non-prod environment:', pageList1);
    console.log('Columns in the PROD environment:', pageList2);
    expect(missingInDefault.length).toBe(0);
    expect(missingInAll.length).toBe(0);
  });

  test('Payable Invoices page', async ({}) => {
    const pay = new ExplorePayableInvoices(page);
    await pay.goto();
    await pay.waitForReferenceComponent();
    await pay.globalNativeTable.editColumnButton.click();
    await pay.globalNativeTable.editShowAll.click();
    await pay.globalNativeTable.editColumnButton.click();
    const pageList1 = await pay.globalNativeTable.getHeaderList(page);
    await pay.goto();
    const url = await page.url();
    const cleaned = removeTextBetweenPatterns(url, '//', '-');
    await page.goto(cleaned);
    await pay.waitForReferenceComponent();
    await pay.globalNativeTable.editColumnButton.click();
    await pay.globalNativeTable.editShowAll.click();
    await pay.globalNativeTable.editColumnButton.click();
    const pageList2 = await pay.globalNativeTable.getHeaderList(page);
    const missingInDefault = pageList2.filter(
      (column) => !pageList1.includes(column)
    );
    const missingInAll = pageList1.filter(
      (column) => !pageList2.includes(column)
    );
    console.log('Columns missing in default view:', missingInDefault);
    console.log('Columns missing in show all view:', missingInAll);
    console.log('Columns in the non-prod environment:', pageList1);
    console.log('Columns in the PROD environment:', pageList2);
    expect(missingInDefault.length).toBe(0);
    expect(missingInAll.length).toBe(0);
  });

  test('Receivable Invoices page', async ({}) => {
    const rec = new ExploreReceivableInvoices(page);
    await rec.goto();
    await rec.waitForReferenceComponent();
    await rec.globalNativeTable.editColumnButton.click();
    await rec.globalNativeTable.editShowAll.click();
    await rec.globalNativeTable.editColumnButton.click();
    const pageList1 = await rec.globalNativeTable.getHeaderList(page);
    await rec.goto();
    const url = await page.url();
    const cleaned = removeTextBetweenPatterns(url, '//', '-');
    await page.goto(cleaned);
    await rec.waitForReferenceComponent();
    await rec.globalNativeTable.editColumnButton.click();
    await rec.globalNativeTable.editShowAll.click();
    await rec.globalNativeTable.editColumnButton.click();
    const pageList2 = await rec.globalNativeTable.getHeaderList(page);
    const missingInDefault = pageList2.filter(
      (column) => !pageList1.includes(column)
    );
    const missingInAll = pageList1.filter(
      (column) => !pageList2.includes(column)
    );
    console.log('Columns missing in default view:', missingInDefault);
    console.log('Columns missing in show all view:', missingInAll);
    console.log('Columns in the non-prod environment:', pageList1);
    console.log('Columns in the PROD environment:', pageList2);
    expect(missingInDefault.length).toBe(0);
    expect(missingInAll.length).toBe(0);
  });

  test('Container page', async ({}) => {
    const con = new ExploreContainers(page);
    await con.goto();
    await con.waitForReferenceComponent();
    await con.globalNativeTable.editColumnButton.click();
    await con.globalNativeTable.editShowAll.click();
    await con.globalNativeTable.editColumnButton.click();
    const pageList1 = await con.globalNativeTable.getHeaderList(page);
    await con.goto();
    const url = await page.url();
    const cleaned = removeTextBetweenPatterns(url, '//', '-');
    await page.goto(cleaned);
    await con.waitForReferenceComponent();
    await con.globalNativeTable.editColumnButton.click();
    await con.globalNativeTable.editShowAll.click();
    await con.globalNativeTable.editColumnButton.click();
    const pageList2 = await con.globalNativeTable.getHeaderList(page);
    const missingInDefault = pageList2.filter(
      (column) => !pageList1.includes(column)
    );
    const missingInAll = pageList1.filter(
      (column) => !pageList2.includes(column)
    );
    console.log('Columns missing in default view:', missingInDefault);
    console.log('Columns missing in show all view:', missingInAll);
    console.log('Columns in the non-prod environment:', pageList1);
    console.log('Columns in the PROD environment:', pageList2);
    expect(missingInDefault.length).toBe(0);
    expect(missingInAll.length).toBe(0);
  });
});

test.describe('User clicks edits column > disable all', () => {
  test('Shipments page', async ({ page }) => {
    const exploreShipments = new ExploreShipments(page);
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await exploreShipments.globalNativeTable.editDisableAll.click();
    await exploreShipments.globalNativeTable.editColumnButton.click();
    await expect
      .soft(exploreShipments.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreShipments.columnForwarderReference).toBeVisible();
  });

  test('Organization page', async ({ page }) => {
    const exploreOrg = new ExploreOrganizations(page);
    await exploreOrg.goto();
    await exploreOrg.waitForReferenceComponent();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await exploreOrg.globalNativeTable.editDisableAll.click();
    await exploreOrg.globalNativeTable.editColumnButton.click();
    await expect
      .soft(exploreOrg.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreOrg.columnOrganization).toBeVisible();
  });

  test('Payable Invoices page', async ({ page }) => {
    const explorePay = new ExplorePayableInvoices(page);
    await explorePay.goto();
    await explorePay.waitForReferenceComponent();
    await explorePay.globalNativeTable.editColumnButton.click();
    await explorePay.globalNativeTable.editDisableAll.click();
    await explorePay.globalNativeTable.editColumnButton.click();
    await expect
      .soft(explorePay.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(explorePay.columnInvoiceNumber).toBeVisible();
  });

  test('Receivable Invoices page', async ({ page }) => {
    const exploreRec = new ExploreReceivableInvoices(page);
    await exploreRec.goto();
    await exploreRec.waitForReferenceComponent();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await exploreRec.globalNativeTable.editDisableAll.click();
    await exploreRec.globalNativeTable.editColumnButton.click();
    await expect
      .soft(exploreRec.globalNativeTable.columnHeader.nth(1))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreRec.columnInvoiceNumber).toBeVisible();
  });

  test('Container page', async ({ page }) => {
    const exploreCon = new ExploreContainers(page);
    await exploreCon.goto();
    await exploreCon.waitForReferenceComponent();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await exploreCon.globalNativeTable.editDisableAll.click();
    await exploreCon.globalNativeTable.editColumnButton.click();
    await expect
      .soft(exploreCon.globalNativeTable.columnHeader.nth(2))
      .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect.soft(exploreCon.columnContainer).toBeVisible();
    await expect
      .soft(exploreCon.columnShipmentForwarderReference)
      .toBeVisible();
  });
});
