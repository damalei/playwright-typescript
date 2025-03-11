import { Locator, Page } from '@playwright/test';
import { FREIGHT_BI_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import {
  waitDashboardLoad,
  waitForFilterSectionToLoad,
  waitforTablePageLoad,
} from '../../utils';
import * as path from 'path';
import * as os from 'os';

const __saveFilePath = path.join(os.homedir(), 'Downloads', path.sep);

export class Dashboards {
  readonly page: Page;
  readonly acc_businessPerformance: Locator;
  readonly acc_operations: Locator;
  readonly acc_accounting: Locator;
  readonly acc_sales: Locator;
  readonly chartlist_Overview: String[];

  constructor(page: Page) {
    this.page = page;
    this.acc_businessPerformance = page.getByTestId(
      'menu-item-business-performance'
    );
    this.acc_operations = page.getByTestId('menu-item-operations');
    this.acc_accounting = page.getByTestId('menu-item-accounting');
    this.acc_sales = page.getByTestId('menu-item-sales');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL);
  }

  async exportChart(chartName: string, section: string, dashboard: string) {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page
      .locator(`[data-testid*="${chartName}"]`)
      .getByTestId('download-btn')
      .click();
    const download = await downloadPromise;
    await download.saveAs(
      __saveFilePath + section + dashboard + download.suggestedFilename()
    );
    await this.page.waitForTimeout(60000);
  }

  async exportChartExact(
    chartName: string,
    section: string,
    dashboard: string
  ) {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page
      .locator(`[data-testid="${chartName}"]`)
      .getByTestId('download-btn')
      .click();
    const download = await downloadPromise;
    await download.saveAs(
      __saveFilePath + section + dashboard + download.suggestedFilename()
    );
    await this.page.waitForTimeout(60000);
  }

  async getDashboards(page: Page) {
    const dashboardList = await page
      .getByTestId('sidebar-tab-wrapper-BUSINESS_PERFORMANCE')
      .locator('li > a > span')
      .allTextContents();
    console.log(dashboardList);
    return dashboardList;
  }

  async downloadByDashboard(dashboardList: string[], section: string) {
    for (const dashboard of dashboardList) {
      await this.page
        .locator('span')
        .getByText(`${dashboard}`, { exact: true })
        .click();
      await waitDashboardLoad(this.page);
      const count = await this.page.getByTestId('download-btn').count();
      console.log(`DL BUTTON COUNT ${count}`);
      await this.downloadCharts(section, dashboard, count);
    }
  }

  async downloadCharts(section: string, dashboard: string, count: number) {
    console.log('Starting download');
    for (let i = 0; i < count; i += 1) {
      const downloadPromise = this.page.waitForEvent('download');
      await this.page.getByTestId('download-btn').nth(i).click();
      const download = await downloadPromise;
      const modDashboard = dashboard.replace('*', 'ast');
      await download.saveAs(
        __saveFilePath +
          section +
          modDashboard +
          '__' +
          download.suggestedFilename()
      );
    }
  }
}
