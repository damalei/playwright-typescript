import { Page, test, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreContainers } from '../models/exploreContainers';
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
let con: ExploreContainers;
const indexToRemove = 4;
const indexToAdd = 1;

/**
 * Developer's Note:
 * TC X.9 is not automated due to playwright being able to successfully swap frozen columns
 * index to remove is based on numberfrozen columns + 2
 * index to add is can be any number as long as it is not the same column that was removed
 */

test.describe.serial('[57] Edit columns on the Containers page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT5_USER}`,
      `${process.env.FREIGHT_BI_CLIENT5_PASS}`
    );
    con = new ExploreContainers(page);
    await con.goto();
  });

  test('[57.5] User rearranges columns', async () => {
    const expectedHeaderList = await con.globalNativeTable.swapColumns(
      page,
      2,
      3
    );
    newHeaderList = await con.globalNativeTable.dragSourceToTargetColumn(
      page,
      2,
      3
    );
    const listState = await areListsEqual(expectedHeaderList, newHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('[57.4] User saves columns', async () => {
    const con = new ExploreContainers(page);
    const expectedHeaderList = newHeaderList;
    await con.globalFilterSection.saveViewButton.click();
    await con.globalFilterSection.buttonSaveModal.click();
    await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await page.goto(FREIGHT_BI_BASE_URL);
    await con.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const savedHeaderList = await con.globalNativeTable.getHeaderList(page);
    const listState = await areListsEqual(expectedHeaderList, savedHeaderList);
    await expect.soft(listState).toBe(true);
  });

  test('57.X User removes a column', async () => {
    const nItemText = newHeaderList[indexToRemove];
    const nItemTextCleaned = nItemText.replace(/\(.*?\)/g, '').trim();
    await con.globalNativeTable.editColumnButton.click();
    await con.globalNativeTable.menuEditColumn
      .locator(`//span[text()='${nItemTextCleaned}']/ancestor::*[3]`)
      .getByTestId('VisibilityIcon')
      .click();
    await con.globalNativeTable.editColumnButton.click();
    await expect
      .soft(
        con.globalNativeTable.columnHeader.getByText(nItemText, { exact: true })
      )
      .not.toBeVisible();
  });

  test('57.X User adds a column', async () => {
    await con.globalNativeTable.editColumnButton.click();
    const addedItem =
      (await con.globalNativeTable.menuEditColumn
        .getByTestId('VisibilityOffIcon')
        .nth(indexToAdd)
        .locator('//preceding-sibling::*[2]')
        .textContent()) || '';
    await con.globalNativeTable.menuEditColumn
      .getByTestId('VisibilityOffIcon')
      .nth(indexToAdd)
      .click();
    await con.globalNativeTable.editColumnButton.click();
    await expect
      .soft(con.globalNativeTable.columnHeader.getByText(addedItem))
      .toBeVisible();
  });

  test('57.X User sorts a column', async () => {
    const firstSortIcon = await con.globalNativeTable.columnHeader
      .getByTestId('selector-icon')
      .nth(1);
    sortedColumnText = (await firstSortIcon.locator('..').textContent()) || '';
    await firstSortIcon.click();
    await expect
      .soft(
        page
          .getByTestId('table-header')
          .getByText(sortedColumnText)
          .locator('..')
          .getByTestId('down-icon')
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  test('[57.6] User shares columns to another user with edits (add, remove, rearrange, and sort)', async () => {
    const shareUrlHeaderlList = await con.globalNativeTable.getHeaderList(page);
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
    const newPageHeaderList = await con.globalNativeTable.getHeaderList(page1);
    const listState = await areListsEqual(
      shareUrlHeaderlList,
      newPageHeaderList
    );
    await expect.soft(listState).toBe(true);
    await expect
      .soft(
        page1
          .getByTestId('table-header')
          .getByText(sortedColumnText)
          .locator('..')
          .getByTestId('down-icon')
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });
});
