import { test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';

let explorePayableInvoices;
let viewFilterSection;
let editTableColumnsExplorePayableInvoices;

test.describe('Edit Columns on Explore Payable Invoices', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
    explorePayableInvoices = new ExplorePayableInvoices(page);
    viewFilterSection = new AdvancedFilterView(page);
    editTableColumnsExplorePayableInvoices = new EditTableColumns(page);
  });

  test.describe('Add Table Columns', () => {
    test('[49.2] User adds Recognition Type table column on the Explore Payable Invoices Page', async () => {
      const columnName = 'Recognition Type';
      await explorePayableInvoices.goto();
      await explorePayableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExplorePayableInvoices.openEditColumns();
      await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExplorePayableInvoices.addTableColumn(columnName);
    });
    test('[49.2] User adds Recognition Date table column on the Explore Payable Invoices Page', async () => {
      const columnName = 'Recognition Date';
      await explorePayableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExplorePayableInvoices.openEditColumns();
      await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExplorePayableInvoices.addTableColumn(columnName);
    });
    test('[49.2] User adds Invoice Tax Amount table column on the Explore Payable Invoices Page', async () => {
      const columnName = 'Invoice Tax Amount';
      await explorePayableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExplorePayableInvoices.openEditColumns();
      await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExplorePayableInvoices.addTableColumn(columnName);
    });
    test('[49.2] User adds Number of Related Jobs table column on the Explore Payable Invoices Page', async () => {
      const columnName = 'Number of Related Jobs';
      await explorePayableInvoices.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExplorePayableInvoices.openEditColumns();
      await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExplorePayableInvoices.addTableColumn(columnName);
    });

    test.describe('Remove Table Columns', () => {
      test('[49.3] User removes [default] House Bill table column on the Explore Payable Invoices Page', async () => {
        const columnName = 'Creditor Code';
        await explorePayableInvoices.waitForReferenceComponent();
        await editTableColumnsExplorePayableInvoices.openEditColumns();
        await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExplorePayableInvoices.removeTableColumn(
          columnName
        );
      });
      test('[49.3] User removes [added] Invoice Tax Amount table column on the Explore Payable Invoices Page', async () => {
        const columnName = 'Invoice Tax Amount';
        await explorePayableInvoices.waitForReferenceComponent();
        await editTableColumnsExplorePayableInvoices.openEditColumns();
        await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExplorePayableInvoices.removeTableColumn(
          columnName
        );
      });
      test('[49.3] User removes [default] Paid on Time table column on the Explore Payable Invoices Page', async () => {
        const columnName = 'Paid on Time';
        await explorePayableInvoices.waitForReferenceComponent();
        await editTableColumnsExplorePayableInvoices.openEditColumns();
        await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExplorePayableInvoices.removeTableColumn(
          columnName
        );
      });
      test('[49.3] User removes [added] Recognition Date table column on the Explore Payable Invoices Page', async () => {
        const columnName = 'Recognition Date';
        await explorePayableInvoices.waitForReferenceComponent();
        await editTableColumnsExplorePayableInvoices.openEditColumns();
        await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExplorePayableInvoices.removeTableColumn(
          columnName
        );
      });
      test('[49.3] User removes [default] Is Posted table column on the Explore Payable Invoices Page', async () => {
        const columnName = 'Is Posted';
        await explorePayableInvoices.waitForReferenceComponent();
        await editTableColumnsExplorePayableInvoices.openEditColumns();
        await editTableColumnsExplorePayableInvoices.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExplorePayableInvoices.removeTableColumn(
          columnName
        );
      });
    });
  });
});
