import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { GlobalFilterSection } from './globalFilterSection';

export class ExploreReceivableInvoices {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnInvoiceNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page.getByTestId('invoice_number').first();
    this.columnInvoiceNumber = page.getByTestId('table-header-invoice_number');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/receivable-invoices');
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
}
