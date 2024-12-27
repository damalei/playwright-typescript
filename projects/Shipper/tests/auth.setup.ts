import { test as setup, expect } from '@playwright/test';
import { setShipperUrl } from '../../utils';

const authFile = 'playwright/.auth/shipper-client.json';
const GLOBALTIMEOUT = 60000;

setup('authenticate', async ({ page, browser }) => {
  await page.goto(
    `https://dashdemo.${process.env.ENV}-portal.expedock.com/login`
  );
  await page
    .getByLabel('Email Address')
    .fill(`${process.env.SHIPPER_VIZ_CLIENT_USER}`);
  await page
    .getByLabel('Password')
    .fill(`${process.env.SHIPPER_VIZ_CLIENT_PASS}`);
  await page.getByRole('button', { name: 'LOG IN' }).click();
  await page.waitForURL('https://dashdemo.passive-portal.expedock.com/login');
  await expect(page.getByTestId('exceptions-management-header')).toBeVisible({
    timeout: GLOBALTIMEOUT,
  });
  await page.context().storageState({ path: authFile });
});
