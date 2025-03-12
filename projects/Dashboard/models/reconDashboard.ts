import { Locator, expect, Page } from '@playwright/test';
import {
  DEFAULT_TIMEOUT_IN_MS,
  DASHBOARD_TIMEOUT_IN_MS,
} from '../../constants';

export class reconDashboard {
  readonly page: Page;
  readonly reconDashboardLink: Locator;
  readonly reconBreadcrumb: Locator;
  readonly sortTabByAssignedTo: Locator;
  readonly sortTabByVendor: Locator;

  constructor(page: Page) {
    this.page = page;
    this.reconDashboardLink = page.getByRole('link', {
      name: 'To-Do Dashboard',
    });
    this.reconBreadcrumb = page.getByRole('link', {
      name: 'Reconciliation Results',
    });
    this.sortTabByAssignedTo = page.getByRole('button', {
      name: 'Assigned to',
    });
    this.sortTabByVendor = page.getByRole('button', { name: 'Vendor' });
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
          this.page.getByText(
            'Move to DoneRe-assignRe-process via ExpedockPost'
          )
        ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

        await expect(
          this.page.getByRole('heading', { name: 'Reconciliation Summary' })
        ).toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });

        return;
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
}
