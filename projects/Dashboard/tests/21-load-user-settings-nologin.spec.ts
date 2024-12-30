import { expect, test, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { waitForFilterSectionToLoad, logInAuth } from '../../utils';
import { ExploreShipments } from '../models/exploreShipments';
import { SideMenu } from '../models/sideMenu';
const { chromium } = require('playwright');

test.describe('[21] Load dashboard and filter settings', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_CLIENT3_USER}`,
      `${process.env.FREIGHT_BI_CLIENT3_PASS}`
    );
  });

  test('[21.3] User loads a dashboard with filter and selector settings customized at the user level', async () => {
    const ship = new ExploreShipments(page);
    await ship.goto();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    const weight = await ship.globalFilterSection.checkSelector('WEIGHT', 'LB');
    const volume = await ship.globalFilterSection.checkSelector('VOLUME', 'CC');
    const currency = await ship.globalFilterSection.checkSelector(
      'CURRENCY',
      'PHP'
    );
    const bool = await ship.globalFilterSection.checkFilterFieldChip(
      'AP Is Posted',
      'True'
    );
    await ship.globalFilterSection.fieldTransportMode.click();
    const multText1 = await ship.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'SEA'
    );
    const multText2 = await ship.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'AIR'
    );
    const text1 = await ship.globalFilterSection.checkFilterFieldText(
      'Date Shipment Created',
      'Is between 30 Days Ago and Today'
    );
    const text2 = await ship.globalFilterSection.checkFilterFieldText(
      'Shipment Weight',
      '100 KG'
    );
    await expect.soft(weight).toBe(true);
    await expect.soft(volume).toBe(true);
    await expect.soft(currency).toBe(true);
    await expect.soft(bool).toBe(true);
    await expect.soft(multText1).toBe(true);
    await expect.soft(multText2).toBe(true);
    await expect.soft(text1).toBe(true);
    await expect.soft(text2).toBe(true);
  });

  test('[21.4] User edits a dashboard and refreshes the page', async () => {
    const ship = new ExploreShipments(page);
    await ship.globalFilterSection.setBasicTextFilter('Branch', 'NYC', 'MNL');
    await page.reload();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await ship.globalFilterSection.fieldBranch.click();
    const nyc = await ship.globalFilterSection.checkFilterFieldChip(
      'Branch',
      'NYC'
    );
    const mnl = await ship.globalFilterSection.checkFilterFieldChip(
      'Branch',
      'MNL'
    );
    await expect.soft(nyc).toBe(true);
    await expect.soft(mnl).toBe(true);
  });

  test('[21.5] User clicks on back button', async () => {
    const ship = new ExploreShipments(page);
    await page.goBack();
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await ship.globalFilterSection.fieldBranch.click();
    const nyc = await ship.globalFilterSection.checkFilterFieldChip(
      'Branch',
      'NYC'
    );
    const mnl = await ship.globalFilterSection.checkFilterFieldChip(
      'Branch',
      'MNL'
    );
    await expect.soft(nyc).toBe(true);
    await expect.soft(mnl).toBe(false);
  });

  test('[21.6] User edits a dashboard and shares the URL with another user from the same company', async () => {
    const ship = new ExploreShipments(page);
    const side = new SideMenu(page);
    const url = await page.url();
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await logInAuth(
      page1,
      `${process.env.FREIGHT_BI_CLIENT2_USER}`,
      `${process.env.FREIGHT_BI_CLIENT2_PASS}`
    );
    await page1.goto(url);
    await waitForFilterSectionToLoad(page1, DEFAULT_TIMEOUT_IN_MS);
    const weight = await ship.globalFilterSection.checkSelector('WEIGHT', 'LB');
    const volume = await ship.globalFilterSection.checkSelector('VOLUME', 'CC');
    const currency = await ship.globalFilterSection.checkSelector(
      'CURRENCY',
      'PHP'
    );
    const bool = await ship.globalFilterSection.checkFilterFieldChip(
      'AP Is Posted',
      'True'
    );
    await ship.globalFilterSection.fieldTransportMode.click();
    const multText1 = await ship.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'SEA'
    );
    const multText2 = await ship.globalFilterSection.checkFilterFieldChip(
      'Transport Mode',
      'AIR'
    );
    const text1 = await ship.globalFilterSection.checkFilterFieldText(
      'Date Shipment Created',
      'Is between 30 Days Ago and Today'
    );
    const text2 = await ship.globalFilterSection.checkFilterFieldText(
      'Shipment Weight',
      '100 KG'
    );
    await expect.soft(weight).toBe(true);
    await expect.soft(volume).toBe(true);
    await expect.soft(currency).toBe(true);
    await expect.soft(bool).toBe(true);
    await expect.soft(multText1).toBe(true);
    await expect.soft(multText2).toBe(true);
    await expect.soft(text1).toBe(true);
    await expect.soft(text2).toBe(true);
    await expect.soft(side.apiSummary.getByText('CN0TRNMNL')).toBeVisible();
    await expect.soft(side.apiSummary.getByText('+2')).toBeVisible();
  });
});
