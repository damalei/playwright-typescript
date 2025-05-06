import { Locator, Page } from '@playwright/test';
import { APP_BASE_URL } from '../../constants';

export class DataSync {
  readonly page: Page;
  readonly inputShipment: Locator;
  readonly inputJobID: Locator;
  readonly buttonTriggerSync: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputShipment = this.page.locator(
      '//input[@aria-label="Reference No"]'
    );
    this.inputJobID = this.page
      .getByLabel('Job ID')
      .locator('..')
      .locator('input');
    this.buttonTriggerSync = this.page.getByRole('button', {
      name: 'Trigger auto recon',
    });
  }

  async goto() {
    await this.page.goto(APP_BASE_URL + 'admin/data/sync');
  }

  async triggerSync(jobID: string) {
    await this.inputJobID.fill(jobID);
    await this.buttonTriggerSync.click();
    const modal = new DataSyncModal(this.page);
    await modal.buttonOk.click();
    await this.page.waitForTimeout(5000);
  }

  extractLastPathSegment(url: string): string {
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex === -1) return '';
    return url.substring(lastSlashIndex + 1).trim();
  }
}

export class DataSyncModal {
  readonly page: Page;
  readonly buttonOk: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonOk = this.page.getByRole('button', { name: 'OK' });
  }
}
