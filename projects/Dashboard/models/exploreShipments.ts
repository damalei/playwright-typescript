import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { GlobalFilterSection } from './globalFilterSection';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';

export class ExploreShipments {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly globalFilterSection: GlobalFilterSection;
  readonly referenceComponent: Locator;
  readonly columnForwarderReference: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
    this.globalFilterSection = new GlobalFilterSection(page);
    this.referenceComponent = page.getByTestId('forwarder_reference').first();
    this.columnForwarderReference = page.getByTestId(
      'table-header-forwarder_reference'
    );
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/explore/explore-shipments');
    await waitforTablePageLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
}
