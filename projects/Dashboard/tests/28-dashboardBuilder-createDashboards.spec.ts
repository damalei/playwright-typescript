import { test, Page, expect } from '@playwright/test';
import {
  waitForElementToHide,
  waitForFilterSectionToLoad,
  waitForSnackBar,
} from '../../utils';
import { SideMenu } from '../models/sideMenu';
import {
  DEFAULT_TIMEOUT_IN_MS,
  DASHBOARD_TIMEOUT_IN_MS,
  FREIGHT_BI_BASE_URL,
} from '../../constants';
import { DashboardBuilder } from '../models/dashboardBuilder';
import { UserManagement } from '../models/userManagement';
import { getFormattedDateTime } from '../../utils';

test.describe.configure({
  mode: 'parallel',
  timeout: DASHBOARD_TIMEOUT_IN_MS,
});

let dashboardTitle;
let dateNow;
const linequery = `
select
    date(date_trunc('months', date_shipment_created)) as period, sum(ar_amount) as revenue
from
    shipment
    join invoice_line on invoice_line.shipment_snowflake_id = shipment.snowflake_id
group by period
order by period`;

const chartName1 = 'Line Chart no card filter';
const chartName2 = 'Line Chart with AIR filter';
const chartName3 = 'Line Chart with SEA filter';
const xpathUserManagementButton = '//button[text()="Save"]';

