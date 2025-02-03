import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { SignUpPage } from '../models/signUp.ts';
import { AccountControl } from '../models/accountControl.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

let loginPage;
let signUpPage;
let accountControl;
let page: Page;

test.describe('[29] ShipperViz Account Control', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    accountControl = new AccountControl(page);
    await signUpPage.gotoShipperVizSignUp();
  });

  test('[29.1] Admin user approves an account request', async () => {
    await signUpPage.loginToDashboard();
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.approveUser('Test Organization');
    await expect(page.getByText('User approved successfully')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[29.2] Admin user approves an account request from a user with multiple sign-ups from paywalls', async () => {
    await accountControl.goToShipperPortalUserManagement();
    await expect(page.getByText('Signed up from:')).toBeVisible();
    await expect(page.getByText('Paywall')).toBeVisible();
    await accountControl.approveUser('Test Organization');
    await expect(page.getByText('User approved successfully')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[29.3] Admin user sets auto approval for a shipper organization', async () => {
    await accountControl.clickOrganizationManagement();
    await accountControl.searchShipperOrg();
    await accountControl.setDomainForAutoApproval('test-auto-approve.com');
    await expect(
      page.getByText('Organization updated successfully')
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.fillSignUpForm('user@test-auto-approve.com', 'Test User');
    await expect(page.getByText('Invitation email sent')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
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

  test('[29.6] Admin user clicks "Send reset password email"', async () => {
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.goToApprovedTab();
    await accountControl.sendResetPasswordEmail();
    await expect(
      page.getByText(/Successfully sent the reset password email to/)
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  test('[29.7] Admin user assigns a user to a different shipper organization', async () => {
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.goToApprovedTab();
    await accountControl.editUserOrganization('New Test Organization');
    await expect(page.getByText('User updated successfully')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await accountControl.gotoShipper();
    await accountControl.accountControlLoginToShipper();
    await accountControl.searchShipperPortalShipments();
    await expect(page.getByTestId('shipment-card')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });
});

test.afterAll('[29.X] Cleanup', async () => {
  await signUpPage.gotoDashboard();
  await accountControl.clickOrganizationManagement();
  await accountControl.searchShipperOrg();
  await accountControl.setDomainForAutoApproval('');
  await expect(page.getByText('Organization updated successfully')).toBeVisible(
    { timeout: DEFAULT_TIMEOUT_IN_MS }
  );
});
