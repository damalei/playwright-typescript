import { Locator, Page } from '@playwright/test';

export class IncomingPage {
  readonly page: Page;
  readonly buttonViewJobFirstRow: Locator;
  readonly buttonViewTaskFirstRow: Locator;
  readonly companyDropdownIncomingPage: Locator;
  readonly companyOptionIncomingPage: Locator;
  readonly closeButtonTaskCard: Locator;
  readonly emailIngestTab: Locator;
  readonly expandButtonFirstRow: Locator;
  readonly closeExpandButtonFirstRow: Locator;
  readonly firstEmailSubject: Locator;
  readonly expandedSubjectView: Locator;
  readonly expandedAttachment: Locator;
  readonly expandedDate: Locator;
  readonly expandedIframe: Locator;
  readonly emailTableRefreshButton: Locator;

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
    this.expandButtonFirstRow = page
      .locator('[data-testid^="email-row-"]')
      .getByTestId('KeyboardArrowDownIcon')
      .first();
    this.closeExpandButtonFirstRow = page
      .locator('[data-testid^="email-row-"]')
      .getByTestId('KeyboardArrowUpIcon')
      .first();
    this.firstEmailSubject = page.getByTestId('table-body-0-EMAIL_SUBJECT');
    this.expandedSubjectView = page
      .locator('[data-testid^="email-card-details-"]')
      .getByRole('cell');
    this.expandedAttachment = page
      .locator('[data-testid^="email-card-details-"]')
      .getByRole('cell')
      .first();
    this.expandedDate = page
      .locator('[data-testid^="email-card-details-"]')
      .getByRole('cell')
      .nth(1);
    this.expandedIframe = page.locator('iframe').first();
    this.emailTableRefreshButton = page.getByTestId(
      'email-table-refresh-button'
    );
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
