import { test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';

let exploreOrganizations;
let viewFilterSection;
let editTableColumnsExploreOrganizations;

test.describe('Edit Columns on Explore Organizations', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
    exploreOrganizations = new ExploreOrganizations(page);
    viewFilterSection = new AdvancedFilterView(page);
    editTableColumnsExploreOrganizations = new EditTableColumns(page);
  });

  test.describe('Add Table Columns', () => {
    test('[53.2] User adds Posted Profit excl. Tax table column on the Explore Organizations Page', async () => {
      const columnName = 'Posted Profit % excl. Tax';
      await exploreOrganizations.goto();
      await exploreOrganizations.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.addTableColumn(columnName);
    });

    test('[53.2] User adds Posted Revenue Tax Amount table column on the Explore Organizations Page', async () => {
      const columnName = 'Recognized Posted Revenue Tax Amount';
      await exploreOrganizations.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.addTableColumn(columnName);
    });
    test('[53.2] User adds Unrecognized Posted Profit % incl. Tax table column on the Explore Organizations Page', async () => {
      const columnName = 'Unrecognized Posted Profit % incl. Tax';
      await exploreOrganizations.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.addTableColumn(columnName);
    });

    test('[53.2] User adds Data Last Retrieved On table column on the Explore Organizations Page', async () => {
      const columnName = 'Data Last Retrieved On';
      await exploreOrganizations.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.addTableColumn(columnName);
    });
  });
  test.describe('Remove Table Columns', () => {
    test('[53.3] User removes [default] Org Code table column on the Explore Organizations Page', async () => {
      const columnName = 'Org Code';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });

    test('[53.3] User removes [added]Data Last Retrieved On table column on the Explore Organizations Page', async () => {
      const columnName = 'Data Last Retrieved On';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });

    test('[53.3] User removes [default] Latest AR Post Date table column on the Explore Organizations Page', async () => {
      const columnName = 'Latest AR Post Date';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });

    test('[53.3] User removes [added] Unrecognized Posted Profit % incl. Tax table column on the Explore Organizations Page', async () => {
      const columnName = 'Unrecognized Posted Profit % incl. Tax';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });

    test('[53.3] User removes [default]Receivable Invoices table column on the Explore Organizations Page', async () => {
      const columnName = 'Receivable Invoices';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });

    test('[53.3] User removes [default]Payable Invoices table column on the Explore Organizations Page', async () => {
      const columnName = 'Payable Invoices';
      await exploreOrganizations.waitForReferenceComponent();
      await editTableColumnsExploreOrganizations.openEditColumns();
      await editTableColumnsExploreOrganizations.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreOrganizations.removeTableColumn(columnName);
    });
  });
});
