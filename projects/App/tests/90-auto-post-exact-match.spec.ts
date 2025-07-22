import { Page, test, expect } from '@playwright/test';
import { JobPage, SendToCwModal } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName, __soaFileName } from '../../constants';
import { createJob, inputApJobMetaFields } from '../models/appUtils';
import { reconcileJob } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import { DataSync } from '../models/dataSync';
import { reconDashboard } from '../../Recon/models/reconDashboard';
import { ApSettingsPage } from '../models/apSettingsPage';

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let dataSync: DataSync;
let reconPage: reconDashboard;
let sendToCwModal: SendToCwModal;
let apSettingsPage: ApSettingsPage;

test.describe.parallel('[90] User sets-up auto post at exact match', () => {
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
    sendToCwModal = new SendToCwModal(page);
    apSettingsPage = new ApSettingsPage(page);
  });

  test('[75.1] for AP Job', async () => {
    // turn on auto post toggle
    await apSettingsPage.goto();
    await apSettingsPage.toggleIfOff(
      page,
      apSettingsPage.toggleAutoPostExactMatch
    );
    await apSettingsPage.saveSettings();

    // create job
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await inputApJobMetaFields(page, jobName);
    const jobUrl = await page.url();
    await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);
    await jobPage.inputHbl.fill('');
    await jobPage.inputMbl.fill('');
    await jobPage.inputVoyageNumber.fill('');
    await jobPage.inputContainerNumber.fill('');
    await jobPage.inputShipment.fill('NOSHIP');

    //reconcile job
    await reconcileJob(page, 'To Do', 'qa-passive-1@expedock.com');

    //edit job
    await jobPage.inputShipment.fill(`${process.env.TS_90_SHIP}`);
    await jobPage.buttonSave.click();
    await page
      .getByText('Saving job details successful')
      .waitFor({ state: 'visible' });

    // trigger auto recon
    const jobID = dataSync.extractLastPathSegment(jobUrl);
    await dataSync.goto();
    await dataSync.triggerSync(jobID);
    await page.waitForTimeout(60000);

    //assert in new recon dashboard
    await reconPage.gotoReconUrl();
    await reconPage.inputSearch.fill(invoiceNumber);
    await reconPage.tabPosted.click();
    await expect
      .soft(page.locator(`//a[text()='${invoiceNumber}']`))
      .toBeVisible();

    //assert in jms
    await page.goto(jobUrl);
    await jobPage.buttonSaveAndExport.click();
    await jobPage.optionSendToCw.click();
    await sendToCwModal.modal.waitFor({ state: 'visible' });
    await expect.soft(sendToCwModal.modal).toContainText('TRUE');
  });
});
