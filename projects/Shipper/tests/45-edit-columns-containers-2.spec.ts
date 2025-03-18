import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login';
import { EditFilterFields } from '../models/editFilterFields';
import { AccountControl } from '../models/accountControl';
import { areListsEqual } from '../../utils';
import { EditColumns } from '../models/editColumns';

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
});
