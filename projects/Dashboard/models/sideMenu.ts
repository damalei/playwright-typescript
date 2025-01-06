import { Locator, Page } from '@playwright/test';

export class SideMenu {
  readonly page: Page;
  readonly userProfile: Locator;
  readonly dashboardBuilderOption: Locator;
  readonly userManagement: Locator;
  readonly listUserManagement: Locator
  readonly accBP: Locator;
  readonly listWrapperBusiness: Locator;
  readonly apiSummary: Locator;


  constructor(page: Page) {
    this.page = page;
    this.userProfile = page.getByTestId('account-user-name');
    this.dashboardBuilderOption = page
      .locator("span")
      .filter({ hasText: "Dashboard Builder" });
      this.userManagement = page
      .locator("span")
      .filter({ hasText: "User Management" });
    this.listUserManagement = page.locator('//span[text()="User Management"]')
    this.accBP = page.locator('//span[text()="Business Performance"]')
    this.listWrapperBusiness = page.getByTestId('sidebar-tab-wrapper-BUSINESS_PERFORMANCE')
    this.apiSummary = page.getByTestId('account-user-api-partner-list');
  }

  async clickOnDashboardName(dashboardName: string) {
    this.page.locator(`//span[text()="${dashboardName}"]`).click()
  }
  
}
