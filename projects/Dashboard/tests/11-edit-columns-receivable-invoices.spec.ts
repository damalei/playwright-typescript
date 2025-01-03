import { test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';

let exploreReceivableInvoices;
let viewFilterSection;
let editTableColumnsExploreReceivableInvoices;

test.describe('Edit Columns on Explore Receivable Invoices', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
    exploreReceivableInvoices = new ExploreReceivableInvoices(page);
    viewFilterSection = new AdvancedFilterView(page);
    editTableColumnsExploreReceivableInvoices = new EditTableColumns(page);
  });

  test.describe('Add Table Columns', () => {
    test('[51.2] User adds Recognition Type table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Recognition Type';
      await exploreReceivableInvoices.goto();
      await exploreReceivableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.addTableColumn(
        columnName
      );
    });

    test('[51.2] User adds Recognition Date table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Recognition Date';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.addTableColumn(
        columnName
      );
    });
    test('[51.2] User adds Invoice Tax Amount table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Invoice Tax Amount';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.addTableColumn(
        columnName
      );
    });

    test('[51.2] User adds Number of Related Jobs table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Number of Related Jobs';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.addTableColumn(
        columnName
      );
    });
  });
  test.describe('Remove Table Columns', () => {
    test('[51.3] User removes [default] House Bill table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Debtor Code';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.removeTableColumn(
        columnName
      );
    });

    test('[51.3] User removes [added] Invoice Tax Amount table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Invoice Tax Amount';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.removeTableColumn(
        columnName
      );
    });

    test('[51.3] User removes [default] Paid on Time table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'AR Time to Bill';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.removeTableColumn(
        columnName
      );
    });

    test('[51.3] User removes [added] Recognition Date table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Recognition Date';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.removeTableColumn(
        columnName
      );
    });

    test('[51.3] User removes [default] Is Posted table column on the Explore Receivable Invoices Page', async () => {
      const columnName = 'Is Posted';
      await exploreReceivableInvoices.waitForReferenceComponent();
      await editTableColumnsExploreReceivableInvoices.openEditColumns();
      await editTableColumnsExploreReceivableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreReceivableInvoices.removeTableColumn(
        columnName
      );
    });
  });
});
