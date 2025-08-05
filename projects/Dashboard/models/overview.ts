import { Locator, Page } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { waitForChartPageLoad, waitForFilterSectionToLoad } from '../../utils';

export class Overview {
  readonly page: Page;
  readonly chartRevenueLastMonth: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chartRevenueLastMonth = page.getByTestId(
      'data-component-Revenue for Latest Month'
    );
  }
}
