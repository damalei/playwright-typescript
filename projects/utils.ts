import { Page, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS } from './constants.ts';

export function setGlobalData(url: string) {
  //const localData = 'This is the data to share globally';
  global.testTaskUrl = url;
}

export const waitforTablePageLoad = async (
  page: Page,
  loadTimeoutMs: number
) => {
  await expect(page.getByTestId('table')).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export function setShipperUrl(url: string) {
  global.shipperUrl = url;
}

export const waitForChartPageLoad = async (
  page: Page,
  loadTimeoutMs: number,
  chartTestId: string
) => {
  await expect(page.getByTestId(chartTestId)).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForFilterSectionToLoad = async (
  page: Page,
  loadTimeoutMs: number
) => {
  await expect(page.getByTestId('filters')).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForSnackBar = async (page: Page, loadTimeoutMs: number) => {
  await expect(
    page.locator('//div[@id="notistack-snackbar"]').first()
  ).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForAdvanceSnackBar = async (
  page: Page,
  loadTimeoutMs: number
) => {
  await expect(page.getByTestId('advanced-snackbar-message')).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForElementToHide = async (
  page: Page,
  loadTimeoutMs: number,
  locator: string
) => {
  await expect(page.locator(locator)).toBeHidden({
    timeout: loadTimeoutMs,
  });
};

export const logInAuth = async (page: Page, user: string, pass: string) => {
  await page.goto(`https://${process.env.ENV}-dashboard.expedock.com/`);
  await page.locator('#username').fill(user);
  await page.locator('#password').fill(pass);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL(
    `https://${process.env.ENV}-dashboard.expedock.com/**/`
  );
  await expect(page.getByTestId('account-user-name')).toBeVisible({
    timeout: DEFAULT_TIMEOUT_IN_MS,
  });
};

export function areListsEqual<T>(list1: T[], list2: T[]): boolean {
  if (list1.length !== list2.length) return false;
  return list1.every((value, index) => value === list2[index]);
}

export const waitDashboardLoad = async (
  page: Page
  // loadTimeoutMs: number
) => {
  // let gridCount = 1
  // let chartCount = 0
  // while (gridCount != chartCount){
    // let gridCount =  await page.locator(`//div[contains(@class, "react-grid-item")]`).count
    // let chartCount = await page.locator(`//div[contains(@data-testid, "data-component-")]`).count
    // await expect.poll(async () => page.locator('div').count()).toBeGreaterThanOrEqual(chartCount);
    // console.log(`${gridCount} : ${chartCount}`)
    // await page.waitForLoadState('load', { timeout: 600000 });

    await page.waitForTimeout(60000)

    let isEqual = false;
    let expandCount = 1
    let downloadCount
    const timeout = 60000; // Polling timeout
    const pollingInterval = 500; // Polling every 500ms
    const startTime = Date.now();
  
    while (!isEqual && Date.now() - startTime < timeout) {
      // gridCount =  await page.locator(`//div[contains(@class, "react-grid-item")]`).count
      expandCount =  await page.getByTestId('data-component-expand-button').count()
      downloadCount = await page.getByTestId('download-btn').count()
      // gridCount = await page.getByTestId('data-component-Revenue').count()
      // chartCount = await page.locator(`//div[contains(@data-testid, "data-component-")]`).count
      console.log(`${expandCount} : ${downloadCount}`)
      
      // Check if the element is visible
      isEqual = expandCount == downloadCount
      
      if (!isEqual) {
        // Wait for a short period before polling again
        await page.waitForTimeout(pollingInterval);
      }
    }
  }