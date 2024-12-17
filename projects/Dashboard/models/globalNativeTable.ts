import { Locator, Page } from '@playwright/test';

export class GlobalNativeTable {
  readonly page: Page;
  readonly columnHeader: Locator;
  readonly table: Locator;
  readonly editColumnButton: Locator;
  readonly editDisableAll: Locator;
  readonly editShowAll: Locator;
  readonly saveButton: Locator;
  readonly tableBody: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.columnHeader = page.locator(
      `//*[contains(@data-testid, "table-header-")]`
    );
    this.table = page.getByTestId('table');
    this.editColumnButton = page.getByRole('button', { name: 'Edit Columns' });
    this.editDisableAll = page.getByRole('button', { name: 'Disable All' });
    this.editShowAll = page.getByRole('button', { name: 'Show All' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.tableBody = page.getByTestId('table-body')
    this.footer = page.getByTestId('filtered-shipments-footer')
  }

  async getColumnElements() {
    return await this.columnHeader.all();
  }

  async clickColumnName(element: Locator) {
    const headerName = await element.innerText();
    await element.click();
    return headerName;
  }

  async clickColumnHeader(columnName: string){
    await this.page.locator('span', { hasText: `${columnName}`}).scrollIntoViewIfNeeded
    await this.page.locator('span', { hasText: `${columnName}`}).click()
  }

  async parseCellAmount( rowNum: number, columnTestID: string) {
    const amount = await this.tableBody.getByTestId(`table-body-${rowNum}-${columnTestID}`).locator('p').textContent() || "0"
    return parseFloat(amount.replace('$', '').trim())
  }

  async clickDrillDownLink( rowNum: number, linkName: string) {
    await this.page.getByTestId(`table-body-${rowNum}`).getByText(linkName).click()
  }

  async parseSumAmount( columnTestID: string, data: string) {
    const amount = await this.tableBody.getByTestId(`table-aggregate-${columnTestID}`).getByText(data).locator("//following-sibling::*[1]").textContent() || "0"
    return parseFloat(amount.replace('$', '').trim())
  }

  async parseFooterCount() {
    const amount = await this.footer.locator('p').nth(0).textContent() || "0"
    return parseFloat(amount.replace('Shipments', '').trim())
  }

  async evalDiff( data1: number, data2: number) {
    const diff = Math.abs(data1-data2)
    if (diff < 1) {
      return true
    } else {
      return false
    }
  }
}
