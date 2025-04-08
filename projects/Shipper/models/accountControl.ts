import { Locator, Page, expect } from '@playwright/test';
import {
  SHIPPER_VIZ_BASE_URL,
  DEFAULT_TIMEOUT_IN_MS,
  DASHBOARD_TIMEOUT_IN_MS,
} from '../../constants';

export class AccountControl {
  readonly page: Page;
  readonly loginEmail: Locator;
  readonly loginPass: Locator;
  readonly loginBtn: Locator;
  readonly rejectButtonUserManagent: Locator;
  readonly rejectUserBtn: Locator;
  readonly rejectDialogBox: Locator;
  readonly shipperUserSearchBar: Locator;
  readonly forgotPwdLink: Locator;
  readonly searchResultsRejectedUser: Locator;
  readonly dashboardUserManagementSettings: Locator;
  readonly dashboardOrganizationManagement: Locator;
  readonly dashboardOrganizationManagementHeader: Locator;
  readonly exceptionManagementHeader: Locator;
  readonly setOrgCodeXYZABChip: Locator;
  readonly setOrgCodeDOCT: Locator;
  readonly searchShipmentsSideMenu: Locator;
  readonly searchShipmentsShipper: Locator;
  readonly trackShipmentBtn: Locator;
  readonly searchPortalOrg: Locator;
  readonly editOrgBtn: Locator;
  readonly editOrgName: Locator;
  readonly editOrgCode: Locator;
  readonly setOrgCodetoDOCT: Locator;
  readonly updateOrganizationBtn: Locator;
  readonly setOrgCodeToDefault: Locator;
  readonly approveButton: Locator;
  readonly approveAndCreateUserButton: Locator;
  readonly shipperOrgDropdown: Locator;
  readonly sendResetPasswordButton: Locator;
  readonly editUserButton: Locator;
  readonly approvedTabButton: Locator;
  readonly toApproveTabButton: Locator;
  readonly domainInput: Locator;
  readonly shipperPortalUserManagement: Locator;
  readonly updateUserBtn: Locator;
  readonly autoApproveDomainChip: Locator;
  readonly setOrgCodeDOCTChip: Locator;
  readonly deleteDomain: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rejectButtonUserManagent = page
      .getByRole('button', { name: 'Reject' })
      .first();
    this.rejectUserBtn = page.getByRole('button', { name: 'Reject Users' });
    this.rejectDialogBox = page.getByLabel('Reject UserAre you sure you');
    this.shipperUserSearchBar = page.getByPlaceholder(
      'Enter at least 3 characters'
    );
    this.searchResultsRejectedUser = page.getByText('You have no sign ups to');
    this.dashboardUserManagementSettings = page.getByTestId(
      'account-menu-trigger'
    );
    this.dashboardOrganizationManagement = page.getByRole('link', {
      name: 'Organization Management',
    });
    this.dashboardOrganizationManagementHeader = page.getByRole('heading', {
      name: 'Manage Shipper Portal',
    });
    this.loginEmail = page.getByLabel('Email Address');
    this.forgotPwdLink = page.getByRole('link', { name: 'Forgot Password' });
    this.loginPass = page.getByLabel('Password');
    this.exceptionManagementHeader = page.getByTestId(
      'exceptions-management-header'
    );
    this.loginBtn = page.getByRole('button', { name: 'LOG IN' });

    this.setOrgCodeXYZABChip = page.locator('span:has-text("XYZAB") + *');
    this.setOrgCodeDOCTChip = page.locator('span:has-text("DOCT") + *');
    this.autoApproveDomainChip = page.locator(
      'span:has-text("test-auto-approve.com") + *'
    );
    this.searchShipmentsSideMenu = page.getByText('Search Shipments');
    this.searchShipmentsShipper = page.getByTestId('shipper-search-shipments');
    this.trackShipmentBtn = page.getByRole('button', { name: 'Track' });

