import { Page, test, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreOrganizations } from '../models/exploreOrganizations';
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
let org: ExploreOrganizations;
const indexToRemove = 3;
const indexToAdd = 1;

/**
 * Developer's Note:
 * TC X.9 is not automated due to playwright being able to successfully swap frozen columns
 * index to remove is based on numberfrozen columns + 2
 * index to add is can be any number as long as it is not the same column that was removed
 */

test.describe.serial('[53] Edit columns on the Organizations page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT_USER}`,
      `${process.env.FREIGHT_BI_CLIENT_PASS}`
    );
    org = new ExploreOrganizations(page);
    await org.goto();
  });

  test('[53.5] User rearranges columns', async () => {
    const expectedHeaderList = await org.globalNativeTable.swapColumns(page, 1, 2);
    newHeaderList = await org.globalNativeTable.dragSourceToTargetColumn(page, 1, 2);
    const listState = await areListsEqual(expectedHeaderList, newHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('[53.4] User saves columns', async () => {
    const org = new ExploreOrganizations(page);
    const expectedHeaderList = newHeaderList;
    await org.globalFilterSection.saveViewButton.click();
    await org.globalFilterSection.buttonSaveModal.click();
    await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await page.goto(FREIGHT_BI_BASE_URL);
    await org.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const savedHeaderList = await org.globalNativeTable.getHeaderList(page)
    const listState = await areListsEqual(expectedHeaderList, savedHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('53.X User removes a column', async () => {
    const nItemText = newHeaderList[indexToRemove].replace(/\(.*?\)/g, '').trim();
    await org.globalNativeTable.editColumnButton.click();
    await org.globalNativeTable.menuEditColumn
      .locator(`//span[text()='${nItemText}']/ancestor::*[3]`)
      .getByTestId('VisibilityIcon')
      .click();
    await org.globalNativeTable.editColumnButton.click();
    await expect.soft(org.globalNativeTable.columnHeader.getByText(nItemText, {exact: true})).not.toBeVisible();
  })

  test('53.X User adds a column', async () => {
    await org.globalNativeTable.editColumnButton.click();
    const addedItem = await org.globalNativeTable.menuEditColumn
      .getByTestId('VisibilityOffIcon')
      .nth(indexToAdd)
      .locator('//preceding-sibling::*[2]')
      .textContent() || '';
    await org.globalNativeTable.menuEditColumn
      .getByTestId('VisibilityOffIcon')
      .nth(indexToAdd)
      .click();
    await org.globalNativeTable.editColumnButton.click();
    await expect.soft(org.globalNativeTable.columnHeader.getByText(addedItem)).toBeVisible();
  })

  test('53.X User sorts a column', async () => {
    const firstSortIcon = await org.globalNativeTable.columnHeader
      .getByTestId('selector-icon')
      .nth(1);
    sortedColumnText = await firstSortIcon.locator('..').textContent() || '';
    await firstSortIcon.click();
    await expect
      .soft(page.getByTestId('table-header').getByText(sortedColumnText).locator('..').getByTestId('down-icon'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  })

  test('[53.6] User shares columns to another user with edits (add, remove, rearrange, and sort)', async () => {
    const shareUrlHeaderlList = await org.globalNativeTable.getHeaderList(page);
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
    const newPageHeaderList = await org.globalNativeTable.getHeaderList(page1);
    const listState = await areListsEqual(shareUrlHeaderlList, newPageHeaderList);
    await expect.soft(listState).toBe(true);
    await expect
      .soft(page1.getByTestId('table-header').getByText(sortedColumnText).locator('..').getByTestId('down-icon'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });
});
