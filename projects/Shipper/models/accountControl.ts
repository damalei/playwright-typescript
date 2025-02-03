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
  readonly setOrgCodeXYZAB: Locator;
  readonly setOrgCodeENGV: Locator;
  readonly searchShipmentsSideMenu: Locator;
  readonly searchShipmentsShipper: Locator;
  readonly trackShipmentBtn: Locator;
  readonly searchPortalOrg: Locator;
  readonly editOrgBtn: Locator;
  readonly editOrgName: Locator;
  readonly editOrgCode: Locator;
  readonly setOrgCodetoENGV: Locator;
  readonly updateOrganizationBtn: Locator;
  readonly setOrgCodeToDefault: Locator;

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
    this.setOrgCodeXYZAB = page.locator('span:has-text("XYZAB") + *');
    this.setOrgCodeENGV = page.locator('span:has-text("ENGV") + *');

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
    this.setOrgCodetoENGV = page.getByRole('option', { name: 'ENGV' });
    this.setOrgCodeToDefault = page.getByRole('option', { name: 'XYZAB' });
    this.updateOrganizationBtn = page.getByRole('button', {
      name: 'Update Organization',
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

  async checkRejectedUser() {
    await this.shipperUserSearchBar.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL}`
    );
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
    await this.searchShipmentsShipper.fill('S00290118');
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

  async removeSetOrg() {
    await this.setOrgCodeXYZAB.click();
  }

  async removeSetOrg2() {
    await this.setOrgCodeENGV.click();
  }

  async searchShipperOrg() {
    await this.searchPortalOrg.fill('Automation Test Organization');
    await this.editOrgBtn.click();
  }

  async editShipperPortalOrg() {
    await this.editOrgName.fill('Automation Test Organization Edited');
    await this.removeSetOrg();
    await this.editOrgCode.fill('ENGV');
    await this.setOrgCodetoENGV.waitFor({ state: 'visible' });
    await this.setOrgCodetoENGV.click();
    await this.updateOrganizationBtn.click();
  }

  async revertShipperPortalOrg() {
    await this.editOrgName.fill('Automation Test Organization');
    await this.removeSetOrg2();
    await this.editOrgCode.fill('XYZAB');
    await this.setOrgCodeToDefault.waitFor({ state: 'visible' });
    await this.setOrgCodeToDefault.click();
    await this.updateOrganizationBtn.click();
  }
}
