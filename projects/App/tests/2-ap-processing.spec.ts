import { test, Page, expect } from '@playwright/test';
import * as path from 'path';

const GLOBALTIMEOUT = 60000
const serialnum = 'QAREGTEST20240816053046'
// const apFilePath = '../fixtures/Case_3_V3.pdf'
const __apFilePath = 'C:/Users/immad/PycharmProjects/expedock-qa-automation/projects/App/fixtures'
const apFileName = 'Case_3_V3.pdf'
const shipmentNo = 'S00004889'
const consolNo = 'C00004136'
const hblNo ='HBL00004889'
const mblNo ='MBL00004136'

test.describe.configure({ mode: 'serial' });

test.describe("AP Job Processing - ForwardingShipment", () => {
  let page: Page;
  test.beforeAll(async({browser}) => {
    page = await browser.newPage();
    await page.goto(global.testTaskUrl);
  })
test('User creates an AP entry and verifies entry was added in the task', async () => {
    await page.goto(global.testTaskUrl)
    await page.getByRole('row', {name:' P Create'}).getByRole('textbox').first().fill('AP1-'+serialnum)
    await page.getByRole('row', {name:' P Create'}).getByRole('button').first().click()
    await page.getByRole('option', {name:'AP Invoice NYC (Demo)'}).click()
    await page.getByLabel('Open').first().click()
    await page.getByRole('option', {name:'qa-passive-1@expedock.com'}).click()
    await page.getByLabel('Open').nth(1).click()
    await page.getByRole('option', {name:'qa-passive-1@expedock.com'}).click()
    await page.getByRole('button', {name:'Create'}).click()
    await expect(page.getByTestId('job-row-AP1-'+serialnum).getByRole('cell',{name:'AP1-'+serialnum}).getByRole('textbox')).toBeVisible({ timeout: GLOBALTIMEOUT })
  });

 test('User selects a file and verifies upload', async () => {
  await page.getByTestId('job-row-AP1-'+serialnum).getByTestId('open-job-button').click()
  await page.getByTestId('upload-icon-btn').click()
  await page.getByTestId('dropzone-input-generic').setInputFiles(path.join(__apFilePath, apFileName))
  await expect(page.getByRole('listitem').getByText('Case_3_V3.pdf')).toBeVisible({ timeout: 5 * GLOBALTIMEOUT })
});

test('User clicks upload and verifies extracted data on job form', async () => {
  await page.getByTestId('upload-btn').click()
  await expect.soft(page.getByLabel('Invoice Number')).toHaveValue('562', {timeout: 10 * GLOBALTIMEOUT})
  await expect.soft(page.getByLabel('Invoice Date')).toHaveValue('04-25-2021')
  await expect.soft(page.getByLabel('Due Date')).toHaveValue('05-25-2021')
  await expect.soft(page.getByLabel('Reference No')).toHaveValue('S00001008')
  await expect.soft(page.getByTestId('Vendor-shipment-field').getByText('DIAO ENG CHAI STEAMSHIP LINE')).toBeVisible()
  await expect.soft(page.getByTestId('Vendor Type-shipment-field').getByText('Steamship Line')).toBeVisible()
  await expect.soft(page.getByText('ForwardingShipmentCargowise')).toBeVisible()
  await expect.soft(page.getByText('MatchError Notes')).toBeVisible()
});

test('User validates form and verifies all warning has been removed', async () => {
  let i: number = 0
  await page.getByLabel('Invoice Number').click()
  while (i < 8) {
    await page.getByTestId('confirm-field-btn').click()
    i++;
  }
  await page.getByTestId('save-and-export-button').click()
  await page.getByTestId('open-check-shipment-info-btn').click()
  await expect(page.getByTestId('check-shipment-info-dialog')).toBeVisible({ timeout: GLOBALTIMEOUT })
});

test('User edits form then checks the shipment using HBL as reference', async () => {
  await page.reload()
  await page.getByLabel('Invoice Number').fill('AP1-'+serialnum)
  await page.getByLabel('Invoice Date').fill('04-25-2024')
  await page.getByLabel('Due Date').fill('05-25-2024')
  await page.getByLabel('Reference No').fill(' ')
  await page.getByLabel('HBL No.').fill(hblNo)
  await page.getByTestId('save-and-export-button').click()
  await page.getByTestId('open-check-shipment-info-btn').click()
  await expect.soft(page.getByTestId('check-shipment-info-dialog')).toBeVisible({ timeout: GLOBALTIMEOUT })
  await expect.soft(page.getByTestId('check-shipment-info-dialog')).toContainText('Forwarding Shipment with reference no. '+shipmentNo+' found using HBL No. '+hblNo,  {timeout: 5 * GLOBALTIMEOUT})
  await expect.soft(page.getByTestId('check-shipment-info-dialog')).toContainText('Shipment is associated to the following consolidation/s: '+consolNo)
})

test('User clicks reconcile from check shipment modal and verifies review modal appears', async () => {
  await page.getByTestId('do-reconcile-btn').click();
  await expect(page.getByRole('heading', {name:'Review Data to Reconcile'})).toBeVisible( {timeout: GLOBALTIMEOUT})
}) 
  
test('User clicks reconcile from data review modal and verifies Reconciliation Results modal appears', async () => {
  await page.getByTestId('recon-button').click()
  await expect.soft(page.getByRole('heading', {name:'Reconciliation Results'})).toBeVisible( {timeout: GLOBALTIMEOUT})
  await expect.soft(page.getByText('Invoice DataCharge')).toBeVisible()
  await expect.soft(page.getByText('Expected DataCharge')).toBeVisible()
}) 

test('User clicks show customer modal and verifies reconciliation attempts are created', async () => {
  await page.getByTestId('show-customer-aprecon').click()
  await page.getByTestId('job-info-tab').click()
  await expect.soft(page.locator('#notesContainer')).toContainText('Successfully reconciled AP invoice. Invoice number: AP1-'+serialnum)
  await expect.soft(page.locator('#notesContainer')).toContainText('Saved reconciliation. Recon attempt ID:')
  await expect.soft(page.locator('#notesContainer')).toContainText('Status: Discrepant. Changed external status from for_expedock to todo.')
})

// test('User push and pulls edocs and verifies correct files are displayed on the page', async () => {
//   await page.getByTestId('edocs-tab')
//   await page.

test('User edits task name and qa and then verifies changes on task page', async () => {
  await page.getByTestId('edocs-tab')
  await page.getByTestId('job-name-input').fill(serialnum+'-edit')
  await page.locator('div').filter({ hasText: /^qa-passive-1@expedock\.comJob Owner$/ }).getByRole('button').click()
  await page.getByRole('option', {name:'imma.damalerio@expedock.com'}).click()
  await page.getByTestId('save-job-details-btn').click()
  await page.waitForTimeout(3000)
  await page.goto(global.testTaskUrl)
  await expect.soft(page.locator("[name='taskReferenceId']")).toBeVisible({timeout: 3 * GLOBALTIMEOUT})
  // await expect.soft(page.locator("[name='taskReferenceId']")).toHaveValue(serialnum+'-edit')
  await expect.soft(page.getByRole('cell', {name: serialnum+'-edit'}).getByRole('textbox')).toBeVisible()
  await expect.soft(page.locator('td:nth-child(6)').first()).toHaveValue('imma.damalerio@expedock.com')
  })
})
