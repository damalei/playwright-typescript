import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import {
  DEFAULT_TIMEOUT_IN_MS,
  FREIGHT_BI_BASE_URL,
  __saveFilePath,
} from '../../constants';
import { GlobalFilterSection } from './globalFilterSection';

export class ExploreReceivableInvoices {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnInvoiceNumber: Locator;
  readonly jobNumber: Locator;
  readonly exportToExcel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page.getByTestId('invoice_number').first();
    this.columnInvoiceNumber = page.getByTestId('table-header-invoice_number');
    this.jobNumber = page.getByTestId('job_numbers').first();
    this.exportToExcel = page.getByTestId('export-explore-receivable-btn');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/receivable-invoices');
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }

  async clickExportToExcel() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.exportToExcel.click();
    const download = await downloadPromise;
    await download.saveAs(
      __saveFilePath + 'Explore_' + download.suggestedFilename()
    );
    await this.page.waitForTimeout(60000);
  }
}
