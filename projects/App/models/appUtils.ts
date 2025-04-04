import { Page, expect, Locator } from '@playwright/test';
import { APP_TASK_COLLECTION_URL, __apFilePath } from '../../constants.ts';
import { TaskPage } from './taskPage.ts';
import { JobPage, ReconcileModal } from './jobPage.ts';

// const __apFilePath = '../qa-automation/projects/App/fixtures/';

export const createJob = async (
  page: Page,
  jobType: string,
  owner: string,
  qa: string,
  fileName: string
) => {
  const jobPage = new JobPage(page);
  const taskPage = new TaskPage(page);
  await page.goto(APP_TASK_COLLECTION_URL);
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
  await jobPage.uploadJobFile(__apFilePath, fileName);
  return jobName;
};

export const createEpochName = () => {
  return `AP-${Math.floor(Date.now() / 1000)}`;
};

export const reconcileAPInvoice = async (page: Page, jobName: string) => {
  const jobPage = new JobPage(page);
  const reconcileModal = new ReconcileModal(page);
  const invoiceNumber = `INV-${jobName}`;
  await jobPage.verifyMetaFields();
  await jobPage.inputInvoiceNumber.fill(invoiceNumber);
  await jobPage.inputInvoiceDate.fill('04-25-2025');
  await jobPage.inputInvoiceDueDate.fill('05-25-2025');
  await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
  await jobPage.buttonSaveAndExport.click();
  await jobPage.optionReconcile.click();
  await reconcileModal.buttonReconcile.click();
  await reconcileModal.buttonShowCustomerAP.click();
  return invoiceNumber;
};
