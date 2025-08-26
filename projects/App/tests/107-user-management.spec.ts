import { Page, test, expect } from '@playwright/test';
import { logInAuth } from '../../utils';
import { APP_BASE_URL } from '../../constants';
import { UserSettings } from '../models/userSettings';

let page: Page;
let userSettings: UserSettings;

test.describe('[107] User searches a JMS user on JMS', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.APP_TEAMLEAD_USER}`,
      `${process.env.APP_TEAMLEAD_PASS}`
    );
    userSettings = new UserSettings(page);
  });
  test('[107.1] User searches a user on User management ', async () => {
    const userEmail = 'qa-passive-app-recon-client@expedock.com';
    await page.goto(APP_BASE_URL);
    await userSettings.navigateToUsersPage();
    await userSettings.searchUser(userEmail);
    await page.waitForTimeout(2000);
    await expect(page.getByText(userEmail)).toBeVisible();
  });
});
