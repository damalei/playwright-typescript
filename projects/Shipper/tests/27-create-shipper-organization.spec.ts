import { test, Page, expect } from '@playwright/test';
import { logInAuth, getFormattedDateTime, waitForSnackBar } from '../../utils';
import { FREIGHT_BI_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { SideMenu } from '../../Dashboard/models/sideMenu';
import { ShipperOrganization } from '../models/shipperOrganization';

let page: Page;
let side: SideMenu;
let shipOrg: ShipperOrganization;
let orgName: string;

test.describe.serial('[27] Create Shipper Organization', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT_USER}`,
      `${process.env.FREIGHT_BI_CLIENT_PASS}`
    );
    await page.goto(FREIGHT_BI_BASE_URL);
    side = new SideMenu(page);
    shipOrg = new ShipperOrganization(page);
  });

  test('Create Shipper Organization', async () => {
    const date = getFormattedDateTime().replace(' ', '');
    orgName = `Test Organization ${date}`;
    await side.userProfile.click();
    await side.optionOrganizationManagement.click();
    await page.keyboard.press('Escape');
    await shipOrg.buttonAddOrganization.click();
    await shipOrg.inputOrganizationName.fill(orgName);
    await shipOrg.inputOnDropDownField(
      shipOrg.inputOrganizationCode,
      'ENGBEEMNL1'
    );
    await shipOrg.inputOrganizationCode.fill('');
    await shipOrg.inputOnDropDownField(shipOrg.inputOrganizationCode, 'SYSTST');
    await shipOrg.buttonCreateOrganization.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await page.reload();
    await shipOrg.inputSearchOrganization.fill(orgName);
    const row = page.getByText(orgName).locator('xpath=ancestor::tr');
    await expect.soft(row.getByText(orgName)).toBeVisible();
    await expect.soft(row.getByText('ENGBEEMNL1')).toBeVisible();
    await expect.soft(row.getByText('SYSTST')).toBeVisible();
  });
});
