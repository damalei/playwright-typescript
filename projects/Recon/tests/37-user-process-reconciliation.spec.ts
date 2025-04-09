import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { FREIGHT_BI_BASE_URL } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';
import { createJob, reconcileAPInvoice } from '../../App/models/appUtils.ts';
import { TaskPage } from '../../App/models/taskPage.ts';
import { InvoicePage, ReprocessModal } from '../models/invoicePage.ts';
import { JobPage } from '../../App/models/jobPage.ts';

const __apFileName = 'Case_3_V3.pdf';

let signUpPage;
let newTab: Page;
let taskPage: TaskPage;
let page1: Page;
let jobPage: JobPage;

test.describe.serial('[37] User process a reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page1 = await context.newPage();
    signUpPage = new SignUpPage(page1);
    taskPage = new TaskPage(page1);
  });

  test('[37.3] Client clicks on "Re-process via Expedock" from the Recon Dashboard page (To Do)', async () => {
    const jobName = await createJob(
      page1,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await reconcileAPInvoice(page1, jobName);

    // Open a new tab

    newTab = await page1.context().newPage();
    const newTabRecon = new reconDashboard(newTab);
    const newTabInvoicePage = new InvoicePage(newTab);
    await newTab.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);

    // Check Invoice Page Reprocess Button is disabled
    const newTabReprocessModal = new ReprocessModal(newTab);
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);
    await newTabRecon.clickInvoice(newTabRecon.tabToDo, invoiceNumber);
    await newTabInvoicePage.buttonReprocess.click();
    await newTabReprocessModal.inputCorrectInformation.fill('test');
    await newTabReprocessModal.buttonReprocess.click();
    await expect(newTabInvoicePage.buttonReprocess).toBeDisabled();

    // Check Dashboard listing is updated
    await newTabInvoicePage.linkBreadcrumb.click();
    await newTab.reload();
    await newTabRecon.searchJob(invoiceNumber);
    await newTabRecon.tabForExpedock.click();
    await expect(
      newTab.locator(`//a[text()='${invoiceNumber}']`)
    ).toBeVisible();

    // Close the new tab when done
    await newTab.close();

    // Check JMS side Job Notes is updated
    jobPage = new JobPage(page1);
    await page1.reload();
    // await page1.pause()
    await jobPage.tabJobInfo.click();
    await expect(jobPage.divJobNotes).toContainText(
      'Request for Expedock to reprocess by Expedock'
    );
    await expect(jobPage.divJobNotes).toContainText(
      `${invoiceNumber} and its associated shipments are currently being processed by Expedock.`
    );
  });

  test('37.5 Operator moves a reprocessed reconsiliation back to To Do', async () => {
    jobPage = new JobPage(page1);
    await jobPage.buttonSaveAndExport.click();
    await jobPage.optionReconcile.click();
    await modal;
  });
});
