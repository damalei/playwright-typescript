import { test, Page, expect } from '@playwright/test';
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
  await expect(page.locator('//div[@id="notistack-snackbar"]')).toBeVisible({
    timeout: loadTimeoutMs,
  });
};

export const waitForElementToHide = async (page: Page, loadTimeoutMs: number, locator: string) => {
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
