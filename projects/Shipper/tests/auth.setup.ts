import { test as setup, expect } from '@playwright/test';
import { setShipperUrl } from '../../utils';

const authFile = 'playwright/.auth/shipper-client.json';
const GLOBALTIMEOUT = 60000

setup('authenticate', async ({ page, browser }) => {
  await page.goto('https://dashdemo.passive-portal.expedock.com/login');
  //Change this to variable
  await page.getByLabel('Email Address').fill("imma.damalerio+QATEST20240823@expedock.com")
  await page.getByLabel('Password').fill("P@ss1234P@ss1234")
  await page.getByRole('button', { name: 'LOG IN' }).click()
  await page.waitForURL('https://dashdemo.passive-portal.expedock.com/login');
  await expect(page.getByTestId('exceptions-management-header')).toBeVisible({ timeout: GLOBALTIMEOUT });
  await page.context().storageState({ path: authFile });
  await setShipperUrl(page.url())
});
