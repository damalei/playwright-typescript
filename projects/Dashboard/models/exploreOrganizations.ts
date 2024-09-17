import { Locator, Page } from '@playwright/test';
// import { DEFAULT_GLOBAL_TIMEOUT_MS } from '../constants'
import { waitforTablePageLoad } from '../../utils'
import { GlobalNativeTable } from './globalNativeTable';
import { BASE_URL } from '../../constants';

const GLOBALTIMEOUT = 60000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

export class ExploreOrganizations {
    readonly page: Page;
    readonly globalNativeTable: GlobalNativeTable
    readonly referenceComponent: Locator
    readonly columnOrganization: Locator

    constructor(page: Page) {
        this.page = page;
        this.globalNativeTable = new GlobalNativeTable(page)
        this.referenceComponent = page.getByTestId('org_name').first()
        this.columnOrganization = page.getByTestId('table-header-org_name')
    }

    async goto() {
        await this.page.goto(BASE_URL+'/explore/explore-organizations')
        await waitforTablePageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
      }

      async waitForReferenceComponent() {
        await this.referenceComponent.waitFor({state: 'visible'})
    }

}
