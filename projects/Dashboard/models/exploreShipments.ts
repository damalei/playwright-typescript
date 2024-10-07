import { Locator, Page } from '@playwright/test';
// import { DEFAULT_GLOBAL_TIMEOUT_MS } from '../constants'
import { waitforTablePageLoad } from '../../utils'
import { GlobalNativeTable } from './globalNativeTable';
import { BASE_URL } from '../../constants';

const GLOBALTIMEOUT = 60000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

export class ExploreShipments {
    readonly page: Page
    readonly globalNativeTable: GlobalNativeTable
    readonly referenceComponent: Locator
    readonly columnForwarderReference: Locator

    constructor(page: Page) {
        this.page = page;
        this.globalNativeTable = new GlobalNativeTable(page)
        this.referenceComponent = page.getByTestId('forwarder_reference').first()
        this.columnForwarderReference = page.getByTestId('table-header-forwarder_reference')
    }

    async goto() {
        await this.page.goto(BASE_URL+'/explore/explore-shipments')
        await waitforTablePageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
      }

    async waitForReferenceComponent() {
        await this.referenceComponent.waitFor({state: 'visible'})
    }

}
