import { Locator, Page } from '@playwright/test';
// import { DEFAULT_GLOBAL_TIMEOUT_MS } from '../constants'
import { waitforTablePageLoad } from '../../utils'
import { GlobalNativeTable } from './globalNativeTable';
import { BASE_URL } from '../../constants';


const GLOBALTIMEOUT = 60000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

export class ExploreReceivableInvoices {
    readonly page: Page;
    readonly globalNativeTable: GlobalNativeTable

    constructor(page: Page) {
        this.page = page;
        this.globalNativeTable = new GlobalNativeTable(page)
    }

    async goto() {
        await this.page.goto(BASE_URL+'/explore/receivable-invoices')
        await waitforTablePageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
      }
}
