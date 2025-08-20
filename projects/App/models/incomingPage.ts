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
  readonly emailFilterMenuButton: Locator;
  readonly emailFilterAddButton: Locator;
  readonly emailDateReceivedFilter: Locator;
  readonly emailDateReceivedOperation: Locator;
  readonly emailJobStatusFilter: Locator;
  readonly emailJobStatusOperation: Locator;
  readonly emailJobStatusValue: Locator;
  readonly emailJobTypeFilter: Locator;
  readonly emailJobTypeOperation: Locator;
  readonly emailJobTypeValue: Locator;
  readonly ingestedEmailSearch: Locator;
  readonly deleteEmailFilter: Locator;

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
    this.emailFilterMenuButton = page.getByTestId('email-filter-menu-button');
    this.emailFilterAddButton = page.getByTestId('email-filter-add-button');
    this.emailDateReceivedFilter = page.getByTestId(
      'add-email-filter-EMAIL_DATE_RECEIVED'
    );
    this.emailDateReceivedOperation = page.getByRole('combobox').nth(4);
    this.emailJobStatusFilter = page.getByTestId('add-email-filter-JOB_STATUS');
    this.emailJobStatusOperation = page.locator(
      'div:nth-child(4) > .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.css-1529hcj-emailFilterOperationField > .MuiSelect-select'
    );
    this.emailJobStatusValue = page
      .getByTestId('email-filter-value-JOB_STATUS')
      .getByRole('combobox');
    this.emailJobTypeFilter = page.getByTestId('add-email-filter-JOB_TYPE');
    this.emailJobTypeOperation = page.locator(
      'div:nth-child(5) > .MuiInputBase-root.MuiOutlinedInput-root.MuiInputBase-colorPrimary.css-1529hcj-emailFilterOperationField > .MuiSelect-select'
    );
    this.emailJobTypeValue = page
      .getByTestId('email-filter-value-JOB_TYPE')
      .locator('div')
      .nth(1);
    this.ingestedEmailSearch = page
      .getByTestId('email-filters')
      .getByRole('button')
      .first();
    this.deleteEmailFilter = page.getByTestId('delete-email-filter');
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

  async parseEmailDateString(emailDateText: string): Promise<Date | null> {
    const match = emailDateText.match(
      /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/
    );
    if (!match) return null;

    const [, month, day, year, hour, minute, second] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  }

  async validateEmailDatesWithFilterApplied(
    filterDate: Date
  ): Promise<
    Array<{ emailDate: Date; isValid: boolean; originalText: string }>
  > {
    const emailDateElements = this.page.locator(
      '[data-testid="email-received-date"], .email-received-date, td:nth-child(4)'
    );
    const emailDates = await emailDateElements.allTextContents();
    const results: Array<{
      emailDate: Date;
      isValid: boolean;
      originalText: string;
    }> = [];

    for (const emailDateText of emailDates) {
      if (!emailDateText?.trim()) continue;

      const emailDate = await this.parseEmailDateString(emailDateText);
      if (emailDate) {
        results.push({
          emailDate,
          isValid: emailDate.getTime() < filterDate.getTime(),
          originalText: emailDateText,
        });
      }
    }

    return results;
  }

  async setupDateAndTimeReceivedFilter(): Promise<string> {
    await this.emailDateReceivedFilter.click();
    await this.emailDateReceivedOperation.click();
    await this.page.getByRole('option', { name: 'before' }).click();

    const dateTimeInput = this.page.locator(
      'input[name="dateTime"][type="datetime-local"]'
    );
    await dateTimeInput.waitFor({ state: 'visible', timeout: 5000 });

    const currentDateTime = new Date().toISOString().slice(0, 16);
    await dateTimeInput.fill(currentDateTime);

    return currentDateTime;
  }

  async addJobStatusFilter(jobStatus: string): Promise<void> {
    await this.emailJobStatusFilter.click();
    await this.emailJobStatusOperation.click();
    await this.page.getByRole('option', { name: 'contains' }).click();
    await this.emailJobStatusValue.click();
    await this.page.getByRole('option', { name: jobStatus }).click();
  }

  async addJobTypeFilter(jobType: string): Promise<void> {
    await this.emailJobTypeFilter.click();
    await this.emailJobTypeOperation.click();
    await this.page.getByRole('option', { name: 'contains' }).click();
    await this.emailJobTypeValue.click();
    await this.page.getByRole('option', { name: jobType }).click();
  }
}
