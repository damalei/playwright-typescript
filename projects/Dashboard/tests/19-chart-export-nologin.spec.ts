import { test, Page, expect } from '@playwright/test';
import { Dashboards } from '../models/dashboard';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { logInAuth } from '../../utils';

test.describe.configure({
  mode: 'parallel',
  timeout: DEFAULT_TIMEOUT_IN_MS,
});

test.describe('User downloads charts from Business Performance', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_JIG_USER}`,
      `${process.env.FREIGHT_BI_JIG_PASS}`
    );
    const dashboards = new Dashboards(page);
    await dashboards.goto();
  });

  test('Business Performance', async () => {
    test.setTimeout(1_800_000);
    const dashboards = new Dashboards(page);
    const section = 'BusinessPerformance__';
    await dashboards.acc_businessPerformance.click();
    const dashboardList = await dashboards.getDashboards(page);
    await dashboards.downloadByDashboard(dashboardList, section);
  });

  test('Operations*', async () => {
    test.setTimeout(1_800_000);
    const dashboards = new Dashboards(page);
    const section = 'Operations__';
    await dashboards.acc_operations.click();
    const dashboardList = await dashboards.getDashboards(page);
    await dashboards.downloadByDashboard(dashboardList, section);
  });

  test('Accounting', async () => {
    test.setTimeout(1_800_000);
    const dashboards = new Dashboards(page);
    const section = 'Accounting__';
    await dashboards.acc_accounting.click();
    const dashboardList = await dashboards.getDashboards(page);
    await dashboards.downloadByDashboard(dashboardList, section);
  });

  test('Sales', async () => {
    test.setTimeout(1_800_000);
    const dashboards = new Dashboards(page);
    const section = 'Sales__';
    await dashboards.acc_sales.click();
    const dashboardList = await dashboards.getDashboards(page);
    await dashboards.downloadByDashboard(dashboardList, section);
  });
});
