import { Page, test, expect } from '@playwright/test';
import { JobPage } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName, __soaFileName } from '../../constants';
import {
  createJob,
  inputApJobMetaFields,
  inputSoaJobMetaFields,
  inputSoaTableData,
} from '../models/appUtils';
import { reconcileJob } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import { DataSync } from '../models/dataSync';
import { reconDashboard } from '../../Recon/models/reconDashboard';

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let dataSync: DataSync;
let reconPage: reconDashboard;

test.describe.parallel('[75] Set an External Assignee', () => {
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
    reconPage = new reconDashboard(page);
  });

  test.afterAll(async () => {
    await jobTemplate.gotoApJobTemplate();
    await jobTemplate.setDefaultAssignee(`${process.env.APP_DEFAULT_USER}`);
  });

  test('[75.1] for AP Job', async () => {
    // create job
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await inputApJobMetaFields(page, jobName);
    await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
    await reconcileJob(page, 'To Do', 'qa-passive-1@expedock.com');

    // assert external assignee shows in recon dashboard
    await reconPage.gotoReconUrl();
    await reconPage.searchJob(invoiceNumber);
    await reconPage.tabForOtherUsers.click();
    await expect
      .soft(reconPage.tableFirstRow)
      .toContainText('qa-passive-1@expedock.com');
  });

  test('[75.2] for SOA Job', async () => {
    // create job
    const jobName = await createJob(
      page,
      'SOA NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __soaFileName
    );
    const invoiceNumber = await inputSoaJobMetaFields(page, jobName);
    await inputSoaTableData(page, invoiceNumber);
    await reconcileJob(
      page,
      'To Do',
      'qa-passive-1@expedock.com',
      false,
      'soa'
    );

    // assert external assignee shows in recon dashboard
    await reconPage.gotoReconUrl();
    await reconPage.searchJob(invoiceNumber);
    await reconPage.tabForOtherUsers.click();
    await expect
      .soft(reconPage.tableFirstRow)
      .toContainText('qa-passive-1@expedock.com');
  });

  test('[75.3] default assignee for AP Job', async () => {
    //set default assignee
    const defaultAssignee = 'qa-passive-3@expedock.com';
    await jobTemplate.gotoApJobTemplate();
    await jobTemplate.setDefaultAssignee(defaultAssignee);

    // create job
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await inputApJobMetaFields(page, jobName);
    await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
    await reconcileJob(page, undefined, undefined, true);

    // assert external assignee shows in recon dashboard
    await reconPage.gotoReconUrl();
    await reconPage.searchJob(invoiceNumber);
    await reconPage.tabForOtherUsers.click();
    await expect.soft(reconPage.tableFirstRow).toContainText(defaultAssignee);
  });
});
