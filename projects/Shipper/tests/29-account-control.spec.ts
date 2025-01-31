import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { SignUpPage } from '../models/signUp.ts';
import { AccountControl } from '../models/accountControl.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

let loginPage;
let signUpPage;
let accountControl;
let page: Page;

test.describe('ShipperViz Account Control', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    accountControl = new AccountControl(page);
    await signUpPage.gotoShipperVizSignUp();
  });

  test('[29.4] Admin user rejects an account request', async () => {
    await signUpPage.loginToDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await accountControl.clickDashboardUserAvatar();
    await signUpPage.checkShipperVizRequestedAccount();
    await expect
      .soft(page.getByRole('cell', { name: 'Approve Reject' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await accountControl.rejectShipperVizAccount();
    await signUpPage.gotoDashboardUserPortalManagement();
    await accountControl.clickDashboardUserAvatar();
    await accountControl.checkRejectedUser();
  });

  test('[29.5] Admin user edits user shipper organization', async () => {
    await accountControl.gotoShipper();
    await accountControl.accountControlLoginToShipper();
    await accountControl.searchShipperPortalShipments();
    await expect
      .soft(page.getByTestId('shipment-card'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

    await signUpPage.gotoDashboard();
    await accountControl.clickOrganizationManagement();
    await accountControl.searchShipperOrg();
    await accountControl.editShipperPortalOrg();
    await expect
      .soft(page.getByRole('cell', { name: 'ENGV' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(
        page.getByRole('cell', { name: 'Automation Test Organization Edited' })
      )
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await accountControl.gotoShipper();
    await accountControl.accountControlLoginToShipper();
    await accountControl.searchShipperPortalShipments();
    await expect
      .soft(page.getByText('No shipment found for'))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });
});

test.afterAll('[29.X] Reverting Organization Settings', async () => {
  await signUpPage.gotoDashboard();
  await accountControl.clickOrganizationManagement();
  await accountControl.searchShipperOrg();
  await accountControl.revertShipperPortalOrg();
  await expect
    .soft(page.getByRole('cell', { name: 'XYZAB' }))
    .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  await expect
    .soft(page.getByRole('cell', { name: 'Automation Test Organization' }))
    .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
});
