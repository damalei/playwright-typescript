import { test, Page, expect } from '@playwright/test';
import {
  logInAuth,
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
import { after } from 'node:test';
let page: Page;
let user: UserManagement;
let pay: ExplorePayableInvoices;
let ship: ExploreShipments;
let side: SideMenu;
let globalFilterSection: GlobalFilterSection;

test.describe.serial('[26] User sets-up sandboxing', () => {
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

test.describe
  .serial('[26.5] User confirms no changes to an inactive sandboxing configuration (disabled)', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_ADMIN2_USER}`,
      `${process.env.FREIGHT_BI_ADMIN2_PASS}`
    );
    user = new UserManagement(page);
    pay = new ExplorePayableInvoices(page);
    side = new SideMenu(page);
    globalFilterSection = new GlobalFilterSection(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('User confirms sandboxing values and flag are saved while disabled - modal', async () => {
    await test.step('User goes the user management page', async () => {
      await user.goto();
      await user.waitForReferenceComponent();
    });
    await test.step('Select a user and go to edit mode', async () => {
      await user.searchEmail(`${process.env.FREIGHT_BI_ADMIN2_USER}`);
      await user.clickEditAccess(`${process.env.FREIGHT_BI_ADMIN2_USER}`);
    });
    await test.step('Verify sandboxing values are displayed', async () => {
      const isSalesRepChipVisible = await user.checkSandboxChips(
        'Sales Rep',
        'Rui Aguiar (RA)'
      );
      const isSalesRepChipVisible2 = await user.checkSandboxChips(
        'Sales Rep',
        'Jig Young (JY)'
      );
      const isOperatorChipVisible2 = await user.checkSandboxChips(
        'Operator',
        'Jefferson Tan (JT)'
      );
      const isOperatorChipVisible3 = await user.checkSandboxChips(
        'Operator',
        'Casper Chan (CC)'
      );
      const isBranchChipVisible = await user.checkSandboxChips('Branch', 'MNL');
      const isBranchChipVisible2 = await user.checkSandboxChips(
        'Branch',
        'NYC'
      );
      const isDepartmentChipVisible = await user.checkSandboxChips(
        'Department',
        'FIA'
      );
      const isDepartmentChipVisible2 = await user.checkSandboxChips(
        'Department',
        'FES'
      );
      await expect.soft(isSalesRepChipVisible).toBe(true);
      await expect.soft(isSalesRepChipVisible2).toBe(true);
      await expect.soft(isOperatorChipVisible2).toBe(true);
      await expect.soft(isOperatorChipVisible3).toBe(true);
      await expect.soft(isBranchChipVisible).toBe(true);
      await expect.soft(isBranchChipVisible2).toBe(true);
      await expect.soft(isDepartmentChipVisible).toBe(true);
      await expect.soft(isDepartmentChipVisible2).toBe(true);
    });

    await test.step('Verify sandboxing flag is disabled', async () => {
      const isToggled = await user.toggleSandbox.inputValue();
      await expect.soft(isToggled).toBe('false');
    });
  });

  test('User confirms no sandboxing values are displayed on the dashboard - native', async () => {
    await test.step('User goes a native dashboard', async () => {
      await pay.goto();
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    });
    await test.step('Verify sandboxing values are not displayed', async () => {
      await expect
        .soft(globalFilterSection.accSandboxingFilters)
        .not.toBeVisible();
    });
  });

  test('User confirms no sandboxing values are displayed on the dashboard - custom', async () => {
    await test.step('User goes a custom dashboard', async () => {
      await side.accAccounting.click();
      await side.clickOnDashboardName('Payables Overview');
    });
    await test.step('Verify sandboxing values are displayed on the dashboard', async () => {
      await expect
        .soft(globalFilterSection.accSandboxingFilters)
        .not.toBeVisible();
    });
  });
});

test.describe
  .serial('[26.4] User confirms no changes to an active sandboxing configuration (enabled)', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_ADMIN3_USER}`,
      `${process.env.FREIGHT_BI_ADMIN3_PASS}`
    );
    user = new UserManagement(page);
    ship = new ExploreShipments(page);
    side = new SideMenu(page);
    globalFilterSection = new GlobalFilterSection(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('User confirms sandboxing values and flag are saved while enabled - modal', async () => {
    await test.step('User goes the user management page', async () => {
      await user.goto();
      await user.waitForReferenceComponent();
    });
    await test.step('Select a user and go to edit mode', async () => {
      await user.searchEmail(`${process.env.FREIGHT_BI_ADMIN3_USER}`);
      await user.clickEditAccess(`${process.env.FREIGHT_BI_ADMIN3_USER}`);
    });
    await test.step('Verify sandboxing values are displayed', async () => {
      const isSalesRepChipVisible = await user.checkSandboxChips(
        'Sales Rep',
        'Rui Aguiar (RA)'
      );
      const isSalesRepChipVisible2 = await user.checkSandboxChips(
        'Sales Rep',
        'Jig Young (JY)'
      );
      const isOperatorChipVisible2 = await user.checkSandboxChips(
        'Operator',
        'Jefferson Tan (JT)'
      );
      const isOperatorChipVisible3 = await user.checkSandboxChips(
        'Operator',
        'Casper Chan (CC)'
      );
      const isBranchChipVisible = await user.checkSandboxChips('Branch', 'MNL');
      const isBranchChipVisible2 = await user.checkSandboxChips(
        'Branch',
        'NYC'
      );
      const isDepartmentChipVisible = await user.checkSandboxChips(
        'Department',
        'FIA'
      );
      const isDepartmentChipVisible2 = await user.checkSandboxChips(
        'Department',
        'FES'
      );
      await expect.soft(isSalesRepChipVisible).toBe(true);
      await expect.soft(isSalesRepChipVisible2).toBe(true);
      await expect.soft(isOperatorChipVisible2).toBe(true);
      await expect.soft(isOperatorChipVisible3).toBe(true);
      await expect.soft(isBranchChipVisible).toBe(true);
      await expect.soft(isBranchChipVisible2).toBe(true);
      await expect.soft(isDepartmentChipVisible).toBe(true);
      await expect.soft(isDepartmentChipVisible2).toBe(true);
    });

    await test.step('Verify sandboxing flag is enabled', async () => {
      const isToggled = await user.toggleSandbox.inputValue();
      await expect.soft(isToggled).toBe('true');
    });
  });

  test('User confirms sandboxing values are displayed on the dashboard - native', async () => {
    await test.step('User goes a native dashboard', async () => {
      await ship.goto();
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    });
    await test.step('Verify sandboxing values are displayed', async () => {
      await globalFilterSection.accSandboxingFilters.click();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Sales Rep is Rui Aguiar (RA)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Sales Rep is Jig Young (JY)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Operator is Jefferson Tan (JT)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Operator is Casper Chan (CC)')
        )
        .toBeVisible();
      await expect
        .soft(
          page.getByTestId('sandboxing-filterchip').getByText('Branch is MNL')
        )
        .toBeVisible();
      await expect
        .soft(
          page.getByTestId('sandboxing-filterchip').getByText('Branch is NYC')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Department is FIA')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Department is FES')
        )
        .toBeVisible();
    });
  });

  test('User confirms sandboxing values are displayed on the dashboard - custom', async () => {
    await test.step('User goes a custom dashboard', async () => {
      await side.accAccounting.click();
      await side.clickOnDashboardName('Payables Overview');
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    });
    await test.step('Verify sandboxing values are displayed on the dashboard', async () => {
      await globalFilterSection.accSandboxingFilters.click();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Sales Rep is Rui Aguiar (RA)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Sales Rep is Jig Young (JY)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Operator is Jefferson Tan (JT)')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Operator is Casper Chan (CC)')
        )
        .toBeVisible();
      await expect
        .soft(
          page.getByTestId('sandboxing-filterchip').getByText('Branch is MNL')
        )
        .toBeVisible();
      await expect
        .soft(
          page.getByTestId('sandboxing-filterchip').getByText('Branch is NYC')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Department is FIA')
        )
        .toBeVisible();
      await expect
        .soft(
          page
            .getByTestId('sandboxing-filterchip')
            .getByText('Department is FES')
        )
        .toBeVisible();
    });
  });
});
