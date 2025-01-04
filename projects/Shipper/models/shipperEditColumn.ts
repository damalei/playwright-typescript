import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';

export class EditTableColumns {
  private readonly page: Page;
  private readonly editColumnsBtn: Locator;
  private readonly editColumnPopper: Locator;
  private readonly findTableColumn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editColumnsBtn = page.getByRole('button', { name: 'Edit Columns' });
    this.editColumnPopper = page.getByTestId('edit-columns-popper');
    this.findTableColumn = page.getByPlaceholder('Find column');
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
