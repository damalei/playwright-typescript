import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad, waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

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
    this.tableBody = page.getByTestId('table-body');
    this.footer = page.getByTestId('filtered-shipments-footer');
  }

  async getColumnElements() {
    return await this.columnHeader.all();
  }

  async clickColumnName(element: Locator) {
    const headerName = await element.innerText();
    await element.click();
    return headerName;
  }

  async clickColumnHeader(columnName: string) {
    await this.page.locator('span', { hasText: `${columnName}` })
      .scrollIntoViewIfNeeded;
    await this.page.locator('span', { hasText: `${columnName}` }).click();
  }

  async parseCellAmount(rowNum: number, columnTestID: string) {
    const amount =
      (await this.tableBody
        .getByTestId(`table-body-${rowNum}-${columnTestID}`)
        .locator('p')
        .textContent()) || '0';
    return parseFloat(amount.replace('$', '').trim());
  }

  async clickDrillDownLink(rowNum: number, linkName: string) {
    await this.page
      .getByTestId(`table-body-${rowNum}`)
      .getByText(linkName)
      .click();
  }

  async parseSumAmount(columnTestID: string, data: string) {
    const amount =
      (await this.tableBody
        .getByTestId(`table-aggregate-${columnTestID}`)
        .getByText(data)
        .locator('//following-sibling::*[1]')
        .textContent()) || '0';
    return parseFloat(amount.replace('$', '').trim());
  }

  async parseFooterCount() {
    const amount = (await this.footer.locator('p').nth(0).textContent()) || '0';
    return parseFloat(amount.replace('Shipments', '').trim());
  }

  async evalDiff(data1: number, data2: number) {
    const diff = Math.abs(data1 - data2);
    if (diff < 1) {
      return true;
    } else {
      return false;
    }
  }

  async dragSourceToTargetColumn(
    page: Page,
    sourceIndex: number,
    targetIndex: number
  ) {
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const tableHeaderList = await this.page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
    const sourceName = tableHeaderList[sourceIndex]
      .replace(/\(.*?\)/g, '')
      .trim();
    const targetName = tableHeaderList[targetIndex]
      .replace(/\(.*?\)/g, '')
      .trim();
    console.log(sourceName);
    console.log(targetName);
    await this.editColumnButton.click();
    const columnPopper = this.page.getByTestId('edit-columns-popper');
    const source = columnPopper
      .locator(`//span[text()='${sourceName}']`)
      .locator('..')
      .locator('..')
      .locator('..');
    const target = columnPopper
      .locator(`//span[text()='${targetName}']`)
      .locator('..')
      .locator('..')
      .locator('..');
    await source.focus();
    await target.focus();
    await source.dragTo(target);
    await source.hover();
    await this.page.mouse.down();
    const box = (await target.boundingBox())!;
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await target.hover();
    await this.page.mouse.up();
    await this.editColumnButton.click();
    const newTableHeaderList = await this.page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
    return newTableHeaderList;
  }

  async swapColumns(page: Page, sourceIndex: number, targetIndex: number) {
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const tableHeaderList = await page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
    const temp = tableHeaderList[sourceIndex];
    tableHeaderList[sourceIndex] = tableHeaderList[targetIndex];
    tableHeaderList[targetIndex] = temp;
    return tableHeaderList;
  }
}
