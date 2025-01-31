import { test, Page } from '@playwright/test';
import { ExploreContainers } from '../models/shipperExploreContainers';
import { LoginPage } from '../models/login.ts';
import { EditTableColumns } from '../models/shipperEditColumn';

let exploreContainers;
let editTableColumnsShipperContainers;
let loginPage;

test.describe('Edit Columns on Shipper Explore Containers', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    exploreContainers = new ExploreContainers(page);
    editTableColumnsShipperContainers = new EditTableColumns(page);
    await loginPage.goto();
    await loginPage.loginToShipper();
    await exploreContainers.gotoExploreContainers();
    await exploreContainers.waitForReferenceComponent();
  });

  test.describe('Add Table Columns', () => {
    test('[45.2] User adds Shipment Transport Mode table column on the Explore Containers Page', async () => {
      const columnName = 'Shipment Transport Mode';
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.addTableColumn(columnName);
    });

    test('[45.2] User adds Shipment Failed to Arrive table column on the Explore Containers Page', async () => {
      const columnName = 'Shipment Failed to Arrive';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.addTableColumn(columnName);
    });

    test('[45.2] User adds Container Seal Number table column on the Explore Containers Page', async () => {
      const columnName = 'Container Seal Number';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.addTableColumn(columnName);
    });

    test('[45.2] User adds Container Empty Needed By table column on the Explore Containers Page', async () => {
      const columnName = 'Container Empty Needed By';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.addTableColumn(columnName);
    });
  });

  test.describe('Remove Table Columns', () => {
    test('[45.3] User removes [default] Container Count & Type table column on the Explore Containers Page', async () => {
      const columnName = 'Container Count & Type';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.removeTableColumn(columnName);
    });

    test('[45.3] User removes [added]Shipment Failed to Arrive table column on the Explore Containers Page', async () => {
      const columnName = 'Shipment Failed to Arrive';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.removeTableColumn(columnName);
    });

    test('[45.3] User removes [default] Container TEUs table column on the Explore Containers Page', async () => {
      const columnName = 'Container TEUs';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.removeTableColumn(columnName);
    });

    test('[45.3] User removes [added] Shipment Transport Mode table column on the Explore Containers Page', async () => {
      const columnName = 'Shipment Transport Mode';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.removeTableColumn(columnName);
    });

    test('[45.3] User removes [default] Goods Volume of Container-Shipment Pair table column on the Explore Containers Page', async () => {
      const columnName = 'Goods Volume of Container-Shipment Pair';
      await exploreContainers.waitForReferenceComponent();
      await editTableColumnsShipperContainers.openEditColumns();
      await editTableColumnsShipperContainers.toggleTableColumnVisibilityEyeIcon(
        columnName
      );
      await editTableColumnsShipperContainers.removeTableColumn(columnName);
    });
  });
});
