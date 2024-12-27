import { Locator, Page } from '@playwright/test';

export class SideMenu {
  readonly page: Page;
  readonly userProfile: Locator;
  readonly dashboardBuilderOption: Locator;
  readonly userManagement: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProfile = page.getByTestId('account-user-name');
    this.dashboardBuilderOption = page
      .locator("span")
      .filter({ hasText: "Dashboard Builder" });
      this.userManagement = page
      .locator("span")
      .filter({ hasText: "User Management" });
  }
}
