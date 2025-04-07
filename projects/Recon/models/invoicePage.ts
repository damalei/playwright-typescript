import { Locator, Page } from '@playwright/test';

export class InvoicePage {
  readonly page: Page;
  readonly buttonReprocess: Locator;
  readonly linkBreadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonReprocess = this.page.getByRole('button', {
      name: 'Re-process via Expedock',
    });
    this.linkBreadcrumb = this.page.getByRole('link', {
      name: 'Reconciliation Results',
    });
  }
}

export class ReprocessModal {
  readonly page: Page;
  readonly inputCorrectInformation: Locator;
  readonly buttonReprocess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputCorrectInformation = page.getByPlaceholder('Enter information');
    this.buttonReprocess = page.getByRole('button', { name: 'Re-process' });
  }
}
