import { test as setup, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

const authFile = 'playwright/.auth/client.json';

setup('authenticate', async ({ page }) => {
  await page.goto(`https://${process.env.ENV}-dashboard.expedock.com/`);
  await page.locator('#username').fill(`${process.env.FREIGHT_BI_CLIENT_USER}`);
  await page.locator('#password').fill(`${process.env.FREIGHT_BI_CLIENT_PASS}`);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL('https://passive-dashboard.expedock.com/**/');
  await expect(page.getByTestId('account-user-name')).toBeVisible({
    timeout: DEFAULT_TIMEOUT_IN_MS,
  });
  await page.context().storageState({ path: authFile });
});
