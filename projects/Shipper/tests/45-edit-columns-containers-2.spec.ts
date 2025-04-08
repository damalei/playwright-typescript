import { test, expect, Page, chromium } from '@playwright/test';
import { LoginPage } from '../models/login';
import { EditFilterFields } from '../models/editFilterFields';
import { AccountControl } from '../models/accountControl';
import { areListsEqual } from '../../utils';
import { EditColumns } from '../models/editColumns';

import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';

let loginPage: LoginPage;
let newHeaderList: string[];
let page: Page;
let editFilterFields;
let accountControl;
let editColumns;

test.describe('Edit Dashboard Column Settings', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    accountControl = new AccountControl(page);
    editColumns = new EditColumns(page);
    await loginPage.goto();
    await accountControl.accountControlLoginToShipper();
    await editFilterFields.waitForExceptionManagement();
    await editFilterFields.gotoExploreContainersDashboard();
  });

  test('45.3 - User rearranges frozen columns', async () => {
    await editFilterFields.waitForContainerNumberReference();
    const initialHeaderList = await page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();

    const expectedHeaderList1 = await editFilterFields.swapColumns(page, 1, 2);
    newHeaderList = await editFilterFields.dragSourceToTargetColumn(page, 1, 2);
    console.log('After first swap:', { expected: expectedHeaderList1 });
    const expectedHeaderList2 = await editFilterFields.swapColumns(page, 0, 1);
    newHeaderList = await editFilterFields.dragSourceToTargetColumn(page, 0, 1);
    console.log('After second swap:', { expected: expectedHeaderList2 });

    const finalHeaderList = await page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
    await expect(finalHeaderList[0]).toBe(initialHeaderList[0]);
    await expect(finalHeaderList[1]).toBe(initialHeaderList[1]);
    await expect(finalHeaderList[2]).toBe(initialHeaderList[2]);
  });

  test('45.4 - User rearranges columns', async () => {
    await editFilterFields.shipmentsForwarderReferenceSort.click();
    const expectedHeaderList = await editFilterFields.swapColumns(page, 2, 3);
    newHeaderList = await editFilterFields.dragSourceToTargetColumn(page, 2, 3);
    const listState1 = await areListsEqual(expectedHeaderList, newHeaderList);
    await editFilterFields.waitForContainerNumberReference();
    await expect.soft(listState1).toBe(true);
  });

  test('45.7 - User disable all columns', async () => {
    await editColumns.editColumnButton.click();
    await editColumns.disableAllBtn.click();
    await editColumns.checkAllVisibleColumns(page);
    await page.waitForTimeout(1000);
    await editColumns.editColumnButton.click();
    await editFilterFields.waitForContainerNumberReference();
    await editColumns.exploreContainersOnlyFrozenColumnsVisible(page);
  });

  test('45.6 - User shows all columns', async () => {
    await editColumns.editColumnButton.click();
    await expect(page.getByTestId('edit-columns-popper')).toBeVisible();
    await editColumns.showAllBtn.click();
    await editFilterFields.editColumnButton.click();
    await editColumns.checkVisibleTableHeaders();
    await editFilterFields.waitForContainerNumberReference();
    await page.waitForTimeout(1000);
    await editFilterFields.editColumnButton.click();
    await editColumns.checkAllVisibleColumns(page);
    await editColumns.checkNoHiddenColumns(page);
  });

  test.describe('45.5 - Share column edits via URL', () => {
    test('45.5 -User shares columns to another user with edits (add, remove, rearrange, and sort', async () => {
      await editFilterFields.navigateDashboardBackToExploreContainers();
      await editFilterFields.waitForContainerNumberReference();
      const initialHeaders = await page
        .getByTestId('table-header')
        .locator('th')
        .allTextContents();
      console.log('Initial headers:', initialHeaders);

      await editColumns.editColumnButton.click();
      await editColumns.toggleTableColumnVisibilityEyeIcon('Delivery Agent');
      await editColumns.addTableColumn('Delivery Agent');
      await editFilterFields.waitForContainerNumberReference();
      await editColumns.editColumnButton.click();
      await editColumns.toggleTableColumnVisibilityEyeIcon(
        'Container Gross Weight'
      );
      await editColumns.removeTableColumn('Container Gross Weight');
      await editFilterFields.waitForContainerNumberReference();

      await editColumns.editColumnButton.click();
      await page.getByPlaceholder('Find column').fill('');
      await editColumns.editColumnButton.click();
      await page
        .getByRole('columnheader', { name: 'Forwarder Reference' })
        .click(); //change to click
      await page.waitForTimeout(2000);
      const headersAfterColumnChanges = await page
        .getByTestId('table-header')
        .locator('th')
        .allTextContents();
      console.log('Headers after column changes:', headersAfterColumnChanges);

      const expectedHeaderList = await editFilterFields.swapColumns(page, 2, 3);
      await page.waitForTimeout(2000);
      newHeaderList = await editFilterFields.dragSourceToTargetColumn(
        page,
        2,
        3
      );
      const listState1 = await areListsEqual(expectedHeaderList, newHeaderList);
      await editFilterFields.waitForContainerNumberReference();
      await expect.soft(listState1).toBe(true);

      const currentUrl = page.url();
      const browser = await chromium.launch();
      const context = await browser.newContext({ storageState: undefined });
      const newPage = await context.newPage();
      await newPage.goto(
        `https://dashdemo.${process.env.ENV}-portal.expedock.com/login`
      );
      const newAccountControl = new AccountControl(newPage);
      await newAccountControl.loginToShipperNewUser();
      await newPage.waitForURL(
        `https://dashdemo.${process.env.ENV}-portal.expedock.com/**/`
      );

      await newPage.goto(currentUrl);
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForLoadState('load');

      await Promise.all([
        editFilterFields.waitForContainerNumberReference(),
        newPage.waitForSelector('[data-testid="table-header"]', {
          state: 'visible',
          timeout: DASHBOARD_TIMEOUT_IN_MS,
        }),
        newPage.waitForSelector(
          '[data-testid="table-body-0-container_container_number_display"]',
          { state: 'visible', timeout: DASHBOARD_TIMEOUT_IN_MS }
        ),
        newPage.waitForSelector('[data-testid="filters"]', {
          state: 'visible',
          timeout: DASHBOARD_TIMEOUT_IN_MS,
        }),
      ]);

      await newPage.waitForFunction(
        () => {
          const tableBody = document.querySelector(
            '[data-testid="table-header"]'
          );
          return tableBody && tableBody.children.length > 0;
        },
        { timeout: DASHBOARD_TIMEOUT_IN_MS }
      );

      await newPage.getByText('Delivery Agent').scrollIntoViewIfNeeded();
      await expect
        .soft(newPage.getByText('Delivery Agent'))
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      await expect
        .soft(newPage.getByText('Container Gross Weight'))
        .not.toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      await expect.soft(listState1).toBe(true);
      await expect
        .soft(
          newPage
            .getByTestId('table-header')
            .getByText('Forwarder Reference')
            .locator('..')
            .getByTestId('down-icon')
        )
        .toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
      await context.close();
      await browser.close();
    });
  });
});
