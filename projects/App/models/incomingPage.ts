import { Locator, Page } from '@playwright/test';

export class IncomingPage {
  readonly page: Page;
  readonly buttonViewJobFirstRow: Locator;
  readonly buttonViewTaskFirstRow: Locator;
  readonly companyDropdownIncomingPage: Locator;
  readonly companyOptionIncomingPage: Locator;
  readonly closeButtonTaskCard: Locator;
  readonly emailIngestTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonViewJobFirstRow = page
      .getByTestId('table-body-0-ACTIONS')
      .getByRole('link', { name: 'View job' });
    this.buttonViewTaskFirstRow = page
      .getByTestId('table-body-0-ACTIONS')
      .getByText('View task');
    this.companyDropdownIncomingPage = page.getByRole('combobox', {
      name: 'Company',
    });
    this.closeButtonTaskCard = page.getByTestId('close-btn').locator('path');
    this.emailIngestTab = page.getByRole('tab', { name: 'Email Ingest' });
  }

  async selectCompany(companyName: string): Promise<void> {
    await this.companyDropdownIncomingPage.click();
    await this.companyDropdownIncomingPage.fill(companyName);
    const companyOptionIncomingPage = this.page.getByRole('option', {
      name: companyName,
    });
    await companyOptionIncomingPage.click();
  }

  async navigateToIncomingPage(): Promise<void> {
    await this.page.getByTestId('incoming-button').click();
    await this.page.waitForURL(/.*\/email-processing#/);
  }
}
