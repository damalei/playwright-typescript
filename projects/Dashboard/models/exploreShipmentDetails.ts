import { Locator, Page } from '@playwright/test';
import { GlobalNativeTable } from './globalNativeTable';

export class ExploreShipmentDetails {
    readonly page: Page
    readonly globalNativeTable: GlobalNativeTable
    readonly referenceComponent: Locator
    readonly columnForwarderReference: Locator

    constructor(page: Page) {
        this.page = page;
        this.globalNativeTable = new GlobalNativeTable(page)
        this.referenceComponent = page.getByTestId('shipment-details-summary').first()
    }

    async waitForReferenceComponent() {
        await this.referenceComponent.waitFor({state: 'visible'})
    }

}