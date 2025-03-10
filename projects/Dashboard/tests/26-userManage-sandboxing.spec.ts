import { test, Page, expect } from '@playwright/test';
import {
  waitForAdvanceSnackBar,
  waitForElementToHide,
  waitForFilterSectionToLoad,
} from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { UserManagement } from '../models/userManagement';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { GlobalFilterSection } from '../models/globalFilterSection';
import { ExploreShipments } from '../models/exploreShipments';
import { SideMenu } from '../models/sideMenu';

test.describe.serial('[26] User Management: Sandboxing', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test.afterAll(async ({ browser }) => {
    const pay = new ExplorePayableInvoices(page);
    await pay.globalFilterSection.removeBasicTextFilter('Transport Mode', 2);
    await pay.globalFilterSection.saveViewButton.click();
    await pay.globalFilterSection.buttonSaveModal.click();
    await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
  });

  test('[26.1] Admin user enables sandboxing', async () => {
    const user = new UserManagement(page);
    const pay = new ExplorePayableInvoices(page);
    const globalFilterSection = new GlobalFilterSection(page);
    await user.goto();
    await user.waitForReferenceComponent();
    await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.inputDashboard('Sales Rep', 'Rui Aguiar (RA)');
    await user.inputDashboard('Operator', 'Jig Young (JY)');
    await user.inputDashboard('Branch', 'MNL');
    await user.inputDashboard('Department', 'FIA');
    await user.toggleSandbox.click();
    await user.buttonSave.click();
    await waitForElementToHide(
      page,
      DEFAULT_TIMEOUT_IN_MS,
      '//button[text()="Save"]'
    );
    await pay.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await expect.soft(pay.globalFilterSection.infoIcon).toBeVisible();
    await pay.globalFilterSection.infoIcon.click();
    await expect
      .soft(
        page
          .getByTestId('sandboxing-filterchip')
          .getByText('Operator is Jig Young (JY)')
      )
      .toBeVisible();
    await expect
      .soft(
        page
          .getByTestId('sandboxing-filterchip')
          .getByText('Sales Rep is Rui Aguiar (RA)')
      )
      .toBeVisible();
    await expect
      .soft(
        page.getByTestId('sandboxing-filterchip').getByText('Branch is MNL')
      )
      .toBeVisible();
    await expect
      .soft(
        page.getByTestId('sandboxing-filterchip').getByText('Department is FIA')
      )
      .toBeVisible();
  });

  test('[26.3] Admin user saves while sandboxing is enabled', async () => {
    const pay = new ExplorePayableInvoices(page);
    await pay.globalFilterSection.setBasicTextFilter(
      'Transport Mode',
      'AIR',
      'SEA'
    );
    await pay.globalFilterSection.saveViewButton.click();
    await pay.globalFilterSection.buttonSaveModal.click();
    await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    const ship = new ExploreShipments(page);
    await ship.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    pay.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const airChip = await pay.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'AIR'
    );
    const seaChip = await pay.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'SEA'
    );
    await expect.soft(airChip).toBe(true);
    await expect.soft(seaChip).toBe(true);
  });

  test('[26.2] Admin User disables sandboxing', async () => {
    const user = new UserManagement(page);
    const pay = new ExplorePayableInvoices(page);
    const globalFilterSection = new GlobalFilterSection(page);
    await user.goto();
    await user.waitForReferenceComponent();
    await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.inputDashboard('Sales Rep', 'Rui Aguiar (RA)');
    await user.inputDashboard('Operator', 'Jig Young (JY)');
    await user.inputDashboard('Branch', 'MNL');
    await user.inputDashboard('Department', 'FIA');
    await user.toggleSandbox.click();
    await user.buttonSave.click();
    await waitForElementToHide(
      page,
      DEFAULT_TIMEOUT_IN_MS,
      '//button[text()="Save"]'
    );
    await page.reload();
    await user.waitForReferenceComponent();
    await pay.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const airChip = await pay.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'AIR'
    );
    const seaChip = await pay.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'SEA'
    );
    await expect.soft(pay.globalFilterSection.infoIcon).not.toBeVisible();
    await expect.soft(airChip).toBe(true);
    await expect.soft(seaChip).toBe(true);
  });
});