test.describe.serial('[28] Dashboard Builder: Create/Edit Dashboards', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test('[28.X] Admin user creates a dashboard', async () => {
    dateNow = getFormattedDateTime();
    dashboardTitle = `QA Test TC28 ${dateNow}`;
    const dash = new DashboardBuilder(page);
    const side = new SideMenu(page);
    await side.userProfile.click();
    await side.dashboardBuilderOption.click();
    await dash.buttonCreateDashboard.click();
    await dash.inputCreateDashboard.fill(dashboardTitle);
    await dash.buttonSubmitCreateDashboard.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.page.reload();
    await dash.loadDashboard(dashboardTitle);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await expect
      .soft(page.getByTestId('header-title'))
      .toContainText(dashboardTitle);
    await expect
      .soft(page.getByText('This Dashboard seems empty...'))
      .toBeVisible();
    await expect
      .soft(
        page.getByText('Edit the dashboard and add questions to get started')
      )
      .toBeVisible();
  });

  test('[28.1] Admin user creates a dashboard with chart that has no card specific filters', async () => {
    const dash = new DashboardBuilder(page);
    await dash.buttonEditDashboard.click();
    await dash.buttonAddCard.click();
    await dash.ModalAddCard.inputCardName.fill(chartName1);
    await dash.ModalAddCard.inputSubtitle.fill('Subtitle');
    await dash.ModalAddCard.inputToolTipWhat.fill('Test what');
    await dash.ModalAddCard.inputToolTipHow.fill('Test how');
    await dash.ModalAddCard.inputQuery.fill(linequery);
    await dash.ModalAddCard.buttonLineChart.click();
    await dash.ModalAddCard.inputXaxis.fill('period');
    await dash.ModalAddCard.inputYaxis.fill('revenue');
    await dash.ModalAddCard.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.clickLazyLoad(page, chartName1);
    await expect
      .soft(page.getByTestId(`data-component-${chartName1}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  test('[28.2] Admin user creates a dashboard with chart with card specific filters', async () => {
    const dash = new DashboardBuilder(page);
    await dash.buttonAddCard.click();
    await dash.ModalAddCard.inputCardName.fill(chartName2);
    await dash.ModalAddCard.inputSubtitle.fill('Subtitle');
    await dash.ModalAddCard.inputToolTipWhat.fill('Test what');
    await dash.ModalAddCard.inputToolTipHow.fill('Test how');
    await dash.ModalAddCard.inputQuery.fill(linequery);
    await dash.ModalAddCard.buttonLineChart.click();
    await dash.ModalAddCard.inputXaxis.fill('period');
    await dash.ModalAddCard.inputYaxis.fill('revenue');
    await dash.ModalAddCard.buttonFilters.click();
    await dash.ModalAddCard.buttonEditAdvanceFilter.click();
    await dash.ModalAddCard.expandAdvanceFilterAccordion(
      page,
      'Shipment Filters'
    );
    await dash.ModalAddCard.setAdvanceTextFilter(
      page,
      'Shipment Filters',
      'Transport Mode',
      'AIR',
      0
    );
    await dash.ModalAddCard.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.clickLazyLoad(page, chartName2);
    await expect
      .soft(page.getByTestId(`data-component-${chartName2}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await dash.ModalAddCard.clickEditCard(page, `${chartName2}`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
  });

  test('[28.4] Admin user duplicates a chart', async () => {
    const dash = new DashboardBuilder(page);
    await dash.ModalAddCard.buttonCancel.click();
    await dash.ModalAddCard.clickDuplicateCard(page, `${chartName2}`);
    await dash.ModalAddCard.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.clickLazyLoad(page, `${chartName2} copy`);
    await expect
      .soft(page.getByTestId(`data-component-${chartName2} copy`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await dash.ModalAddCard.clickEditCard(page, `${chartName2}`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
  });

  test('[28.3] Admin user duplicates a dashboard', async () => {
    const dash = new DashboardBuilder(page);
    await dash.ModalAddCard.buttonCancel.click();
    await dash.clickDuplicateDashboard(page, dashboardTitle);
    await dash.buttonDuplicateDashboard.click();
    await dash.loadDashboard(`${dashboardTitle} copy`);
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.buttonEditDashboard.click();
    await dash.clickLazyLoad(page, `${chartName1}`);
    await dash.clickLazyLoad(page, `${chartName2}`);
    await dash.clickLazyLoad(page, `${chartName2} copy`);
    await expect
      .soft(page.getByTestId('header-title'))
      .toContainText(`${dashboardTitle} copy`);
    await expect
      .soft(page.getByTestId(`data-component-${chartName1}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByTestId(`data-component-${chartName2}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByTestId(`data-component-${chartName2} copy`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await dash.ModalAddCard.clickEditCard(page, `${chartName2}`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
    await dash.ModalAddCard.clickEditCard(page, `${chartName2} copy`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
  });

  test('[28.5] Admin user edits a duplicated chart', async () => {
    const dash = new DashboardBuilder(page);
    await dash.inputName.fill(`${dashboardTitle} copy edited`);
    await dash.inputDisplayName.fill(`${dashboardTitle} copy edited`);
    await dash.ModalAddCard.clickEditCard(page, `${chartName2}`);
    await dash.ModalAddCard.inputCardName.fill(chartName3);
    await dash.ModalAddCard.buttonEditAdvanceFilter.click();
    await dash.ModalAddCard.expandAdvanceFilterAccordion(
      page,
      'Shipment Filters'
    );
    await dash.ModalAddCard.clearAdvanceFilter(page, 'Shipment Filters', 0);
    await dash.ModalAddCard.setAdvanceTextFilter(
      page,
      'Shipment Filters',
      'Transport Mode',
      'SEA',
      0
    );
    await dash.ModalAddCard.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await page.waitForTimeout(2000);
    await dash.ModalAddCard.clickEditCard(page, `${chartName2} copy`);
    await dash.ModalAddCard.inputCardName.fill(`${chartName3} copy`);
    await dash.ModalAddCard.buttonEditAdvanceFilter.click();
    await dash.ModalAddCard.expandAdvanceFilterAccordion(
      page,
      'Shipment Filters'
    );
    await dash.ModalAddCard.clearAdvanceFilter(page, 'Shipment Filters', 0);
    await dash.ModalAddCard.setAdvanceTextFilter(
      page,
      'Shipment Filters',
      'Transport Mode',
      'SEA',
      0
    );
    await dash.ModalAddCard.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.loadDashboard(dashboardTitle);
    await dash.buttonEditDashboard.click();
    await dash.clickLazyLoad(page, `${chartName2}`);
    await dash.clickLazyLoad(page, `${chartName2} copy`);
    await dash.ModalAddCard.clickEditCard(page, `${chartName2}`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
    await dash.ModalAddCard.clickEditCard(page, `${chartName2} copy`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is AIR'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
    await dash.loadDashboard(`${dashboardTitle} copy edited`);
    await dash.buttonEditDashboard.click();
    await dash.clickLazyLoad(page, `${chartName3}`);
    await dash.clickLazyLoad(page, `${chartName3} copy`);
    await dash.ModalAddCard.clickEditCard(page, `${chartName3}`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is SEA'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
    await dash.ModalAddCard.clickEditCard(page, `${chartName3} copy`);
    await expect
      .soft(dash.ModalAddCard.sectionFilters.getByText('Transport Mode is SEA'))
      .toBeVisible();
    await dash.ModalAddCard.buttonCancel.click();
  });

  test('[28.6] Admin user creates a custom dashboard with a custom filter and selector set', async () => {
    const dash = new DashboardBuilder(page);
    const user = new UserManagement(page);
    const side = new SideMenu(page);
    await dash.clickSelectorToggle('VOLUME');
    await dash.clickSelectorToggle('SHIPMENT VOLUME');
    await dash.clickSelectorToggle('GROUP BY DATE');
    await dash.setSelectorValue('CURRENCY', 'PHP');
    await dash.setSelectorValue('WEIGHT', 'LB');
    await dash.setSelectorValue('PERIOD', 'Daily');
    await dash.globalFilterSection.editBasicFiltersButton.click();
    await dash.globalFilterSection.addFilterFieldButton.click();
    await dash.globalFilterSection.clickFilterField('Page Last Updated On');
    await dash.globalFilterSection.updateFilterField.click();
    await dash.globalFilterSection.saveViewButton.click();
    await dash.buttonSave.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await user.goto();
    await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`);
    await user.inputDashboard(
      'Business Performance',
      `${dashboardTitle} copy edited`
    );
    await user.buttonSave.click();
    const confirmButton = page.getByText('Confirm');
    try {
      await confirmButton.click();
    } catch (error) {
      console.log('Element not found, continuing...');
    }
    await waitForElementToHide(
      page,
      DEFAULT_TIMEOUT_IN_MS,
      `${xpathUserManagementButton}`
    );
    await page.reload();
    await side.accBP.click();
    await side.clickOnDashboardName(`${dashboardTitle} copy edited`);
    await expect
      .soft(page.getByTestId('header-title'))
      .toContainText(`${dashboardTitle} copy edited`);
    await expect
      .soft(page.locator('label', { hasText: 'Page Last Updated On' }))
      .toBeVisible({ timeout: 10000 });
    await expect
      .soft(page.getByTestId(`data-component-${chartName1}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByTestId(`data-component-${chartName3}`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
    await expect
      .soft(page.getByTestId(`data-component-${chartName3} copy`))
      .toBeVisible({ timeout: DEFAULT_TIMEOUT_IN_MS });
  });

  test.afterAll(async ({ browser }) => {
    const dash = new DashboardBuilder(page);
    await dash.goto();
    await dash.inputSearchDashboard.fill(`${dashboardTitle} copy edited`);
    await dash.clickDeleteDashboardFromList(
      page,
      `${dashboardTitle} copy edited`
    );
    await dash.buttonDeleteDashboardConfirm.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
    await dash.inputSearchDashboard.fill(dashboardTitle);
    await dash.clickDeleteDashboardFromList(page, dashboardTitle);
    await dash.buttonDeleteDashboardConfirm.click();
    await waitForSnackBar(page, DEFAULT_TIMEOUT_IN_MS);
  });
});
