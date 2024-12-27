import { test, expect } from '@playwright/test';
import { setGlobalData } from '../../utils';
import { QA_AUTOMATION_ID } from '../../constants';
import { APP_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';

test.describe.configure({ mode: 'serial' });

test('create a task', async ({ page }) => {
  await page.goto(APP_BASE_URL);
  await page.getByText('+ Create Task').click();
  //insert function test unique serial number
  await page.getByTestId('task-name-textfield').fill(QA_AUTOMATION_ID);
  await page
    .getByTestId('task-message')
    .locator('textarea')
    .fill(QA_AUTOMATION_ID + ' message');
  await page.getByTestId('task-reference-textfield').fill(QA_AUTOMATION_ID);
  await page.locator('#company-select').click();
  await page.locator('#menu-').getByTestId('AP Invoice (Demo)').click();
  await page.getByTestId('create-task-button').click();
  await expect(page.locator('#task-details-title')).not.toBeVisible({
    timeout: DEFAULT_TIMEOUT_IN_MS,
  });
});

test('search and open new task as a page', async ({ page }) => {
  await page.goto(APP_BASE_URL);
  await page
    .getByTestId('task-search-bar')
    .locator('input')
    .fill(QA_AUTOMATION_ID);
  await page.getByTestId('task-search-bar').press('Enter');
  await page
    .getByTestId('task-card-' + QA_AUTOMATION_ID)
    .click({ timeout: DEFAULT_TIMEOUT_IN_MS });
  await page.getByText('Open as page').click();
  await expect
    .soft(page.locator("[name='taskReferenceId']"))
    .toBeVisible({ timeout: 3 * DEFAULT_TIMEOUT_IN_MS });
  await expect
    .soft(page.locator("[name='taskReferenceId']"))
    .toHaveValue(QA_AUTOMATION_ID);
  await setGlobalData(page.url());
});
