import { test, expect, Page, BrowserContext } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';
import { createJob, reconcileAPInvoice } from '../../App/models/appUtils.ts';
import { TaskPage } from '../../App/models/taskPage.ts';
import { InvoicePage, ReprocessModal } from '../models/invoicePage.ts';
import { JobPage, ReconcileModal } from '../../App/models/jobPage.ts';

const __apFileName = 'Case_3_V3.pdf';

let newTab: Page;
let taskPage: TaskPage;
let page1: Page;
let jobPage: JobPage;
let invoiceNumber: string;

test.describe
  .serial('[95] Client processes a reconciliation from the invoice <> reference page', () => {
  test.beforeAll(async ({ browser }) => {
    const context: BrowserContext = await browser.newContext();
    page1 = await context.newPage();
    taskPage = new TaskPage(page1);
  });

  test('[95.3] Client reprocess a job via invoice <> reference page (re-process via Expedock button)', async () => {
    const jobName = await createJob(
      page1,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    invoiceNumber = await reconcileAPInvoice(page1, jobName);

    newTab = await page1.context().newPage();
    const newTabRecon = new reconDashboard(newTab);
    const newTabInvoicePage = new InvoicePage(newTab);
    await newTab.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);

    const newTabReprocessModal = new ReprocessModal(newTab);
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);

    await newTabRecon.clickInvoice(newTabRecon.tabToDo, invoiceNumber);
    await newTabRecon.firstReconShipmentReference.click();
    await newTabInvoicePage.buttonReprocess.click();
    await newTabReprocessModal.inputCorrectInformation.fill('test');
    await newTabReprocessModal.buttonReprocess.click();
    await expect(newTabInvoicePage.buttonReprocess).toBeDisabled();

    await newTabInvoicePage.linkBreadcrumb.click();
    await newTab.reload();
    await newTabRecon.searchJob(invoiceNumber);
    await newTabRecon.tabForExpedock.click();
    await expect(
      newTab.locator(`//a[text()='${invoiceNumber}']`)
    ).toBeVisible();
    await newTabRecon.clickJobLink();
    await newTabRecon.clickReconViewNotesTab();
    await expect(newTabRecon.notesTabPanel).toContainText(
      'Request for Expedock to reprocess by Expedock'
    );
    await expect(newTabRecon.notesTabPanel).toContainText(
      `${invoiceNumber} and its associated shipments are currently being processed by Expedock.`
    );

    await newTab.close();

    jobPage = new JobPage(page1);
    await page1.reload();
    await jobPage.tabJobInfo.click();
    await expect(jobPage.divJobNotes).toContainText(
      'Request for Expedock to reprocess by Expedock'
    );
    await jobPage.divJobNotes.scrollIntoViewIfNeeded();
    await expect(jobPage.divJobNotes).toContainText(
      `${invoiceNumber} and its associated shipments are currently being processed by Expedock.`
    );
  });

  test('[95.4] Client reprocess a job via invoice <> reference page Okay to post', async () => {
    const jobName = await createJob(
      page1,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );
    invoiceNumber = await reconcileAPInvoice(page1, jobName);

    newTab = await page1.context().newPage();
    const newTabRecon = new reconDashboard(newTab);
    const newTabInvoicePage = new InvoicePage(newTab);
    await newTab.goto(FREIGHT_BI_BASE_URL + '/dashboard/recon-job-list');
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);

    const newTabReprocessModal = new ReprocessModal(newTab);
    await newTabRecon.waitForTableToLoad(newTab);
    await newTabRecon.searchJob(invoiceNumber);

    await newTabRecon.clickInvoice(newTabRecon.tabToDo, invoiceNumber);
    const firstShipment = await newTabRecon.shipmentNumberHeading.textContent();
    if (!firstShipment) {
      throw new Error('Failed to get shipment number');
    }
    await newTabRecon.firstReconShipmentReference.click();
    await newTabRecon.okayToPost('Okay to post test automation');
    await newTabInvoicePage.linkBreadcrumb.click();
    await newTab.reload();
    await newTabRecon.searchJob(invoiceNumber);
    await newTabRecon.tabForExpedock.click();
    await expect(
      newTab.locator(`//a[text()='${invoiceNumber}']`)
    ).toBeVisible();
    await newTabRecon.clickJobLink();
    await newTabRecon.clickReconViewNotesTab();
    await expect(newTabRecon.notesPanelHeading).toContainText(
      `${firstShipment} is approved for posting by Expedock.`
    );
    await expect(newTabRecon.chipReadyToPost).toBeVisible();

    await newTab.close();

    jobPage = new JobPage(page1);
    await page1.reload();
    await jobPage.tabJobInfo.click();
    await expect(jobPage.divJobNotes).toContainText(
      `${firstShipment} is approved for posting by Expedock`
    );
    await jobPage.divJobNotes.scrollIntoViewIfNeeded();
  });
});
