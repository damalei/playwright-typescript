import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/client.json';
const GLOBALTIMEOUT = 60000


setup('authenticate', async ({ page, browser }) => {
  await page.goto('https://passive-dashboard.expedock.com/');
  //Change this to variable
  await page.locator("#username").fill("qa-passive-1@expedock.com")
  await page.locator("#password").fill("GgZHcs73:A,6~KM]{f%tz_")
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.waitForURL("https://passive-dashboard.expedock.com/**/");
  await expect(page.getByTestId('account-user-name')).toBeVisible({ timeout: GLOBALTIMEOUT });
  await page.context().storageState({ path: authFile });
});
