import { Locator, Page } from '@playwright/test';
import { APP_BASE_URL } from '../../constants';

export class JobTemplate {
  readonly page: Page;
  readonly inputShipment: Locator;
  readonly toggleAutoRecon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputShipment = this.page.locator(
      '//input[@aria-label="Reference No"]'
    );
    this.toggleAutoRecon = this.page
      .getByText('Auto-Recon: Enabled')
      .locator('..')
      .locator('input');
  }

  async gotoApJobTemplate() {
    await this.page.goto(
      APP_BASE_URL +
        'admin/company/7a92caba-2d47-4eec-9c97-5c471349c075/job-type/cfcd8f47-dad0-47ab-9ab8-bed7ea75e951'
    );
  }

  async enableAutoRecon() {
    await this.page.waitForTimeout(10000);
    const isEnabled = await this.toggleAutoRecon.isChecked();
    if (!isEnabled) {
      await this.toggleAutoRecon.click();
      await this.page.getByRole('button', { name: 'Save' }).click();
      await this.page
        .getByText('Saving Successful')
        .waitFor({ state: 'visible' });
    }
  }

  async disableAutoRecon() {
    await this.page.waitForTimeout(10000);
    const isEnabled = await this.toggleAutoRecon.isChecked();
    if (isEnabled) {
      await this.toggleAutoRecon.click();
      await this.page.getByRole('button', { name: 'Save' }).click();
      await this.page
        .getByText('Saving Successful')
        .waitFor({ state: 'visible' });
    }
  }
}