    this.searchPortalOrg = page.getByRole('textbox', {
      name: 'Enter at least 3 characters',
    });
    this.editOrgBtn = page.getByRole('button', { name: 'Edit org' });
    this.editOrgName = page.getByRole('textbox', {
      name: 'Enter an alias for this',
    });
    this.editOrgCode = page.getByRole('combobox', {
      name: 'Enter at least 3 characters',
    });
    this.setOrgCodeDOCT = page.getByRole('option', { name: 'DOCT' });
    this.setOrgCodeToDefault = page.getByRole('option', { name: 'XYZAB' });
    this.updateOrganizationBtn = page.getByRole('button', {
      name: 'Update Organization',
    });
    this.approveButton = page.getByRole('button', { name: 'Approve' }).first();
    this.approveAndCreateUserButton = page.getByRole('button', {
      name: 'Approve and Create User',
    });
    this.shipperOrgDropdown = page.getByRole('combobox', {
      name: 'Select an organization',
    });
    this.sendResetPasswordButton = page.getByRole('button', {
      name: 'Send Reset Password Email',
    });
    this.editUserButton = page.getByRole('button', { name: 'Edit' });
    this.approvedTabButton = page.getByRole('tab', { name: 'Approved' });
    this.toApproveTabButton = page.getByRole('tab', { name: 'To Approve' });
    this.domainInput = page.getByRole('textbox', {
      name: 'Ex. Enter expedock.com if',
    });
    this.shipperPortalUserManagement = page.getByRole('link', {
      name: 'Shipper Portal User Management',
    });
    this.updateUserBtn = page.getByRole('button', { name: 'Update User' });
    this.deleteDomain = page.getByRole('button', {
      name: 'Update & Delete Domain(s)',
    });
  }
  async rejectShipperVizAccount() {
    await this.rejectButtonUserManagent.click();
    await expect(this.rejectDialogBox).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.rejectUserBtn.click();
  }

  async clickOrganizationManagement() {
    await this.dashboardUserManagementSettings.click();
    await this.dashboardOrganizationManagement.click();
    await this.clickDashboardUserAvatar();
    await expect(this.dashboardOrganizationManagementHeader).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async checkRejectedUser(email: string) {
    await this.shipperUserSearchBar.fill(email);
    await expect(this.searchResultsRejectedUser).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async clickDashboardUserAvatar() {
    await this.dashboardUserManagementSettings.waitFor({ state: 'visible' });
    await this.dashboardUserManagementSettings.click({ force: true });
  }

  async searchShipperPortalShipments() {
    await this.searchShipmentsSideMenu.click();
    await this.searchShipmentsShipper.fill(
      `${process.env.SHIPPER_VIZ_VALID_SHIPPER_REFERENCE}`
    );
    await this.trackShipmentBtn.click();
  }

  async gotoShipper() {
    await this.page.goto(SHIPPER_VIZ_BASE_URL + '/login');
    await this.forgotPwdLink.waitFor({ state: 'visible' });
  }

  async accountControlLoginToShipper() {
    await this.loginEmail.fill(
      `${process.env.SHIPPER_VIZ_USER_APPROVED_EMAIL}`
    );
    await this.loginPass.fill(`${process.env.SHIPPER_VIZ_CLIENT_PASS}`);
    await this.loginBtn.click();
    await expect(this.exceptionManagementHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async removeSetOrgXYZAB() {
    await this.setOrgCodeXYZABChip.click();
  }

  async removeSetOrg2() {
    await this.setOrgCodeDOCTChip.click();
  }

  async searchShipperOrg() {
    await this.searchPortalOrg.fill('Automation Test Organization');
    await this.editOrgBtn.click();
  }

  async editShipperPortalOrg() {
    await this.editOrgName.fill('Automation Test Organization Edited');
    await this.removeSetOrgXYZAB();
    await this.editOrgCode.fill('DOCT');
    await this.setOrgCodeDOCT.waitFor({ state: 'visible' });
    await this.setOrgCodeDOCT.click();
    await this.updateOrganizationBtn.click();
  }

  async revertShipperPortalOrg() {
    await this.editOrgName.fill('Automation Test Organization');
    await this.removeSetOrg2();
    await this.editOrgCode.fill('XYZAB');
    await this.setOrgCodeToDefault.waitFor({ state: 'visible' });
    await this.setOrgCodeToDefault.click();
    await this.autoApproveDomainChip.click();
    await this.updateOrganizationBtn.click();
    await this.deleteDomain.click();
  }

  async approveUser(organization: string) {
    await this.approveButton.click();
    await this.shipperOrgDropdown.click();
    await this.page.getByRole('option', { name: organization }).click();
    await this.approveAndCreateUserButton.click();
  }

  async goToShipperPortalUserManagement() {
    await this.dashboardUserManagementSettings.click();
    await this.shipperPortalUserManagement.click();
    await this.clickDashboardUserAvatar();
    await this.toApproveTabButton.waitFor({ state: 'visible' });
  }

  async goPendingApprovalTab() {
    await this.toApproveTabButton.click();
  }

  async goToApproveTab() {
    await this.approvedTabButton.click();
  }

  async sendResetPasswordEmail(email: string) {
    await this.shipperUserSearchBar.fill(email);
    await this.sendResetPasswordButton.click();
  }

  async editUserOrganization(organization: string) {
    await this.editUserButton.click();
    await this.shipperOrgDropdown.click();
    await this.page.getByRole('option', { name: organization }).click();
    await this.updateUserBtn.click();
  }

  async setDomainForAutoApproval(domain: string) {
    await this.domainInput.fill(domain);
    await this.updateOrganizationBtn.click();
  }
  async revertToDefaultOrg(email: string) {
    await this.shipperUserSearchBar.fill(email);
  }

  async loginToShipperNewUser() {
    await this.loginEmail.fill(`${process.env.SHIPPER_VIZ_NEW_USER}`);
    await this.loginPass.fill(`${process.env.SHIPPER_VIZ_NEW_PASS}`);
    await this.loginBtn.click();
    await expect(this.exceptionManagementHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }
}
