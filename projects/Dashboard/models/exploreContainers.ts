import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils';
import { GlobalNativeTable } from './globalNativeTable';
import { FREIGHT_BI_BASE_URL } from '../../constants';

const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class ExploreContainers {
  readonly page: Page;
  readonly globalNativeTable: GlobalNativeTable;
  readonly referenceComponent: Locator;
  readonly columnContainer: Locator;
  readonly columnShipmentForwarderReference: Locator;

  constructor(page: Page) {
    this.page = page;
    this.globalNativeTable = new GlobalNativeTable(page);
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
    await waitforTablePageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS);
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }
}
