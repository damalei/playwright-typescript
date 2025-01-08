import { Locator, Page, expect } from '@playwright/test';
import {
  SHIPPER_VIZ_BASE_URL,
  FREIGHT_BI_BASE_URL,
  DEFAULT_TIMEOUT_IN_MS,
  DASHBOARD_TIMEOUT_IN_MS,
} from '../../constants';

export class SignUpPage {
  readonly page: Page;
  readonly signUpSearchShipment: Locator;
  readonly fbiLoginEmail: Locator;
  readonly fbiLoginPass: Locator;
  readonly fbiLoginBtn: Locator;
  readonly forgotPwdLink: Locator;
  readonly fbidashboardSideMenu: Locator;
  readonly requestAccountBtn: Locator;
  readonly requestAccountForm: Locator;
  readonly requestAccountFullName: Locator;
  readonly requestAccountOrganization: Locator;
  readonly requestAccountEmail: Locator;
  readonly submitRequestBtn: Locator;
  readonly accountMenu: Locator;
  readonly shipperUserManagement: Locator;
  readonly shipperManagePortalUserPage: Locator;
  readonly shipperUserSearchBar: Locator;
  readonly trackShipmentBtn: Locator;
  readonly shipmentCardResult: Locator;
  readonly shipmentRoute: Locator;
  readonly seeContainerDetails: Locator;
  readonly documentsPaywall: Locator;
  readonly premiumFeatureNote: Locator;
  readonly requestPaywallAccessBtn: Locator;
  readonly costPerSKUPaywall: Locator;
  readonly invoicesToPayPaywall: Locator;
  readonly containerUtilizationPaywall: Locator;
  readonly exceptionManagementsPaywall: Locator;
  readonly approvedAccountAccessNote: Locator;
  readonly closeApprovedAccessNoteModalBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpSearchShipment = page.getByTestId('shipper-search-shipments');
    this.forgotPwdLink = page.getByRole('link', { name: 'Forgot Password' });
    this.fbiLoginBtn = page.getByRole('button', {
      name: 'Continue',
      exact: true,
    });
    this.fbiLoginEmail = page.getByLabel('Email Address');
    this.fbiLoginPass = page.getByLabel('Password');
    this.requestAccountBtn = page.getByRole('button', {
      name: 'Request for an account',
    });
    this.requestAccountForm = page.getByLabel('Request for an AccountFill');
    this.fbidashboardSideMenu = page
      .getByTestId('menu-item-dashboard')
      .getByText('Dashboard');
    this.requestAccountFullName = page.getByLabel('Full Name');
    this.requestAccountOrganization = page.getByLabel('Organization');
    this.requestAccountEmail = page.getByLabel('Email Address');
    this.submitRequestBtn = page.getByRole('button', {
      name: 'SUBMIT REQUEST',
    });
    this.accountMenu = page.getByTestId('account-menu-trigger');
    this.shipperUserManagement = page.getByRole('link', {
      name: 'Shipper Portal User Management',
    });
    this.shipperManagePortalUserPage = page.getByText(
      'Manage Shipper Portal UserTo'
    );
    this.shipperUserSearchBar = page.getByPlaceholder(
      'Enter at least 3 characters'
    );
    this.trackShipmentBtn = page.getByRole('button', { name: 'Track' });
    this.shipmentCardResult = page.getByTestId('shipment-card');
    this.shipmentRoute = page.getByTestId('route-and-legs');
    this.seeContainerDetails = page.getByRole('button', {
      name: 'See more container details',
    });
    this.premiumFeatureNote = page.getByText('This is a premium feature.');
    this.requestPaywallAccessBtn = page.getByRole('button', {
      name: 'REQUEST NOW',
    });
    this.costPerSKUPaywall = page.getByRole('tab', { name: 'Cost per SKU' });
    this.documentsPaywall = page.getByTestId('documents-tab');
    this.invoicesToPayPaywall = page.getByRole('tab', {
      name: 'Invoices to Pay',
    });
    this.containerUtilizationPaywall = page.getByRole('tab', {
      name: 'Container Utilization',
    });
    this.exceptionManagementsPaywall = page.getByRole('tab', {
      name: 'Exceptions Management',
    });
    this.approvedAccountAccessNote = page.getByText(
      'If you have any issues with'
    );
    this.closeApprovedAccessNoteModalBtn = page.getByTestId(
      'paywall-request-modal-close'
    );
  }

  async gotoShipperVizSignUp() {
    await this.page.goto(SHIPPER_VIZ_BASE_URL + '/search-shipments');
    await this.signUpSearchShipment.waitFor({
      state: 'visible',
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async requestShipperVizAccount() {
    await this.requestAccountBtn.click();
    await expect(this.requestAccountForm).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.requestAccountEmail.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL}`
    );
    await this.requestAccountOrganization.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_ORG}`
    );
    await this.requestAccountFullName.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_USER}`
    );
    await this.submitRequestBtn.click();
  }

  async loginToDashboard() {
    await this.page.goto(FREIGHT_BI_BASE_URL, {
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await this.forgotPwdLink.waitFor({
      state: 'visible',
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await this.fbiLoginEmail.fill(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await this.fbiLoginPass.fill(`${process.env.FREIGHT_BI_CLIENT_PASS}`);
    await this.fbiLoginBtn.click();
    await expect(this.fbidashboardSideMenu).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async gotoDashboard() {
    await this.page.goto(FREIGHT_BI_BASE_URL, {
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(this.fbidashboardSideMenu).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async gotoDashboardUserPortalManagement() {
    await this.accountMenu.click();
    await this.shipperUserManagement.click();
    await expect(this.shipperManagePortalUserPage).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async checkShipperVizRequestedAccount() {
    await this.shipperUserSearchBar.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL}`
    );
    await this.page.waitForSelector(
      `text=${process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL}`
    );
    const shipperUserSearchResults = await this.page
      .locator(`text=${process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL}`)
      .textContent();
    expect(shipperUserSearchResults).toContain(
      process.env.SHIPPER_VIZ_USER_REQUEST_EMAIL
    );
    const shipperUserSearchResultsPaywallFeature = await this.page
      .locator('text=PaywallFeature.LANDING_PAGE')
      .textContent();
    expect(shipperUserSearchResultsPaywallFeature).toContain(
      'PaywallFeature.LANDING_PAGE'
    );
  }

  async fillRequestAccountFormOnPaywalls() {
    await this.requestAccountEmail.fill(
      `${process.env.SHIPPER_VIZ_USER_PAYWALL_REQUEST_EMAIL}`
    );
    await this.requestAccountOrganization.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_ORG}`
    );
    await this.requestAccountFullName.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_USER}`
    );
    await this.submitRequestBtn.click();
  }

  async requestPaywallAccess(tab) {
    await tab.click();
    await expect(this.premiumFeatureNote).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.requestPaywallAccessBtn.click();
    await this.fillRequestAccountFormOnPaywalls();
  }

  async requestPaywallAccessWithApprovedEmail(tab) {
    await tab.click();
    await expect(this.premiumFeatureNote).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.requestPaywallAccessBtn.click();
    await this.fillRequestAccountFormOnPaywallsApprovedEmail();
    await expect(this.approvedAccountAccessNote).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.closeApprovedAccessNoteModalBtn.click();
  }

  async fillRequestAccountFormOnPaywallsApprovedEmail() {
    await this.requestAccountEmail.fill(
      `${process.env.SHIPPER_VIZ_USER_APPROVED_EMAIL}`
    );
    await this.requestAccountOrganization.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_ORG}`
    );
    await this.requestAccountFullName.fill(
      `${process.env.SHIPPER_VIZ_USER_REQUEST_USER}`
    );
    await this.submitRequestBtn.click();
  }

  async searchShipmentonShipperViz() {
    await this.signUpSearchShipment.fill('S00016721');
    await this.trackShipmentBtn.click();
    await this.shipmentCardResult.click();
    await expect(this.shipmentRoute).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async signUpOnShipperVizPaywalls() {
    await this.seeContainerDetails.click();
    await this.fillRequestAccountFormOnPaywalls();
    await this.requestPaywallAccess(this.documentsPaywall);
    await this.requestPaywallAccess(this.costPerSKUPaywall);
    await this.requestPaywallAccess(this.invoicesToPayPaywall);
    await this.requestPaywallAccess(this.containerUtilizationPaywall);
    await this.requestPaywallAccess(this.exceptionManagementsPaywall);
  }

  async checkShipperVizSignUpPaywallAccess() {
    await this.shipperUserSearchBar.fill(
      `${process.env.SHIPPER_VIZ_USER_PAYWALL_REQUEST_EMAIL}`
    );
    await this.page.waitForSelector(
      `text=${process.env.SHIPPER_VIZ_USER_PAYWALL_REQUEST_EMAIL}`
    );
    const shipperUserSearchResults = await this.page
      .locator(`text=${process.env.SHIPPER_VIZ_USER_PAYWALL_REQUEST_EMAIL}`)
      .textContent();
    expect(shipperUserSearchResults).toContain(
      process.env.SHIPPER_VIZ_USER_PAYWALL_REQUEST_EMAIL
    );

    const signUpFormCellCSSLocator = await this.page.locator(
      'p.MuiTypography-root.MuiTypography-body1.css-uv7mby'
    );
    const signUpFormCellCSSText = await signUpFormCellCSSLocator.textContent();
    const expectedFeatures = [
      'PaywallFeature.CONTAINER_DETAILS',
      'PaywallFeature.CONTAINER',
      'PaywallFeature.DOCUMENTS',
      'PaywallFeature.EXCEPTIONS_MANAGEMENT',
      'PaywallFeature.INVOICES',
      'PaywallFeature.COST_PER_SKU',
    ];
    expectedFeatures.forEach((paywallFeature) => {
      expect(signUpFormCellCSSText).toContain(paywallFeature);
    });
  }

  async signUpOnShipperVizPaywallsWithApprovedEmail() {
    await this.requestPaywallAccessWithApprovedEmail(this.documentsPaywall);
    await this.requestPaywallAccessWithApprovedEmail(this.costPerSKUPaywall);
    await this.requestPaywallAccessWithApprovedEmail(this.invoicesToPayPaywall);
    await this.requestPaywallAccessWithApprovedEmail(
      this.containerUtilizationPaywall
    );
    await this.requestPaywallAccessWithApprovedEmail(
      this.exceptionManagementsPaywall
    );
  }
}
