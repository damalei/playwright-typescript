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

export function getFormattedDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  return `${year} ${month} ${day}`;
}

export function getFormattedDateTime(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year} ${month} ${day} ${hours}:${minutes}:${seconds}`;
}

export function removeTextBetweenPatterns(
  text: string,
  startPattern: string,
  endPattern: string
): string {
  const regex = new RegExp(`${startPattern}.(.+?)${endPattern}`);
  return text.replace(regex, startPattern);
}

export function removeSpacesAndColons(text: string): string {
  return text.replace(/[\s:]/g, '');
}

