import { test as setup, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

const authFile = 'playwright/.auth/shipper-client.json';

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
    timeout: DEFAULT_TIMEOUT_IN_MS,
  });
  await page.context().storageState({ path: authFile });
});
