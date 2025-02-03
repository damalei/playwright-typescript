import { Locator, Page, expect } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { GlobalFilterSection } from './globalFilterSection';

export class ExplorePayableInvoices {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnInvoiceNumber: Locator;
  readonly payableInvoicePageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page.getByTestId('invoice_number').first();
    this.columnInvoiceNumber = page.getByTestId('table-header-invoice_number');
    this.payableInvoicePageHeader = page.locator(
      'h5[data-testid="header-title"]'
    );
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/payable-invoices');
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
  async checkPayableInvoicePageHeader(expectedHeader = 'Payable Invoices') {
    await expect(this.payableInvoicePageHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(this.payableInvoicePageHeader).toHaveText(expectedHeader);
  }
}
