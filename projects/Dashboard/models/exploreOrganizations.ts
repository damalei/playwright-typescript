import { Locator, Page, expect } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { GlobalFilterSection } from './globalFilterSection';

export class ExploreOrganizations {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnOrganization: Locator;
  readonly seePayableInvoices: Locator;
  readonly defaultOrgType: Locator;
  readonly orgTypeSelector: Locator;
  readonly orgTypeOpen: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page.getByTestId('org_name').first();
    this.columnOrganization = page.getByTestId('table-header-org_name');
    this.seePayableInvoices = page.getByTestId('see_payable_invoices').first();
    this.orgTypeSelector = page.getByTitle('ORG TYPE').getByLabel('Open');
    this.defaultOrgType = page.locator(
      'input[role="combobox"][aria-autocomplete="list"][value="Local Client"]'
    );
    this.orgTypeOpen = page.getByTitle('ORG TYPE').getByLabel('Open')
  }
  async goto() {
    await this.page.goto(
      FREIGHT_BI_BASE_URL + '/explore/explore-organizations'
    );
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }

  async clickOrganizationsSeePayableInvoices() {
    await this.seePayableInvoices.scrollIntoViewIfNeeded();
    await this.seePayableInvoices.click();
  }

  async checkOrganizationsDefaultOrgTypeSelector(
    expectedOrgType: string = 'Local Client'
  ) {
    await expect(this.defaultOrgType).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(this.defaultOrgType).toHaveValue(expectedOrgType);
  }

  async orgTypeUnitSelector(orgType: string) {
    await this.orgTypeSelector.click();
    const orgTypeValue = this.page.locator(`text=${orgType}`);
    await orgTypeValue.click();
  }
  async getDrilldownOrganizationParsedAmounts(
    locatorSelector: string
  ): Promise<number> {
    const amountLocator = this.page.locator(locatorSelector);
    const rawAmount = await amountLocator.textContent();
    return rawAmount ? parseFloat(rawAmount.replace(/[,]/g, '').trim()) : NaN;
  }

  async getOrganizationsTotalExpensesExclTaxAmount(): Promise<{
    totalExpensesExclTaxAmount: number;
  }> {
    const totalExpensesExclTaxAmount =
      await this.getDrilldownOrganizationParsedAmounts(
        'td[data-testid="table-body-0-total_expenses"] p'
      );
    return { totalExpensesExclTaxAmount };
  }

  async getDrilldownOrganizationsInvoiceExclTaxSumAmount(): Promise<{
    invoiceExclTaxSumAmount: number;
  }> {
    const invoiceExclTaxSumAmount =
      await this.getDrilldownOrganizationParsedAmounts(
        'p[data-testid="table-aggregate-amount-sum"]'
      );
    return { invoiceExclTaxSumAmount };
  }
  async compareDrilldownResultsAmount(
    totalExpensesExclTaxAmount: number,
    invoiceExclTaxSumAmount: number,
    note: string = ''
  ): Promise<void> {
    console.log(
      `Comparing the ${note}: ${totalExpensesExclTaxAmount} = ${invoiceExclTaxSumAmount}`
    );
    expect(totalExpensesExclTaxAmount).toBe(invoiceExclTaxSumAmount);
  }

  async setOrgtype(page: Page, orgType: string) {
    await this.orgTypeOpen.click()
    await page.getByRole('option', {name: orgType}).click()
}

}
