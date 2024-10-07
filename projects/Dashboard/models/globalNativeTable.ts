import { Locator, Page } from '@playwright/test';
import { waitforTablePageLoad } from '../../utils'

const GLOBALTIMEOUT = 60000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

export class GlobalNativeTable {
    readonly page: Page
    readonly columnHeader: Locator
    readonly table: Locator
    readonly editColumnButton: Locator
    readonly editDisableAll: Locator
    readonly editShowAll: Locator

    constructor(page: Page) {
        this.page = page;
        this.columnHeader = page.locator(`//*[contains(@data-testid, "table-header-")]`)
        this.table = page.getByTestId('table')
        this.editColumnButton = page.getByRole('button', {name: 'Edit Columns'})
        this.editDisableAll = page.getByRole('button', {name: 'Disable All'})
        this.editShowAll = page.getByRole('button', {name: 'Show All'})
    }

    async getColumnElements() {
        return await this.columnHeader.all()
    }

    async clickColumnName(element: Locator) {
        const headerName = await element.innerText()
        await element.click()
        return headerName
    }
}
