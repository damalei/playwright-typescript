import { Locator, Page, expect } from '@playwright/test';

export class EditColumns {
  readonly page: Page;
  readonly showAllBtn: Locator;
  readonly disableAllBtn: Locator;
  readonly editColumnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.showAllBtn = page.getByRole('button', { name: 'Show All' });
    this.disableAllBtn = page.getByRole('button', { name: 'Disable All' });
    this.editColumnButton = page.getByRole('button', { name: 'Edit Columns' });
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
}
