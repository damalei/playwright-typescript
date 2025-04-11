import { test, expect, Page, BrowserContext } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';
import { createJob, reconcileAPInvoice } from '../../App/models/appUtils.ts';
import { TaskPage } from '../../App/models/taskPage.ts';
import { JobPage } from '../../App/models/jobPage.ts';

const __apFileName = 'Case_3_V3.pdf';

let page: Page;
let newReconPage: Page;
let recon;
let taskPage: TaskPage;
let jobPage: JobPage;

test.describe('[37] User process a reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page = await context.newPage();
    recon = new reconDashboard(page);
    taskPage = new TaskPage(page);
  });

  test('[37.2] Client clicks on "Re-assign" from the Recon Dashboard page', async () => {
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
    const userEmail = 'qa-passive-3@expedock.com';
    await newReconPage.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.waitForTableToLoad(newReconPage);
    await ReconPage.searchJob(invoiceNumber);
    await ReconPage.clickInvoice(ReconPage.tabToDo, invoiceNumber);
    const shipmentReference = await ReconPage.firstReconShipmentReference
      .locator('div.MuiStack-root h6')
      .textContent();
    await ReconPage.firstReconShipmentReference.click();
    await ReconPage.reassignReconJob(newReconPage, userEmail);
    await ReconPage.clickReconBreadcrumb();
    await page.reload();
    await ReconPage.verifyReassignedJob(
      newReconPage,
      invoiceNumber,
      ReconPage,
      userEmail
    );
    await expect(
      newReconPage.getByRole('cell', { name: invoiceNumber })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(
      newReconPage.getByRole('cell', { name: userEmail })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await ReconPage.clickJobLink();
    await ReconPage.clickReconViewNotesTab();
    await expect(
      newReconPage.locator('h6.MuiTypography-root.MuiTypography-h6.css-1gd1ckd')
    ).toContainText(
      `Reassigned ${shipmentReference} from ${process.env.RECON_CLIENT_USER} to ${userEmail} by Expedock`
    );
    await newReconPage.close();

    jobPage = new JobPage(page);
    await page.reload();
    await jobPage.tabJobInfo.click();
    await jobPage.divJobNotes.scrollIntoViewIfNeeded();
    await expect(
      page
        .locator('p.MuiTypography-root.MuiTypography-body1.css-10qcsxr')
        .last()
    ).toContainText(
      `Reassigned from ${process.env.RECON_CLIENT_USER} to ${userEmail} by Expedock`
    );
  });
});
