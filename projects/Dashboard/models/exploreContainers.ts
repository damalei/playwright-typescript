import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { GlobalFilterSection } from './globalFilterSection';

export class ExploreContainers {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnContainer: Locator;
  readonly columnShipmentForwarderReference: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page
      .getByTestId('container_container_number_display')
      .first();
    this.columnContainer = page.getByTestId(
      'table-header-container_container_number_display'
    );
    this.columnShipmentForwarderReference = page.getByTestId(
      'table-header-forwarder_reference'
    );
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/containers');
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
}
