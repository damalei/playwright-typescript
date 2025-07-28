import { Page } from '@playwright/test';
import { APP_TASK_COLLECTION_URL, __apFilePath } from '../../constants.ts';
import { TaskPage } from './taskPage.ts';
import { JobPage, ReconcileModal } from './jobPage.ts';

export const createJob = async (
  page: Page,
  jobType: string,
  owner: string,
  qa: string,
  fileName: string,
  task: string = APP_TASK_COLLECTION_URL
) => {
  const jobPage = new JobPage(page);
  const taskPage = new TaskPage(page);
  await page.goto(task);
  const jobName = `QATEST${createEpochName()}`;
  await taskPage.inputJobName.fill(jobName);
  await taskPage.clickJobType(jobName);
  await page.getByRole('option', { name: `${jobType}` }).click();
  await taskPage.inputOwner.click();
  await page.getByRole('option', { name: `${owner}` }).click();
  await taskPage.inputQa.click();
  await page.getByRole('option', { name: `${qa}` }).click();
  await taskPage.buttonCreate.click();
  await taskPage.openNewJob(jobName);
  await jobPage.uploadJobFile(__apFilePath, fileName, jobType);
  return jobName;
};

export const createEpochName = () => {
  return `AP-${Math.floor(Date.now() / 1000)}`;
};

export const reconcileAPInvoice = async (
  page: Page,
  jobName: string,
  externalStatus: string = 'To Do',
  externalAssignee: string = 'qa-passive-2@expedock.com'
) => {
  const jobPage = new JobPage(page);
  const invoiceNumber = `INV-${jobName}`;
  await jobPage.verifyMetaFields();
  await jobPage.inputInvoiceNumber.fill(invoiceNumber);
  await jobPage.inputInvoiceDate.fill('04-25-2025');
  await jobPage.inputInvoiceDueDate.fill('05-25-2025');
  await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
  await reconcileJob(page, externalStatus, externalAssignee);
  return invoiceNumber;
};

export const inputApJobMetaFields = async (page: Page, jobName: string) => {
  const jobPage = new JobPage(page);
  const invoiceNumber = `INV-${jobName}`;
  await jobPage.verifyMetaFields();
  await jobPage.inputInvoiceNumber.fill(invoiceNumber);
  await jobPage.inputInvoiceDate.fill('04-25-2025');
  await jobPage.inputInvoiceDueDate.fill('05-25-2025');
  await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
  return invoiceNumber;
};

export const reconcileJob = async (
  page: Page,
  externalStatus: string = 'To Do',
  externalAssignee: string = 'qa-passive-2@expedock.com',
  isAutoAssign: boolean = false,
  jobType: string = 'ap'
) => {
  const jobPage = new JobPage(page);
  const reconcileModal = new ReconcileModal(page);
  await jobPage.buttonSaveAndExport.click();
  if (jobType === 'ap') {
    await jobPage.optionReconcile.click();
    await reconcileModal.buttonReconcile.click();
    await addAssigneeAP(page, externalStatus, externalAssignee, isAutoAssign);
    await reconcileModal.buttonShowCustomerAP.click();
    await page
      .getByText('Successfully saved recon details')
      .nth(0)
      .waitFor({ state: 'visible' });
  } else {
    await page.getByText('Batch Reconcile SOA').click();
    await page.getByRole('button', { name: 'Reconcile' }).click();
    await addAssigneeSOA(page, externalStatus, externalAssignee, isAutoAssign);
    await page
      .getByText('Saved recon attempts in batch')
      .waitFor({ state: 'visible' });
  }
};

export const addAssigneeAP = async (
  page: Page,
  externalStatus: string = 'To Do',
  externalAssignee: string = 'qa-passive-2@expedock.com',
  isAutoAssign: boolean = false
) => {
  const reconcileModal = new ReconcileModal(page);
  if (!isAutoAssign) {
    await reconcileModal.buttonSaveJobDetails.scrollIntoViewIfNeeded();
    await reconcileModal.selectAssignee(externalAssignee);
    await reconcileModal.selectExternalStatus(externalStatus);
    await reconcileModal.buttonSaveJobDetails.click();
  }
};

export const addAssigneeSOA = async (
  page: Page,
  externalStatus: string = 'To Do',
  externalAssignee: string = 'qa-passive-2@expedock.com',
  isAutoAssign: boolean = false
) => {
  const reconcileModal = new ReconcileModal(page);
  await page
    .getByTestId('external-assignee-autocomplete')
    .first()
    .waitFor({ state: 'visible' });
  const count = await page
    .getByTestId('external-assignee-autocomplete')
    .count();
  console.log(count);
  if (!isAutoAssign) {
    for (let i = 0; i < count; i++) {
      await page.getByTestId('external-assignee-autocomplete').nth(i).hover();
      await page
        .getByTestId('external-assignee-autocomplete')
        .nth(i)
        .getByTestId('CloseIcon')
        .click();
      await page
        .getByTestId('external-assignee-autocomplete')
        .nth(i)
        .locator('input')
        .fill(externalAssignee);
      await page.getByRole('option', { name: `${externalAssignee}` }).click();
    }
    await page.getByTestId('show-customer-button').scrollIntoViewIfNeeded();
    await page.getByTestId('show-customer-button').click();
  }
};

export const inputSoaJobMetaFields = async (page: Page, jobName: string) => {
  const jobPage = new JobPage(page);
  const invoiceNumber = `INV-${jobName}`;
  await page
    .getByTestId('Vendor-shipment-field')
    .locator('textarea')
    .nth(0)
    .fill('Herculean Ocean Logistics (HEROCEEWR)');
  await page
    .getByRole('option', { name: 'Herculean Ocean Logistics (HEROCEEWR)' })
    .click();
  await page
    .getByTestId('Vendor Type-shipment-field')
    .locator('textarea')
    .nth(0)
    .fill('Steamship Line');
  await page.getByRole('option', { name: 'Steamship Line' }).click();
  await jobPage.verifySOAMetaFields(jobPage.inputVendor);
  return invoiceNumber;
};

export const inputSoaTableData = async (page: Page, invoiceNumber: string) => {
  const jobPage = new JobPage(page);
  await page.getByTestId('edit-line-item-table').first().click();
  await page.getByText('Main SOA').click();
  await page
    .getByTestId('soa-main-table')
    .locator('tbody')
    .locator('tr')
    .nth(0)
    .locator('td')
    .nth(0)
    .click();
  await page
    .getByTestId('soa-main-table')
    .locator('tbody')
    .locator('tr')
    .nth(0)
    .locator('td')
    .nth(0)
    .pressSequentially(invoiceNumber);
  const numberKeyed: { [key: number]: string } = {
    2: '100',
    8: 'FRT',
    9: 'Sea Freight',
    10: '4780.00',
    11: 'USD',
    14: '2021-07-24',
    15: '2021-08-24',
    16: 'ForwardingShipment',
  };
  for (const [key, value] of Object.entries(numberKeyed)) {
    await page
      .getByTestId('soa-main-table')
      .locator('tbody')
      .locator('tr')
      .nth(0)
      .locator('td')
      .nth(parseInt(key))
      .click();
    await page
      .getByTestId('soa-main-table')
      .locator('tbody')
      .locator('tr')
      .nth(0)
      .locator('td')
      .nth(parseInt(key))
      .pressSequentially(value);
  }
  await page.getByTestId('hide-line-item-table').click();
};
