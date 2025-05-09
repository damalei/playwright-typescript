import { Page, test, expect } from '@playwright/test';
import { JobPage } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName } from '../../constants';
import { createJob, inputApJobMetaFields } from '../models/appUtils';
import { reconcileJob } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import { DataSync } from '../models/dataSync';

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let dataSync: DataSync;

test.describe.parallel('[85] User disables auto-reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.APP_TEAMLEAD_USER}`,
      `${process.env.APP_TEAMLEAD_PASS}`
    );
    jobPage = new JobPage(page);
    jobTemplate = new JobTemplate(page);
    dataSync = new DataSync(page);
  });

  test('[86.1] AP reconciles', async () => {
    // disable auto recon
    await jobTemplate.gotoApJobTemplate();
    await jobTemplate.disableAutoRecon();

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
      .not.toContainText('Auto-recon Saved reconciliation. Recon attempt ID:');
    await expect.soft(jobPage.divJobNotes).not.toContainText(/error/i);
    await expect.soft(jobPage.divJobNotes).not.toContainText(/fail/i);
  });
});
