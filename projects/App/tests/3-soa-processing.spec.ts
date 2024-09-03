import { test, Page, expect } from '@playwright/test';
import * as path from 'path';
import { serialnum } from '../../constants';

const GLOBALTIMEOUT = 60000
const __testFilePath = 'C:/Users/immad/PycharmProjects/expedock-qa-automation/projects/App/fixtures'
const soaFileName = 'Sample SOA - HerculeanOcean Logistics.pdf'

test.describe.configure({ mode: 'serial' });

test.describe("SOA Processing - Upload a SOA file", () => {
  let page: Page;
  test.beforeAll(async({browser}) => {
    page = await browser.newPage();
    await page.goto(global.testTaskUrl);
  })

  test('User creates an SOA entry and verifies entry was added in the task', async () => {
    await page.getByRole('row', {name:' P Create'}).getByRole('textbox').first().fill('SOA1-'+serialnum)
    await page.getByRole('row', {name:' P Create'}).getByRole('button').first().click()
    await page.getByRole('option', {name:'SOA NYC (Demo)'}).click()
    await page.getByLabel('Open').first().click()
    await page.getByRole('option', {name:'qa-passive-1@expedock.com'}).click()
    await page.getByLabel('Open').nth(1).click()
    await page.getByRole('option', {name:'qa-passive-1@expedock.com'}).click()
    await page.getByRole('button', {name:'Create'}).click()
    await expect(page.getByTestId('job-row-SOA1-'+serialnum).getByRole('cell',{name:'SOA1-'+serialnum}).getByRole('textbox')).toBeVisible({ timeout: GLOBALTIMEOUT })
  });

  test('User selects a file and verifies upload', async () => {
    await page.getByTestId('job-row-SOA1-'+serialnum).getByTestId('open-job-button').click()
    await page.getByTestId('upload-icon-btn').click()
    await page.getByTestId('dropzone-input-generic').setInputFiles(path.join(__testFilePath, soaFileName))
    await expect(page.getByText('Sample SOA - HerculeanOcean Logistics-page 1..pdf')).toBeVisible({ timeout: 5 * GLOBALTIMEOUT })
    await expect(page.getByText('Sample SOA - HerculeanOcean Logistics-page 2..pdf')).toBeVisible({ timeout: 5 * GLOBALTIMEOUT })
  });

})