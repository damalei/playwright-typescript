import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { FREIGHT_BI_BASE_URL } from '../../constants';

const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class ExplorePayableInvoices {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly referenceComponent: Locator;
  readonly columnInvoiceNumber: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.referenceComponent = page.getByTestId('invoice_number').first();
    this.columnInvoiceNumber = page.getByTestId('table-header-invoice_number');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/payable-invoices');
    await waitforTablePageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
}
