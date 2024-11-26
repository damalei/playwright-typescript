import { test, Page, expect } from '@playwright/test';
import * as path from 'path';
import { serialnum } from '../../constants';

const GLOBALTIMEOUT = 60000;
const __testFilePath = '../fixtures';
const soaFileName = 'Sample SOA - HerculeanOcean Logistics.pdf';

test.describe.configure({ mode: 'serial' });

test.describe('SOA Processing - Upload a SOA file', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(global.testTaskUrl);
  });

  test('User creates an SOA entry and verifies entry was added in the task', async () => {
    await page
      .getByRole('row', { name: ' P Create' })
      .getByRole('textbox')
      .first()
      .fill('SOA1-' + serialnum);
    await page
      .getByRole('row', { name: ' P Create' })
      .getByRole('button')
      .first()
      .click();
    await page.getByRole('option', { name: 'SOA NYC (Demo)' }).click();
    await page.getByLabel('Open').first().click();
    await page
      .getByRole('option', { name: 'qa-passive-1@expedock.com' })
      .click();
    await page.getByLabel('Open').nth(1).click();
    await page
      .getByRole('option', { name: 'qa-passive-1@expedock.com' })
      .click();
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(
      page
        .getByTestId('job-row-SOA1-' + serialnum)
        .getByRole('cell', { name: 'SOA1-' + serialnum })
        .getByRole('textbox')
    ).toBeVisible({ timeout: GLOBALTIMEOUT });
  });

  test('User selects a file and verifies upload', async () => {
    await page
      .getByTestId('job-row-SOA1-' + serialnum)
      .getByTestId('open-job-button')
      .click();
    await page.getByTestId('upload-icon-btn').click();
    await page
      .getByTestId('dropzone-input-generic')
      .setInputFiles(path.join(__testFilePath, soaFileName));
    await expect(
      page.getByText('Sample SOA - HerculeanOcean Logistics-page 1..pdf')
    ).toBeVisible({ timeout: 5 * GLOBALTIMEOUT });
    await expect(
      page.getByText('Sample SOA - HerculeanOcean Logistics-page 2..pdf')
    ).toBeVisible({ timeout: 5 * GLOBALTIMEOUT });
  });

  test('User verifies the information on the job form', async () => {
    test.slow();
    await page.getByLabel('Select all').check();
    await page.getByTestId('upload-btn').click();
    await expect
      .soft(page.getByText('Herculean Ocean Logistics (HEROCEEWR)Vendor'))
      .toBeVisible({ timeout: 5 * GLOBALTIMEOUT });
    await expect
      .soft(page.getByText('Steamship LineVendor Type'))
      .toBeVisible();
  });

  test('User validates form and verifies all warning has been removed', async () => {
    let i: number = 0;
    await page.getByText('Herculean Ocean Logistics (HEROCEEWR)Vendor').click();
    while (i < 2) {
      await page.getByTestId('confirm-field-btn').click();
      i++;
    }
    await expect(
      page.locator('.MuiGrid-root > .MuiSvgIcon-root').first()
    ).not.toBeVisible();
  });

  test('User reconciles using ForwardingShipment', async () => {
    await page.getByTestId('edit-line-item-table').click();
    await page.getByRole('tab', { name: 'Main SOA' }).click();
    await page.locator('.htCommentCell').first().click();
    await page.keyboard.type('invoicenumber1' + serialnum);

    await page.locator('td:nth-child(3)').first().click();
    await page.keyboard.type('S00004884');

    await page.locator('td:nth-child(10)').first().click();
    await page.keyboard.type('FRT');

    await page.locator('td:nth-child(12)').first().click();
    await page.keyboard.type('4780.00');

    await page.locator('td:nth-child(13)').first().click();
    await page.keyboard.type('USD');

    await page.locator('td:nth-child(16)').first().click();
    await page.keyboard.type('2021-07-24');

    await page.locator('td:nth-child(17)').first().click();
    await page.keyboard.type('2021-08-24');

    await page.getByRole('button', { name: 'Reconcile' }).click();
  });
});
