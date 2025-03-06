import { Locator, Page, expect } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class ExploreContainers {
  readonly page: Page;
  readonly referenceComponent: Locator;
  readonly containersSideDashboard: Locator;
  readonly containersHeader: Locator;
  readonly containersFilterFields: Locator;

  constructor(page: Page) {
    this.page = page;
    this.referenceComponent = page
      .locator('[data-testid*="filtered-shipments-footer"]')
      .first();
    this.containersFilterFields = page.getByTestId('filters');
    this.containersHeader = page.getByText('ContainersSave');
    this.containersSideDashboard = page.getByText('Explore Containers');
  }

  async gotoExploreContainers() {
    await this.containersSideDashboard.click();
    await expect(this.containersFilterFields).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(this.containersHeader).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
    await this.containersFilterFields.waitFor({ state: 'visible' });
  }
}
