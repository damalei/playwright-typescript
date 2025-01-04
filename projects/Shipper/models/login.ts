import { Locator, Page, expect } from '@playwright/test';
import { SHIPPER_VIZ_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class LoginPage {
  readonly page: Page;
  readonly loginBtn: Locator;
  readonly forgotPwdLink: Locator;
  readonly loginEmail: Locator;
  readonly loginPass: Locator;
  readonly exceptionManagementHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.forgotPwdLink = page.getByRole('link', { name: 'Forgot Password' });
    this.loginBtn = page.getByRole('button', { name: 'LOG IN' });
    this.loginEmail = page.getByLabel('Email Address');
    this.loginPass = page.getByLabel('Password');
    this.exceptionManagementHeader = page.getByTestId(
      'exceptions-management-header'
    );
  }

  async goto() {
    await this.page.goto(SHIPPER_VIZ_BASE_URL + '/login');
    await this.forgotPwdLink.waitFor({ state: 'visible' });
  }

  async loginToShipper() {
    await this.loginEmail.fill(`${process.env.SHIPPER_VIZ_CLIENT_USER}`);
    await this.loginPass.fill(`${process.env.SHIPPER_VIZ_CLIENT_PASS}`);
    await this.loginBtn.click();
    await expect(this.exceptionManagementHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }
}
