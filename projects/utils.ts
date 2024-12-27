import { test, Page, expect } from '@playwright/test';

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
  await expect(page.locator('//div[@id="notistack-snackbar"]')).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForElementToHide = async (page: Page, loadTimeoutMs: number, locator: string) => {
  await expect(page.locator(locator)).toBeHidden({
    timeout: loadTimeoutMs,
  });
};