import { Locator, expect, Page } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class reconDashboard {
  readonly page: Page;
  readonly reconDashboardLink: Locator;
  readonly reconBreadcrumb: Locator;
  readonly sortTabByAssignedTo: Locator;
  readonly sortTabByVendor: Locator;
  readonly reconAppJobLink: Locator;
  readonly inputSearch: Locator;
  readonly tabToDo: Locator;
  readonly tabForExpedock: Locator;
  readonly tabForOtherUsers: Locator;
  readonly reconViewDocumentsTab: Locator;
  readonly reconViewAccrualTab: Locator;
  readonly reconViewNotesTab: Locator;
  readonly firstReconShipmentReference: Locator;
  readonly reconPageReassignBtn: Locator;
  readonly reconPageReassignToUserList: Locator;
  readonly searchReconJobOrReference: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reconDashboardLink = this.page.getByRole('link', {
      name: 'To-Do Dashboard',
    });
    this.reconBreadcrumb = this.page.getByRole('link', {
      name: 'Reconciliation Results',
    });
    this.sortTabByAssignedTo = this.page.getByRole('button', {
      name: 'Assigned to',
    });
    this.sortTabByVendor = this.page.getByRole('button', { name: 'Vendor' });
    this.reconAppJobLink = this.page.getByRole('link', {
      name: 'https://app.expedock.com/',
    });
    this.inputSearch = this.page.getByPlaceholder(
      'Enter an invoice or reference number'
    );
    this.tabToDo = this.page.getByRole('tab', {
      name: 'To Do',
      exact: true,
    });
    this.tabForExpedock = this.page.getByRole('tab', {
      name: 'For Expedock',
      exact: true,
    });
    this.tabForOtherUsers = this.page.getByRole('tab', {
      name: 'For Other Users',
      exact: true,
    });
    this.reconViewDocumentsTab = page.getByRole('tab', {
      name: 'View Documents',
      selected: true,
    });
    this.reconViewAccrualTab = page.getByRole('tab', { name: 'Accrual' });
    this.reconViewNotesTab = page.getByRole('tab', { name: 'Notes' });
    this.reconViewDocumentsTab = page.getByRole('tab', {
      name: 'View Documents',
      selected: true,
    });
    this.reconViewAccrualTab = page.getByRole('tab', { name: 'Accrual' });
    this.reconViewNotesTab = page.getByRole('tab', { name: 'Notes' });
    this.firstReconShipmentReference = page
      .locator('a.MuiStack-root.css-377j2d')
      .first();
    this.reconPageReassignBtn = page.getByRole('button', { name: 'Re-assign' });
    this.reconPageReassignToUserList = page.getByRole('combobox', {
      name: 'Reassign to*',
    });
    this.searchReconJobOrReference = page.getByRole('textbox', {
      name: 'Enter an invoice or reference',
    });
  }

  async gotoReconDashboard() {
    await this.reconDashboardLink.click();
    await this.waitForPageLoad(this.page);
    await expect(
      this.page.locator('div').filter({ hasText: /^Reconciliation Results$/ })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect(
      this.page.getByRole('button', { name: 'Export “To Do” tab' })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  }

  async clickJobLink() {
    await this.waitForTableToLoad(this.page);

    const jobLinks = this.page.locator(
      'table.css-o13epf-table tbody tr td:first-child a'
    );

    const linkCount = await jobLinks.count();

    if (linkCount === 0) {
      throw new Error('No job links found in the table.');
    }

    for (let i = 0; i < linkCount; i++) {
      const link = jobLinks.nth(i);
      if (await link.isVisible()) {
        await link.click();
        await this.waitForPageLoad(this.page);

        await expect(
          this.page.getByRole('heading', { name: 'Reconciliation Summary' })
        ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

        return jobLinks;
      }
    }

    throw new Error('No visible job links available to click.');
  }

  async waitForTableToLoad(page: Page) {
    await page.waitForSelector('table.css-o13epf-table tbody', {
      state: 'visible',
    });
    const rows = await page.locator('table.css-o13epf-table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  }

  async waitForPageLoad(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body', { state: 'visible' });
    try {
      await page.waitForLoadState('networkidle', { timeout: 3000 });
    } catch (e) {}
    await page.waitForSelector('body', { state: 'visible' });
    await page.waitForSelector('img', { state: 'attached' }).catch(() => {});
  }

  async clickReconBreadcrumb() {
    await this.reconBreadcrumb.click();
    await this.waitForTableToLoad(this.page);
    const isTodoActive = await this.isTodoTabActive(this.page);
    if (!isTodoActive) {
      throw new Error('The To-Do tab is not selected!');
    }
    await expect(
      this.page.locator('div').filter({ hasText: /^Reconciliation Results$/ })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect(
      this.page.getByRole('button', { name: 'Export “To Do” tab' })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  }

  async isTodoTabActive(page: Page): Promise<boolean> {
    const todoTab = page.getByRole('tab', { name: 'To Do', selected: true });
    return await todoTab.isVisible();
  }

  async clickTab(page: Page, tabName: string) {
    await page
      .getByRole('tab', { name: new RegExp(`^${tabName}\\s*\\d*\\+?$`, 'i') })
      .click();
    await this.waitForPageLoad(page);
  }

  async expectExportButtonVisible(page: Page, tabName: string) {
    const exportButtonName = `Export “${tabName}” tab`;
    await expect(
      page.getByRole('button', { name: exportButtonName })
    ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  }
  async loginToReconDashboard(username: string, password: string) {
    await this.page.goto(`https://${process.env.ENV}-dashboard.expedock.com`);
    await this.page.locator('#username').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page
      .getByRole('button', { name: 'Continue', exact: true })
      .click();
    await this.page.waitForURL('https://passive-dashboard.expedock.com/**/');
    await expect(this.page.getByTestId('account-user-name')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async searchJob(invoiceNumber: string) {
    await this.inputSearch.fill(invoiceNumber);
  }

  async clickInvoice(tab: Locator, jobReference: string) {
    try {
      await tab.click({ timeout: 5000 });
    } catch (error) {
      console.error('Failed to click tab:', error);
    }
    await this.page.locator(`//a[text()='${jobReference}']`).click();
  }

  async clickReconViewAccrualTab() {
    const waitForNetworkIdle = async (timeout: number) => {
      try {
        await this.page.waitForLoadState('networkidle', { timeout });
      } catch (e) {}
    };
    await this.reconViewAccrualTab.click();
    await waitForNetworkIdle(1000);
  }

  async clickReconViewNotesTab() {
    const waitForNetworkIdle = async (timeout: number) => {
      try {
        await this.page.waitForLoadState('networkidle', { timeout });
      } catch (e) {}
    };
    await this.reconViewNotesTab.click();
    await waitForNetworkIdle(1000);
  }
  async getFirstReconJobLinkText(
    page: Page,
    timeout = 2000
  ): Promise<string | null> {
    try {
      const jobLocator = page
        .locator('table.css-o13epf-table tbody tr td:first-child a')
        .first();
      await jobLocator.waitFor({ state: 'visible', timeout });
      const jobText = await jobLocator.textContent();
      return jobText;
    } catch (error) {
      console.error('Failed to get job text:', error);
      return null;
    }
  }

  async reassignReconJob(page: Page, userEmail: string) {
    await this.firstReconShipmentReference.click();
    await this.reconPageReassignBtn.click();
    await this.reconPageReassignToUserList.fill(userEmail);
    await page.getByRole('option', { name: userEmail }).click();
    await this.reconPageReassignBtn.click();
  }

  async verifyReassignedJob(
    page: Page,
    jobText: string | null,
    recon: reconDashboard,
    userEmail: string
  ) {
    await this.searchReconJobOrReference.fill(jobText || '');
    await expect(this.searchReconJobOrReference).toHaveValue(jobText || '');
    await recon.clickTab(page, 'For Other Users');
    await expect(page.getByRole('cell', { name: jobText || '' })).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(page.getByRole('cell', { name: userEmail })).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }
}
