import { test, expect, Page } from '@playwright/test';
import { reconDashboard } from '../models/reconDashboard.ts';
import { FREIGHT_BI_BASE_URL } from '../../constants.ts';

let page: Page;
let recon;

test.describe('[83] User exports from the reconciliation table', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    recon = new reconDashboard(page);
  });

  test('[83.1] User exports from the each recon tab', async () => {
    await recon.gotoReconUrl();

    const tabs = [
      'All',
      'To Do',
      'No Shipment Found',
      'For Expedock',
      'For Other Users',
      'Matched',
      'Done',
      'Disputes',
    ];

    for (const tab of tabs) {
      const success = await recon.exportTab(tab);
      await expect.soft(success).toBe(true);
    }
  });
});
