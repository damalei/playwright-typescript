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
