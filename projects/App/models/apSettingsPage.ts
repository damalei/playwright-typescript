import { Locator, Page } from '@playwright/test';
import path from 'path';

export class ApSettingsPage {
  readonly page: Page;
  readonly toggleAutoPostExactMatch: Locator;
  readonly buttonSave: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleAutoPostExactMatch = page.locator(
      'input[name="autoReconAutoPostIfMatch"]'
    );
    this.buttonSave = page.getByRole('button', { name: 'Save' });
  }

  async goto() {
    await this.page.goto(
      `https://${process.env.ENV}-app.expedock.com/${process.env.AP_PAGE_SETTING}`
    );
    await this.page.waitForTimeout(10000);
  }

  async toggleIfOff(page: Page, locator: Locator) {
    const isEnabled = await locator.isChecked();
    if (!isEnabled) {
      await locator.click();
    }
  }

  async toggleIfOn(page: Page, locator: Locator) {
    const isEnabled = await locator.isChecked();
    if (isEnabled) {
      await locator.click();
    }
  }

  async saveSettings() {
    await this.buttonSave.click();
    await this.page
      .getByText('Saving successful')
      .waitFor({ state: 'visible' });
  }
}
