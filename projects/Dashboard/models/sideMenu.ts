import { Locator, Page } from '@playwright/test';
import { waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class SideMenu {
  readonly page: Page;
  readonly userProfile: Locator;
  readonly dashboardBuilderOption: Locator;
  readonly userManagement: Locator;
  readonly listUserManagement: Locator;
  readonly accBP: Locator;
  readonly accOperations: Locator;
  readonly accAccounting: Locator;
  readonly listWrapperBusiness: Locator;
  readonly apiSummary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProfile = page.getByTestId('account-user-name');
    this.dashboardBuilderOption = page
      .locator('span')
      .filter({ hasText: 'Dashboard Builder' });
    this.userManagement = page
      .locator('span')
      .filter({ hasText: 'User Management' });
    this.listUserManagement = page.locator('//span[text()="User Management"]');
    this.accBP = page.locator('//span[text()="Business Performance"]');
    this.accOperations = page.locator('//span[text()="Operations"]');
    this.accAccounting = page.locator('//span[text()="Accounting"]');
    this.listWrapperBusiness = page.getByTestId(
      'sidebar-tab-wrapper-BUSINESS_PERFORMANCE'
    );
    this.apiSummary = page.getByTestId('account-user-api-partner-list');
  }

  async clickOnDashboardName(dashboardName: string) {
    await this.page.locator(`//span[text()="${dashboardName}"]`).click();
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }
}
