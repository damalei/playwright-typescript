import { Page, test, expect } from '@playwright/test';
import { JobPage } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName } from '../../constants';
import { createJob, inputApJobMetaFields } from '../models/appUtils';
import { reconcileJob } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import { DataSync } from '../models/dataSync';
import { TaskPage } from '../models/taskPage';

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let dataSync: DataSync;
let taskPage: TaskPage;

test.describe.serial('[85] User enables auto-reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.APP_TEAMLEAS_USER}`,
      `${process.env.APP_TEAMLEAS_PASS}`
    );
    jobPage = new JobPage(page);
    jobTemplate = new JobTemplate(page);
    dataSync = new DataSync(page);
    taskPage = new TaskPage(page);
  });

  test('[85.1] AP reconciliation no shipment', async () => {
    // enable auto recon
    await jobTemplate.gotoApJobTemplate();
    await jobTemplate.enableAutoRecon();

    // create job
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    await inputApJobMetaFields(page, jobName);
    const jobUrl = await page.url();
    await jobPage.inputShipment.fill('NOSHIPS00001008');
    await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
    await jobPage.inputHbl.fill('');
    await jobPage.inputMbl.fill('');
    await jobPage.inputVoyageNumber.fill('');
    await jobPage.inputContainerNumber.fill('');
    await reconcileJob(page);

    // trigger auto recon
    const jobID = dataSync.extractLastPathSegment(jobUrl);
    await dataSync.goto();
    await dataSync.triggerSync(jobID);

    // assert auto recon message is in job notes
    await page.goto(jobUrl);
    await jobPage.tabJobInfo.click();
    await expect
      .soft(jobPage.divJobNotes)
      .toContainText('Auto-recon Saved reconciliation. Recon attempt ID:');
    await expect.soft(jobPage.divJobNotes).not.toContainText(/error/i);
    await expect.soft(jobPage.divJobNotes).not.toContainText(/fail/i);
  });
});
