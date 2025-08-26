import { test as setup, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

const authFile = 'playwright/.auth/app-operator.json';

setup('authenticate', async ({ page }) => {
  await page.goto(`https://${process.env.ENV}-app.expedock.com/`);
  await page.locator('#username').fill(`${process.env.APP_CLIENT_USER}`);
  await page.locator('#password').fill(`${process.env.APP_CLIENT_PASS}`);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL(`https://${process.env.ENV}-app.expedock.com/`);
  await expect(page.getByRole('button', { name: '+ Create Task' })).toBeVisible(
    { timeout: DEFAULT_TIMEOUT_IN_MS }
  );
  await page.context().storageState({ path: authFile });
});
