import { test, Page, expect } from '@playwright/test';
import { waitForFilterSectionToLoad } from '../../utils';
import { SideMenu } from '../models/sideMenu';
import {
  DEFAULT_TIMEOUT_IN_MS,
  DASHBOARD_TIMEOUT_IN_MS,
  FREIGHT_BI_BASE_URL,
} from '../../constants';
import { DashboardBuilder } from '../models/dashboardBuilder';
import { UserManagement } from '../models/userManagement';

/**
 * Developer's Note:
 * When re-running the test make sure to do the following:
 * 1. Dashboard Builder > QA Test Template 2> Disable the Org Type selector
 * 2. User Management > Business Performance > Remove QA Test Templa
 */

const dashboard2 =
  FREIGHT_BI_BASE_URL +
  //'/dashboard-builder/c3f63950-8ce7-4529-b29d-31a92c6f7941'; //QA TEST Template (AP DASH DEMO)
  '/dashboard-builder/d787c999-4e98-4dcf-ab5c-cb9f4bbb9ee8'; //QA TEST Template 2 (AP DASH DEMO)

test.describe
  .serial('Edit and save filters fields on Dashboard Builder', () => {
  test.setTimeout(DASHBOARD_TIMEOUT_IN_MS);
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test.afterAll(async ({ browser }) => {
    const user = new UserManagement(page);
    const side = new SideMenu(page);
    await page.goto(FREIGHT_BI_BASE_URL);
    await side.userProfile.click();
    await side.listUserManagement.click();
    await page.keyboard.press('Escape');
    await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.inputDashboard('Business Performance', 'QA Test Template 2');
    await user.saveUserSettings();
  });

  test('[11.1 & 11.3] User adds selector FIELD from the basic view', async () => {
    const dashbuild = new DashboardBuilder(page);
    await page.goto(dashboard2);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await dashbuild.buttonEditDashboard.click();
    await dashbuild.clickSelectorToggle('ORG TYPE');
    await dashbuild.setSelectorValue('ORG TYPE', 'Shipper');
    await dashbuild.globalFilterSection.saveViewButton.click();
    await dashbuild.buttonSave.click();
    await expect.soft(page.locator('//h6[text()="ORG TYPE"]')).toBeVisible();
    await expect.soft(page.locator('//input[@value="Shipper"]')).toBeVisible();
  });

  test('[11.2] User saves a selector FIELD from the basic view', async () => {
    const user = new UserManagement(page);
    const side = new SideMenu(page);
    await page.goto(FREIGHT_BI_BASE_URL);
    await side.userProfile.click();
    await side.listUserManagement.click();
    await page.keyboard.press('Escape');
    await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.inputDashboard('Business Performance', 'QA Test Template 2');
    await user.isDashboardOnField('Business Performance', 'QA Test Template 2');
    await user.saveUserSettings();
    await page.reload();
    await side.accBP.click();
    await side.clickOnDashboardName('QA Test Template 2');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await expect.soft(page.locator('//h6[text()="ORG TYPE"]')).toBeVisible();
    await expect.soft(page.locator('//input[@value="Shipper"]')).toBeVisible();
  });

  test('[11.5] User changes a value on the selector field', async () => {
    const dashbuild = new DashboardBuilder(page);
    const side = new SideMenu(page);
    await page.goto(dashboard2);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await dashbuild.buttonEditDashboard.click();
    await dashbuild.setSelectorValue('ORG TYPE', 'Creditor');
    await dashbuild.globalFilterSection.saveViewButton.click();
    await dashbuild.buttonSave.click();
    await page.goto(FREIGHT_BI_BASE_URL);
    await side.accBP.click();
    await side.clickOnDashboardName('QA Test Template 2');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await expect.soft(page.locator('//h6[text()="ORG TYPE"]')).toBeVisible();
    await expect.soft(page.locator('//input[@value="Creditor"]')).toBeVisible();
  });

  test('[11.4] User removes a selector field', async () => {
    const dashbuild = new DashboardBuilder(page);
    const side = new SideMenu(page);
    await page.goto(dashboard2);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await dashbuild.buttonEditDashboard.click();
    await dashbuild.clickSelectorToggle('ORG TYPE');
    await dashbuild.globalFilterSection.saveViewButton.click();
    await dashbuild.buttonSave.click();
    await page.goto(FREIGHT_BI_BASE_URL);
    await side.accBP.click();
    await side.clickOnDashboardName('QA Test Template 2');
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await expect
      .soft(page.locator('//h6[text()="ORG TYPE"]'))
      .not.toBeVisible();
  });

  test.skip(
    '[11.X] User removes all selector fields',
    {
      annotation: {
        type: 'feature with issue',
        description: 'https://expedock.atlassian.net/browse/PD-10263',
      },
    },
    async () => {
      const dashbuild = new DashboardBuilder(page);
      const side = new SideMenu(page);
      await page.goto(dashboard2);
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
      await dashbuild.buttonEditDashboard.click();
      await dashbuild.clickSelectorToggle('ORG TYPE');
      await dashbuild.clickSelectorToggle('PERIOD');
      await dashbuild.clickSelectorToggle('CURRENCY');
      await dashbuild.clickSelectorToggle('SHIPMENT VOLUME');
      await dashbuild.clickSelectorToggle('WEIGHT');
      await dashbuild.clickSelectorToggle('VOLUME');
      await dashbuild.clickSelectorToggle('GROUP BY DATE');
      await dashbuild.globalFilterSection.saveViewButton.click();
      await dashbuild.buttonSave.click();
      await page.goto(FREIGHT_BI_BASE_URL);
      await side.accBP.click();
      await side.clickOnDashboardName('QA Test Template 2');
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
      await expect
        .soft(page.locator('//h6[text()="ORG TYPE"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="PERIOD"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="CURRENCY"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="SHIPMENT VOLUME"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="WEIGHT"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="VOLUME"]'))
        .not.toBeVisible();
      await expect
        .soft(page.locator('//h6[text()="GROUP BY DATE"]'))
        .not.toBeVisible();
    }
  );
});
