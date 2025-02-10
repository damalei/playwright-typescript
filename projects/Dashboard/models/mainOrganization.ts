import { Locator, Page } from '@playwright/test';

export class MainOrganizations {
  readonly page: Page;
  readonly bannerDropdown: Locator;
  readonly filterSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bannerDropdown = page.getByTestId('page-organization-type-dropdown');
    this.filterSection = page.getByTestId('filters');
  }
}
