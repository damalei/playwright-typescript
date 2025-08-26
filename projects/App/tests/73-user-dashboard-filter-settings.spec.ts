import { Page, test, expect } from '@playwright/test';
import { logInAuth } from '../../utils';
import { APP_BASE_URL, FREIGHT_BI_BASE_URL } from '../../constants';
import { UserSettings } from '../models/userSettings';

let page: Page;
let userSettings: UserSettings;

test.describe.configure({ mode: 'serial' });

//*** Dev Note: This can be a very flaky test due to JMS Saving filters is not instant */

test.describe('[73] user edits the recon dashboard filter settings ', () => {
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

  test('[73.1] Adding dashboard filters ', async () => {
    await page.goto(APP_BASE_URL);
    await userSettings.navigateToUsersPage();
    await userSettings.searchUser('qa-passive-app-recon-client@expedock.com');
    await userSettings.editButton.click();
    await userSettings.addUserDashboardFilters(
      'Casper Chan (CC)',
      ['MNL', 'NYC'],
      ['BRN', 'FDA'],
      'QA Passive 2'
    );
  });

  test('[73.2] Locking dashboard filters ', async () => {
    await userSettings.lockFilterFields();
    await userSettings.updateUserSettings();
    await userSettings.reloadAndReopenUserSettings(
      'qa-passive-app-recon-client@expedock.com'
    );

    await expect(
      page.getByRole('button', { name: 'Casper Chan (CC)' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'MNL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'NYC' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'BRN' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'FDA' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'QA Passive 2' })
    ).toBeVisible();

    const browser = page.context().browser();
    if (!browser) throw new Error('Browser context is null');
    const incognitoContext = await browser.newContext({
      storageState: undefined,
      ignoreHTTPSErrors: true,
    });
    const incognitoPage = await incognitoContext.newPage();

    await logInAuth(
      incognitoPage,
      `${process.env.RECON_CLIENT_USER_2}`,
      `${process.env.RECON_CLIENT_PASS_2}`
    );

    await incognitoPage.goto(`${FREIGHT_BI_BASE_URL}/dashboard/recon-job-list`);
    await expect(
      incognitoPage.getByRole('heading', { name: 'Reconciliation Results' })
    ).toBeVisible();
    await page.waitForTimeout(10000);

    await expect(
      incognitoPage.getByRole('button', { name: 'Casper Chan ' })
    ).toBeVisible();
    await expect(
      incognitoPage.getByRole('button', { name: 'MNL x' })
    ).toBeVisible();
    await expect(
      incognitoPage.getByRole('button', { name: 'NYC x' })
    ).toBeVisible();
    await expect(
      incognitoPage.getByRole('button', { name: 'BRN x' })
    ).toBeVisible();
    await expect(
      incognitoPage.getByRole('button', { name: 'FDA x' })
    ).toBeVisible();
    await expect(
      incognitoPage.getByRole('button', { name: 'QA Passive 2 x' })
    ).toBeVisible();

    await incognitoPage.close();
  });

  test('[73.3] Unlocking dashboard filters ', async () => {
    await page.bringToFront();
    await page.goto(APP_BASE_URL);
    await expect(page.getByTestId('tasks-button')).toBeVisible();
    await expect(page.getByText('1+ Create TaskCreate Job')).toBeVisible();
    await userSettings.navigateToUsersPage();
    await userSettings.searchUser('qa-passive-app-recon-client@expedock.com');
    await userSettings.editButton.click();
    await userSettings.removeAllFilters([
      'Casper Chan (CC)',
      'MNL',
      'NYC',
      'BRN',
      'FDA',
      'QA Passive 2',
    ]);
    await userSettings.updateUserSettings();
    await userSettings.reloadAndReopenUserSettings(
      'qa-passive-app-recon-client@expedock.com'
    );
    await userSettings.unlockFilterFields();
    await userSettings.updateUserSettings();
    await userSettings.reloadAndReopenUserSettings(
      'qa-passive-app-recon-client@expedock.com'
    );

    await expect(
      page.getByRole('button', { name: 'Casper Chan (CC)' })
    ).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'MNL' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'NYC' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'BRN' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'FDA' })).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: 'QA Passive 2' })
    ).not.toBeVisible();

    const browser = page.context().browser();
    if (!browser) throw new Error('Browser context is null');
    const newIncognitoContext = await browser.newContext({
      storageState: undefined,
      ignoreHTTPSErrors: true,
    });
    const newIncognitoPage = await newIncognitoContext.newPage();
    await logInAuth(
      newIncognitoPage,
      `${process.env.RECON_CLIENT_USER_2}`,
      `${process.env.RECON_CLIENT_PASS_2}`
    );

    await newIncognitoPage.goto(
      `${FREIGHT_BI_BASE_URL}/dashboard/recon-job-list`
    );
    await expect(
      newIncognitoPage.getByRole('heading', { name: 'Reconciliation Results' })
    ).toBeVisible();
    await newIncognitoPage.waitForTimeout(5000);

    await expect(
      newIncognitoPage.getByRole('button', { name: 'Casper Chan ' })
    ).not.toBeVisible();
    await expect(
      newIncognitoPage.getByRole('button', { name: 'MNL x' })
    ).not.toBeVisible();
    await expect(
      newIncognitoPage.getByRole('button', { name: 'NYC x' })
    ).not.toBeVisible();
    await expect(
      newIncognitoPage.getByRole('button', { name: 'BRN x' })
    ).not.toBeVisible();
    await expect(
      newIncognitoPage.getByRole('button', { name: 'FDA x' })
    ).not.toBeVisible();
    await expect(
      newIncognitoPage.getByRole('button', { name: 'QA Passive 2 x' })
    ).not.toBeVisible();

    await newIncognitoContext.close();
  });
});
