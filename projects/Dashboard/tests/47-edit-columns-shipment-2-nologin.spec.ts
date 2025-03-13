import { test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreShipments } from '../models/exploreShipments';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';
import { logInAuth } from '../../utils';

export let exploreShipments;
let viewFilterSections;
let editTableColumnsExploreShipments;

test.describe('Edit columns on Explore Shipments Page', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT4_USER}`,
      `${process.env.FREIGHT_BI_CLIENT4_PASS}`
    );
    exploreShipments = new ExploreShipments(page);
    viewFilterSections = new AdvancedFilterView(page);
    editTableColumnsExploreShipments = new EditTableColumns(page);
    await exploreShipments.goto();
    await exploreShipments.waitForReferenceComponent();
  });

  test.describe('Add table columns', () => {
    test('[47.2] User adds [date] Date Shipment Closed table column on the Shipments Page', async () => {
      const columnName = 'Date Shipment Closed';
      await viewFilterSections.waitForFilterFields();
      await editTableColumnsExploreShipments.openEditColumns();
      await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreShipments.addTableColumn(columnName);
    });
    test('[47.2] User adds [string] Shipment Status table column on the Shipments Page', async () => {
      const columnName = 'Shipment Status';
      await exploreShipments.waitForReferenceComponent();
      await editTableColumnsExploreShipments.openEditColumns();
      await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreShipments.addTableColumn(columnName);
    });
    test('[47.2] User adds [boolean] Has Exceptions table column on the Shipments Page', async () => {
      const columnName = 'Has Exceptions';
      await exploreShipments.waitForReferenceComponent();
      await editTableColumnsExploreShipments.openEditColumns();
      await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreShipments.addTableColumn(columnName);
    });
    test('[47.2] User adds [weight] Chargeable Weight table column on the Shipments Page', async () => {
      const columnName = 'Chargeable Weight';
      await exploreShipments.waitForReferenceComponent();
      await editTableColumnsExploreShipments.openEditColumns();
      await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreShipments.addTableColumn(columnName);
    });
    test('[47.2] User adds [amount] Unrecognized Unposted Expenses Excl. Tax table column on the Shipments Page', async () => {
      const columnName = 'Unrecognized Unposted Expenses Excl. Tax';
      await exploreShipments.waitForReferenceComponent();
      await editTableColumnsExploreShipments.openEditColumns();
      await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreShipments.addTableColumn(columnName);
    });

    test.describe('Remove table columns', () => {
      test('[47.3] User removes [default] House Bill table column on the Shipments Page', async () => {
        const columnName = 'House Bill';
        await exploreShipments.waitForReferenceComponent();
        await editTableColumnsExploreShipments.openEditColumns();
        await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreShipments.removeTableColumn(columnName);
      });
      test('[47.3] User removes [added] Date Shipment table column on the Shipments Page', async () => {
        const columnName = 'Date Shipment Closed';
        await exploreShipments.waitForReferenceComponent();
        await editTableColumnsExploreShipments.openEditColumns();
        await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreShipments.removeTableColumn(columnName);
      });
      test('[47.3] User removes [default] Consol Number table column on the Shipments Page', async () => {
        const columnName = 'Consol Number';
        await exploreShipments.waitForReferenceComponent();
        await editTableColumnsExploreShipments.openEditColumns();
        await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreShipments.removeTableColumn(columnName);
      });
      test('[47.3] User removes [added] Shipment Status table column on the Shipments Page', async () => {
        const columnName = 'Shipment Status';
        await exploreShipments.waitForReferenceComponent();
        await editTableColumnsExploreShipments.openEditColumns();
        await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreShipments.removeTableColumn(columnName);
      });
      test('[47.3] User removes [default] Shipment Teus table column on the Shipments Page', async () => {
        const columnName = 'Shipment TEUs';
        await exploreShipments.waitForReferenceComponent();
        await editTableColumnsExploreShipments.openEditColumns();
        await editTableColumnsExploreShipments.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreShipments.removeTableColumn(columnName);
      });
    });
  });
});
