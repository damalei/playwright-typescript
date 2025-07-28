import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';
import { createJob, reconcileAPInvoice } from '../../App/models/appUtils.ts';
import { TaskPage } from '../../App/models/taskPage.ts';
import { JobPage } from '../../App/models/jobPage.ts';

const __apFileName = 'Case_3_V3.pdf';

let signUpPage;
let page: Page;
let newReconPage: Page;
let recon;
let taskPage: TaskPage;
let jobPage: JobPage;

test.describe('[37 & 95] User process a reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page = await context.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
    taskPage = new TaskPage(page);
  });

  test('[37.1] Client clicks on "Move to Done" / "Mark as Reviewed" from the Recon Dashboard Invoice page', async () => {
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await reconcileAPInvoice(page, jobName);
    newReconPage = await page.context().newPage();
    const ReconPage = new reconDashboard(newReconPage);
    await newReconPage.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.clickInvoice(ReconPage.tabToDo, invoiceNumber);
    await ReconPage.markReconJobAsReviewed(newReconPage);
    await expect(ReconPage.markAsReviewedBtn).not.toBeVisible();
    await ReconPage.clickReconBreadcrumb();
    await page.reload();
    await ReconPage.verifyMarkReconJobAsReviewed(
      newReconPage,
      invoiceNumber,
      ReconPage
    );
    await expect(
      newReconPage.getByRole('cell', { name: invoiceNumber })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await ReconPage.clickJobLink();
    await ReconPage.clickReconViewNotesTab();
    await expect(ReconPage.notesTabPanel).toContainText(
      `${invoiceNumber} is marked as reviewed by Expedock.`
    );
    await newReconPage.close();

    jobPage = new JobPage(page);
    await page.reload();
    await jobPage.tabJobInfo.click();
    await jobPage.divJobNotes.scrollIntoViewIfNeeded();
    await expect(jobPage.divJobNotes).toContainText(
      `${invoiceNumber} is marked as reviewed by Expedock.`
    );
    await newReconPage.close();
  });

  test('[37.1-B 95.1] Client clicks on "Move to Done" / "Mark as Reviewed" from the Recon Dashboard Invoice <> Shipment Reference page', async () => {
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    const invoiceNumber = await reconcileAPInvoice(page, jobName);
    newReconPage = await page.context().newPage();
    const ReconPage = new reconDashboard(newReconPage);
    await newReconPage.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.clickInvoice(ReconPage.tabToDo, invoiceNumber);
    await ReconPage.firstReconShipmentReference.click();
    await ReconPage.markReconJobAsReviewed(newReconPage);
    await expect(ReconPage.markAsReviewedBtn).not.toBeVisible();
    await ReconPage.clickReconBreadcrumb();
    await page.reload();
    await ReconPage.verifyMarkReconJobAsReviewed(
      newReconPage,
      invoiceNumber,
      ReconPage
    );
    await expect(
      newReconPage.getByRole('cell', { name: invoiceNumber })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await ReconPage.clickJobLink();
    await ReconPage.clickReconViewNotesTab();
    await expect(ReconPage.notesTabPanel).toContainText(
      `${invoiceNumber} is marked as reviewed by Expedock.`
    );
    await newReconPage.close();

    jobPage = new JobPage(page);
    await page.reload();
    await jobPage.tabJobInfo.click();
    await jobPage.divJobNotes.scrollIntoViewIfNeeded();
    await expect(jobPage.divJobNotes).toContainText(
      `${invoiceNumber} is marked as reviewed by Expedock.`
    );
    await newReconPage.close();
  });
});
