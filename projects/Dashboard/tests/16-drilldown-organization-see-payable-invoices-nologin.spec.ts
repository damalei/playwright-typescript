import { test, expect, Page } from '@playwright/test';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { DASHBOARD_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { waitforTablePageLoad, logInAuth } from '../../utils';

let exploreOrganizations;
let explorePayableInvoices;

test.describe
  .parallel('Drilldown See Payable Invoices as different Org types', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT4_USER}`,
      `${process.env.FREIGHT_BI_CLIENT4_PASS}`
    );
    await page.goto(FREIGHT_BI_BASE_URL);
    exploreOrganizations = new ExploreOrganizations(page);
    explorePayableInvoices = new ExplorePayableInvoices(page);
  });

  test('[16.1] Drilldown See Payable Invoices as Local Client', async () => {
    await exploreOrganizations.goto();
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await exploreOrganizations.checkOrganizationsDefaultOrgTypeSelector();
    await expect(page.getByTestId('table-header-org_name')).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
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
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await exploreOrganizations.orgTypeUnitSelector('Shipper');
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
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
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await exploreOrganizations.orgTypeUnitSelector('Consignee');
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
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
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await exploreOrganizations.orgTypeUnitSelector('Debtor');
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
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
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await exploreOrganizations.orgTypeUnitSelector('Creditor');
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    const { totalExpensesExclTaxAmount } =
      await exploreOrganizations.getOrganizationsTotalExpensesExclTaxAmount();
    await exploreOrganizations.clickOrganizationsSeePayableInvoices();
    await explorePayableInvoices.checkPayableInvoicePageHeader();
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    const { invoiceExclTaxSumAmount } =
      await exploreOrganizations.getDrilldownOrganizationsInvoiceExclTaxSumAmount();
    await exploreOrganizations.compareDrilldownResultsAmount(
      totalExpensesExclTaxAmount,
      invoiceExclTaxSumAmount,
      'Total Expenses Excl. Tax vs Invoice Amount Excl. Tax'
    );
  });
});
