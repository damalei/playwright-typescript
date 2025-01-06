import { test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreContainers } from '../models/exploreContainers';
import { AdvancedFilterView } from '../models/advancedFilters';
import { EditTableColumns } from '../models/explorePageEditColumn';

let exploreContainers;
let viewFilterSection;
let editTableColumnsExploreContainers;

test.describe('Edit Columns on Explore Containers', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
    exploreContainers = new ExploreContainers(page);
    viewFilterSection = new AdvancedFilterView(page);
    editTableColumnsExploreContainers = new EditTableColumns(page);
  });

  test.describe('Add Table Columns', () => {
    test('[53.2] User adds Shipment Transport Mode table column on the Explore Organizations Page', async () => {
      const columnName = 'Shipment Transport Mode';
      await exploreContainers.goto();
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[53.2] User adds Shipment Failed to Arrive table column on the Explore Organizations Page', async () => {
      const columnName = 'Shipment Failed to Arrive';
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[53.2] User adds Container Seal Number table column on the Explore Organizations Page', async () => {
      const columnName = 'Container Seal Number';
      await exploreContainers.waitForReferenceComponent();
      await viewFilterSection.waitForFilterFields();
      await editTableColumnsExploreContainers.openEditColumns();
      await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsExploreContainers.addTableColumn(columnName);
    });

    test('[53.2] User adds Container Empty Needed By table column on the Explore Organizations Page', async () => {
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
      test('[53.3] User removes [default] Container Count & Type table column on the Explore Organizations Page', async () => {
        const columnName = 'Container Count & Type';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[53.3] User removes [added]Shipment Failed to Arrive table column on the Explore Organizations Page', async () => {
        const columnName = 'Shipment Failed to Arrive';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[53.3] User removes [default] Container TEUs table column on the Explore Organizations Page', async () => {
        const columnName = 'Container TEUs';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[53.3] User removes [added] Shipment Transport Mode table column on the Explore Organizations Page', async () => {
        const columnName = 'Shipment Transport Mode';
        await exploreContainers.waitForReferenceComponent();
        await editTableColumnsExploreContainers.openEditColumns();
        await editTableColumnsExploreContainers.toggleTableColumnVisibilityEyeIcon(
          columnName
        );
        await editTableColumnsExploreContainers.removeTableColumn(columnName);
      });

      test('[53.3] User removes [default] Goods Volume of Container-Shipment Pair table column on the Explore Organizations Page', async () => {
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
