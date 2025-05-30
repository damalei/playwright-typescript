import { test, Page, expect, Locator } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { EditFilterFields } from '../models/editFilterFields.ts';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants.ts';

let loginPage;
let editFilterFields;

test.describe('TS 23 - Backtracking after drilldown', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
  });

  test('[23.1] User clicks on the breadcrumbs after drilldown with filters', async () => {
    await editFilterFields.waitForExceptionManagement();
    const selectedTransportModeText = await editFilterFields.selectFirstOption(
      editFilterFields.transportModeFilter
    );
    const selectedDischargeText = await editFilterFields.selectFirstOption(
      editFilterFields.dischargePortFilterFields
    );
    await editFilterFields.drilldownFailedToDepartOrArrive();
    await editFilterFields.exceptionManagementBreadcrumb.click();
    await editFilterFields.waitForExceptionManagement();
    const transportModeChip = page
      .locator('.MuiChip-root')
      .filter({ hasText: selectedTransportModeText });
    await expect(transportModeChip).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    const dischargePortChip = page
      .locator('.MuiChip-root')
      .filter({ hasText: selectedDischargeText });
    await expect(dischargePortChip).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await page.close();
  });

  test('[23.2] User clicks on the browser back button after drilldown with filters from exceptions management tab', async ({
    browser,
  }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    editFilterFields = new EditFilterFields(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
    await editFilterFields.waitForExceptionManagement();
    const selectedTransportModeText = await editFilterFields.selectFirstOption(
      editFilterFields.transportModeFilter
    );
    const selectedDischargeText = await editFilterFields.selectFirstOption(
      editFilterFields.dischargePortFilterFields
    );
    await editFilterFields.drilldownFailedToDepartOrArrive();
    await page.goBack();
    await editFilterFields.waitForExceptionManagement();
    const transportModeChip = page
      .locator('.MuiChip-root')
      .filter({ hasText: selectedTransportModeText });
    await expect(transportModeChip).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    const dischargePortChip = page
      .locator('.MuiChip-root')
      .filter({ hasText: selectedDischargeText });
    await expect(dischargePortChip).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  });
});
