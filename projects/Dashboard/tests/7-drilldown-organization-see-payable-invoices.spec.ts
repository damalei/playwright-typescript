import { test, expect, Page } from '@playwright/test';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';

const GLOBALTIMEOUT = 3000000;
let exploreOrganizations;
let explorePayableInvoices;

test.describe('Drilldown See Payable Invoices as different Org types', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
    exploreOrganizations = new ExploreOrganizations(page);
    explorePayableInvoices = new ExplorePayableInvoices(page);
  });

  test('[16.1] Drilldown See Payable Invoices as Local Client', async () => {
    await exploreOrganizations.goto();
    await exploreOrganizations.waitForReferenceComponent();
    await exploreOrganizations.checkOrganizationsDefaultOrgTypeSelector();
    await expect(page.getByTestId('table-header-org_name')).toBeVisible({
      timeout: GLOBALTIMEOUT,
    });
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await explorePayableInvoices.waitForReferenceComponent();
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });

  test('[16.1] Drilldown See Payable Invoices as Shipper', async () => {
    await exploreOrganizations.goto();
    await exploreOrganizations.waitForReferenceComponent();
    await exploreOrganizations.orgTypeUnitSelector('Shipper');
    await exploreOrganizations.waitForReferenceComponent();
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });

  test('[16.1] Drilldown See Payable Invoices as Consignee', async () => {
    await exploreOrganizations.goto();
    await exploreOrganizations.waitForReferenceComponent();
    await exploreOrganizations.orgTypeUnitSelector('Consignee');
    await exploreOrganizations.waitForReferenceComponent();
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await explorePayableInvoices.waitForReferenceComponent();
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });

  test('[16.1] Drilldown See Payable Invoices as Debtor', async () => {
    await exploreOrganizations.goto();
    await exploreOrganizations.waitForReferenceComponent();
    await exploreOrganizations.orgTypeUnitSelector('Debtor');
    await exploreOrganizations.waitForReferenceComponent();
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });

  test('[16.1] Drilldown See Payable Invoices as Creditor', async () => {
    await exploreOrganizations.goto();
    await exploreOrganizations.waitForReferenceComponent();
    await exploreOrganizations.orgTypeUnitSelector('Creditor');
    await exploreOrganizations.waitForReferenceComponent();
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await explorePayableInvoices.waitForReferenceComponent();
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });
});
