import { Page, test, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreShipments } from '../models/exploreShipments';
import {
  areListsEqual,
  waitforTablePageLoad,
  waitForFilterSectionToLoad,
  waitForAdvanceSnackBar,
} from '../../utils';
import { logInAuth } from '../../utils';
const { chromium } = require('playwright');

let newHeaderList: string[];
let sortedColumnText: string;
let ship: ExploreShipments;
const indexToRemove = 3;
const indexToAdd = 1;

/**
 * Developer's Note:
 * TC X.9 is not automated due to playwright being able to successfully swap frozen columns
 * index to remove is based on numberfrozen columns + 2
 * index to add is can be any number as long as it is not the same column that was removed
 */

test.describe.serial('[47] Edit columns on the Shipments page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT_USER}`,
      `${process.env.FREIGHT_BI_CLIENT_PASS}`
    );
    ship = new ExploreShipments(page);
    await ship.goto();
  });

  test('[47.5] User rearranges columns', async () => {
    const expectedHeaderList = await ship.globalNativeTable.swapColumns(page, 1, 2);
    newHeaderList = await ship.globalNativeTable.dragSourceToTargetColumn(page, 1, 2);
    const listState = await areListsEqual(expectedHeaderList, newHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('[47.4] User saves columns', async () => {
    const ship = new ExploreShipments(page);
    const expectedHeaderList = newHeaderList;
    await ship.globalFilterSection.saveViewButton.click();
    await ship.globalFilterSection.buttonSaveModal.click();
    await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await page.goto(FREIGHT_BI_BASE_URL);
    await ship.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const savedHeaderList = await ship.globalNativeTable.getHeaderList(page);
    const listState = await areListsEqual(expectedHeaderList, savedHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('47.X User removes a column', async () => {
    const nItemText = newHeaderList[indexToRemove].replace(/\(.*?\)/g, '').trim();
    await ship.globalNativeTable.editColumnButton.click();
    await ship.globalNativeTable.menuEditColumn
      .locator(`//span[text()='${nItemText}']/ancestor::*[3]`)
      .getByTestId('VisibilityIcon')
      .click();
    await ship.globalNativeTable.editColumnButton.click();
    await expect.soft(ship.globalNativeTable.columnHeader.getByText(nItemText, {exact: true})).not.toBeVisible();
  });

  test('47.X User adds a column', async () => {
    await ship.globalNativeTable.editColumnButton.click();
    const addedItem = await ship.globalNativeTable.menuEditColumn
      .getByTestId('VisibilityOffIcon')
      .nth(indexToAdd)
      .locator('//preceding-sibling::*[2]')
      .textContent() || '';
    await ship.globalNativeTable.menuEditColumn
      .getByTestId('VisibilityOffIcon')
      .nth(indexToAdd)
      .click();
    await ship.globalNativeTable.editColumnButton.click();
    await expect.soft(ship.globalNativeTable.columnHeader.getByText(addedItem)).toBeVisible();
  });

  test('47.X User sorts a column', async () => {
    const firstSortIcon = await ship.globalNativeTable.columnHeader
      .getByTestId('selector-icon')
      .nth(1);
    sortedColumnText = await firstSortIcon.locator('..').textContent() || '';
    await firstSortIcon.click();
    await expect
      .soft(page.getByTestId('table-header').getByText(sortedColumnText).locator('..').getByTestId('down-icon'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  test('[47.6] User shares columns to another user with edits (add, remove, rearrange, and sort)', async () => {
    const shareUrlHeaderlList = await ship.globalNativeTable.getHeaderList(page);
    const url = await page.url();
    const browser = await chromium.launch();
    const context = await browser.newContext({ storageState: undefined });
    const page1 = await context.newPage();
    await logInAuth(
      page1,
      `${process.env.FREIGHT_BI_CLIENT2_USER}`,
      `${process.env.FREIGHT_BI_CLIENT2_PASS}`
    );
    await page1.goto(url);
    await waitForFilterSectionToLoad(page1, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page1, DEFAULT_TIMEOUT_IN_MS);
    const newPageHeaderList = await ship.globalNativeTable.getHeaderList(page1);
    const listState = await areListsEqual(shareUrlHeaderlList, newPageHeaderList);
    await expect.soft(listState).toBe(true);
    await expect
      .soft(page1.getByTestId('table-header').getByText(sortedColumnText).locator('..').getByTestId('down-icon'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });
});
