import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;

test.describe('[37] User process a reconciliation', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[37.2] Client clicks on "Re-assign" from the Recon Dashboard page', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();
    const jobText = await recon.getFirstReconJobLinkText(page);
    console.log('Reassigning job: ' + jobText);
    await recon.clickJobLink();
    await recon.reassignReconJob(page, 'qa-passive-3@expedock.com');
    await recon.clickReconBreadcrumb();
    await page.reload();
    await recon.verifyReassignedJob(
      page,
      jobText,
      recon,
      'qa-passive-3@expedock.com'
    );
  });
});
