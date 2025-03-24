import { test, Page } from '@playwright/test';
import { ExploreContainers } from '../models/exploreContainers';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';
import { logInAuth } from '../../utils';

let exploreContainers;
let viewFilterSection;
let editTableColumnsExploreContainers;

test.describe.serial('Edit Columns on Explore Containers', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT4_USER}`,
      `${process.env.FREIGHT_BI_CLIENT4_PASS}`
    );
    exploreContainers = new ExploreContainers(page);
    viewFilterSection = new AdvancedFilterView(page);
    editTableColumnsExploreContainers = new EditTableColumns(page);
    await exploreContainers.goto();
    await exploreContainers.waitForReferenceComponent();
  });

  test.describe('Add Table Columns', () => {
    test('[57.2] User adds Shipment Transport Mode table column on the Explore Organizations Page', async () => {
      const columnName = 'Shipment Transport Mode';
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[57.2] User adds Shipment Failed to Arrive table column on the Explore Organizations Page', async () => {
      const columnName = 'Shipment Failed to Arrive';
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[57.2] User adds Container Seal Number table column on the Explore Organizations Page', async () => {
      const columnName = 'Container Seal Number';
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[57.2] User adds Container Empty Needed By table column on the Explore Organizations Page', async () => {
      const columnName = 'Container Empty Needed By';
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test.describe('Remove Table Columns', () => {
      test('[57.3] User removes [default] Container Count & Type table column on the Explore Organizations Page', async () => {
        const columnName = 'Container Count & Type';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[57.3] User removes [added]Shipment Failed to Arrive table column on the Explore Organizations Page', async () => {
        const columnName = 'Shipment Failed to Arrive';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[57.3] User removes [default] Container TEUs table column on the Explore Organizations Page', async () => {
        const columnName = 'Container TEUs';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[57.3] User removes [added] Shipment Transport Mode table column on the Explore Organizations Page', async () => {
        const columnName = 'Shipment Transport Mode';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[57.3] User removes [default] Goods Volume of Container-Shipment Pair table column on the Explore Organizations Page', async () => {
        const columnName = 'Goods Volume of Container-Shipment Pair';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });
    });
  });
});
