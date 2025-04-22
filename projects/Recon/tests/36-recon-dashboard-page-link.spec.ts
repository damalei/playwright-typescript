import { test, expect, Page } from '@playwright/test';
import { SignUpPage } from '../../Shipper/models/signUp.ts';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants.ts';
import { reconDashboard } from '../models/reconDashboard.ts';

let signUpPage;
let page: Page;
let recon;

test.describe('[36] Recon Dashboard User Access', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    signUpPage = new SignUpPage(page);
    recon = new reconDashboard(page);
  });

  test('[36.2] Client clicks on the "Reconciliation Results" link from the breadcrumbs', async () => {
    await signUpPage.gotoDashboard();
    await recon.gotoReconDashboard();
    await recon.clickJobLink();
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'All');
    await recon.expectExportButtonVisible(page, 'All');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'No Shipment Found');
    await recon.expectExportButtonVisible(page, 'No Shipment Found');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'For Expedock');
    await recon.expectExportButtonVisible(page, 'For Expedock');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'For Other Users');
    await recon.expectExportButtonVisible(page, 'For Other Users');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'Matched');
    await recon.expectExportButtonVisible(page, 'Matched');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'Done');
    await recon.expectExportButtonVisible(page, 'Done');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();

    await recon.clickTab(page, 'Disputes');
    await recon.expectExportButtonVisible(page, 'Disputes');
    await recon.clickJobLink();
    await recon.waitForPageLoad(page);
    await recon.clickReconBreadcrumb();
  });
});
