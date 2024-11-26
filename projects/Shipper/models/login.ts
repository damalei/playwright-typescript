import { Locator, Page } from '@playwright/test';
import { SHIPPER_VIZ_BASE_URL } from '../../constants';

export class LoginPage {
  readonly page: Page;
  readonly loginBtn: Locator;
  readonly forgotPwdLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.forgotPwdLink = page.getByRole('link', { name: 'Forgot Password' });
    this.loginBtn = page.getByRole('button', { name: 'LOG IN' });
  }

  async goto() {
    await this.page.goto(SHIPPER_VIZ_BASE_URL + '/login');
    await this.forgotPwdLink.waitFor({ state: 'visible' });
  }
}
