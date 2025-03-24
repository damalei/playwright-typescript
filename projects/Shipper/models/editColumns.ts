import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';

export class EditColumns {
  readonly page: Page;
  readonly showAllBtn: Locator;
  readonly disableAllBtn: Locator;
  readonly editColumnButton: Locator;
  readonly sortForwarderReference: Locator;
  readonly editColumnsBtn: Locator;
  readonly editColumnPopper: Locator;
  readonly findTableColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.showAllBtn = page.getByRole('button', { name: 'Show All' });
    this.disableAllBtn = page.getByRole('button', { name: 'Disable All' });
    this.editColumnButton = page.getByRole('button', { name: 'Edit Columns' });
    this.sortForwarderReference = page.getByRole('columnheader', {
      name: 'Forwarder Reference',
    });
    this.editColumnsBtn = page.getByRole('button', { name: 'Edit Columns' });
    this.editColumnPopper = page.getByTestId('edit-columns-popper');
    this.findTableColumn = page.getByPlaceholder('Find column');
  }
  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="login-button"]');
  }
  async exploreContainersOnlyFrozenColumnsVisible(page) {
    const visibleColumns = (await page.locator('th:visible').allTextContents())
      .map((text) => text.trim())
      .filter((text) => text !== '');
    console.log('Detected Visible Columns:', visibleColumns);
    const expectedColumns = ['Container', 'Shipment Forwarder Reference'];
    await expect(visibleColumns).toEqual(expectedColumns);
  }

  async checkNoHiddenColumns(page: Page) {
    const hiddenColumnLocators = page.locator(
      'svg[data-testid="VisibilityOffIcon"]'
    );
    const hiddenColumnCount = await hiddenColumnLocators.count();
    console.log(`Hidden columns found: ${hiddenColumnCount}`);
    expect(hiddenColumnCount).toBe(0);
    console.log('All columns are shown, no hidden columns');
  }

  async checkVisibleTableHeaders() {
    const columnHeaders = await this.page
      .getByRole('columnheader')
      .allInnerTexts();
    console.log('Visible Table Headers:', columnHeaders);
    expect(columnHeaders.length).toBeGreaterThan(0);

    const headersVisibility = await this.page
      .getByRole('columnheader')
      .evaluateAll((els) =>
        els.map((el) => window.getComputedStyle(el).display !== 'none')
      );
    expect(headersVisibility.some((visible) => visible)).toBeTruthy();
  }

  async checkAllVisibleColumns(page: Page) {
    const visibleColumnLocators = page.locator(
      'svg[data-testid="VisibilityIcon"]'
    );
    const visibleColumnCount = await visibleColumnLocators.count();

    console.log(` Visible columns found: ${visibleColumnCount}`);

    expect(visibleColumnCount).toBeGreaterThan(0);
  }

  async waitForPageLoad(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('body', { state: 'visible' });
    try {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (e) {}
    await page.waitForSelector('body', { state: 'visible' });
    await page.waitForSelector('img', { state: 'attached' }).catch(() => {});
  }
  async openEditColumns(): Promise<void> {
    await this.editColumnsBtn.click();
    await expect(this.editColumnPopper).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async closeEditColumns(): Promise<void> {
    await this.editColumnsBtn.click();
    await expect(this.editColumnPopper).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async findColumn(columnName: string): Promise<void> {
    await this.findTableColumn.fill(columnName);
  }

  async getVisibilityEyeIcon(columnName: string): Promise<Locator> {
    const columnDiv = this.page.locator('div').filter({ hasText: columnName });
    const visibilityOffIcon = columnDiv.locator(
      'svg[data-testid="VisibilityOffIcon"]'
    );
    const visibilityIcon = columnDiv.locator(
      'svg[data-testid="VisibilityIcon"]'
    );

    if (
      await visibilityOffIcon
        .first()
        .isVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS })
    ) {
      return visibilityOffIcon;
    }
    if (
      await visibilityIcon
        .first()
        .isVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS })
    ) {
      return visibilityIcon;
    }

    throw new Error(`No visibility icon found for column: ${columnName}`);
  }

  async toggleTableColumnVisibilityEyeIcon(columnName: string): Promise<void> {
    await this.findColumn(columnName);
    const currentEyeIcon = await this.getVisibilityEyeIcon(columnName);
    const currentEyeIconValueChecker = await currentEyeIcon
      .first()
      .getAttribute('data-testid');
    const expectedEyeIconValue =
      currentEyeIconValueChecker === 'VisibilityOffIcon'
        ? 'VisibilityIcon'
        : 'VisibilityOffIcon';

    await expect(currentEyeIcon.first()).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await currentEyeIcon.first().click();

    const columnDiv = this.page.locator('div').filter({ hasText: columnName });
    const expectedVisibilityEyeIcon = columnDiv.locator(
      `svg[data-testid="${expectedEyeIconValue}"]`
    );
    await expect(expectedVisibilityEyeIcon.first()).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });

    console.log(
      `Toggled visibility for column "${columnName}": Now showing "${expectedEyeIconValue}".`
    );
  }

  async checkTableColumnVisibility(
    columnName: string,
    isVisible: boolean
  ): Promise<void> {
    const columnHeader = this.page.locator(`th:has-text("${columnName}")`);

    if (isVisible) {
      await expect(columnHeader).toBeVisible();
      await columnHeader.scrollIntoViewIfNeeded();
      console.log(`Column "${columnName}" is now visible in the table.`);
    } else {
      await expect(columnHeader).not.toBeVisible();
      console.log(`Column "${columnName}" is not visible in the table.`);
    }
  }

  async addTableColumn(columnName: string): Promise<void> {
    await this.closeEditColumns();
    await this.checkTableColumnVisibility(columnName, true);
  }

  async removeTableColumn(columnName: string): Promise<void> {
    await this.closeEditColumns();
    await this.checkTableColumnVisibility(columnName, false);
  }
}
