import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../models/signUp.ts';
import { AccountControl } from '../models/accountControl.ts';
import {
  DASHBOARD_TIMEOUT_IN_MS,
  DEFAULT_TIMEOUT_IN_MS,
} from '../../constants';
import { getFormattedDateTime } from '../../utils.ts';
import { removeSpacesAndColons } from '../../utils.ts';

let signUpPage;
let accountControl;
let page: Page;
let emailNonExpedock;
let emailNonExpedockReject;
let emailPayNonExpedock;
let cleanDateNow;
let dateNow;

test.describe.configure({
  // mode: 'parallel',
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

test.describe.serial('[29] ShipperViz Account Control', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    accountControl = new AccountControl(page);
    await signUpPage.gotoShipperVizSignUp();
    dateNow = getFormattedDateTime().replace(' ', '');
    cleanDateNow = removeSpacesAndColons(dateNow);
  });

  test('[29.1] Admin user approves an account request', async () => {
    emailNonExpedock = `regtestautomation_tester_${cleanDateNow}@tester.com`;
    await signUpPage.setGlobalShipperEmail(emailNonExpedock);
    await signUpPage.requestShipperVizAccountAccountControl(emailNonExpedock);
    await signUpPage.loginToDashboard();
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.clickDashboardUserAvatar();
    await accountControl.goPendingApprovalTab();
    await signUpPage.checkShipperVizRequestedAccount(emailNonExpedock);
    await expect
      .soft(page.getByRole('cell', { name: 'Approve Reject' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await accountControl.approveUser('Test Organization');
    await expect(page.getByText('An account has been created')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[29.2] Admin user approves an account request from a user with multiple sign-ups from paywalls', async () => {
    emailPayNonExpedock = `regtestautomation_tester_${cleanDateNow}_paywall@tester.com`;
    await signUpPage.setGlobalShipperMultPayEmail(emailPayNonExpedock);
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.searchShipmentonShipperViz();
    await signUpPage.signUpOnShipperVizPaywalls(emailPayNonExpedock);
    await signUpPage.gotoDashboard();
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.clickDashboardUserAvatar();
    await signUpPage.checkShipperVizSignUpPaywallAccess(emailPayNonExpedock);
    await accountControl.approveUser('Test Organization');
    await expect(page.getByText('An account has been created')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[29.3] Admin user sets auto approval for a shipper organization', async () => {
    await accountControl.clickOrganizationManagement();
    await accountControl.searchShipperOrg();
    await accountControl.setDomainForAutoApproval('test-auto-approve.com');
    await expect(page.getByText('Successfully updated “')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.fillSignUpFormAutoApproval(
      `regression_user_${cleanDateNow}@test-auto-approve.com`,
      'Test Org',
      'Test User'
    );
    await signUpPage.gotoDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await accountControl.clickDashboardUserAvatar();
    await signUpPage.checkAutoApproval(
      `regression_user_${cleanDateNow}@test-auto-approve.com`
    );
  });

  test('[29.4] Admin user rejects an account request', async () => {
    emailNonExpedockReject = `regtestautomation_tester_${cleanDateNow}_reject@tester.com`;
    await signUpPage.setGlobalShipperEmail(emailNonExpedockReject);
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.requestShipperVizAccountAccountControl(
      emailNonExpedockReject
    );
    await signUpPage.gotoDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await accountControl.clickDashboardUserAvatar();
    await accountControl.goPendingApprovalTab();
    await signUpPage.checkShipperVizRequestedAccount(emailNonExpedockReject);
    await expect
      .soft(page.getByRole('cell', { name: 'Approve Reject' }))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await accountControl.rejectShipperVizAccount();
    await signUpPage.gotoDashboardUserPortalManagement();
    await accountControl.clickDashboardUserAvatar();
    await accountControl.checkRejectedUser(emailNonExpedockReject);
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
      .soft(page.getByRole('cell', { name: `${process.env.SHIPPER_ORG}` }))
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
    await signUpPage.gotoDashboard();
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.goToApproveTab();
    await accountControl.sendResetPasswordEmail(
      'jeorjie.manalaysay+dd_act_001@expedock.com'
    );
    await expect(page.getByText(/Successfully sent the reset/)).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[29.7] Admin user assigns a user to a different shipper organization', async () => {
    await accountControl.goToShipperPortalUserManagement();
    await accountControl.goToApproveTab();
    await accountControl.editUserOrganization('Demo Organization 1');
    await expect(page.getByText('Successfully updated')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    await accountControl.gotoShipper();
    await accountControl.accountControlLoginToShipper();
    await accountControl.searchShipperPortalShipments();
    await expect(page.getByTestId('shipment-card')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test.afterAll('[29.X] Cleanup', async () => {
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

    await accountControl.goToShipperPortalUserManagement();
    await accountControl.goToApproveTab();
    await accountControl.revertToDefaultOrg(
      'jeorjie.manalaysay+dd_act_001@expedock.com'
    );
    await accountControl.editUserOrganization('Automation Test Organization');
    await expect(page.getByText('Successfully updated')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await page.close();
  });
});
