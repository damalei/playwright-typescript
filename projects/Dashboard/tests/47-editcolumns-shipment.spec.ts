import { Page, test, expect } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { ExploreShipments } from '../models/exploreShipments'
import { areListsEqual, waitforTablePageLoad, waitForFilterSectionToLoad, waitForSnackBar, waitForAdvanceSnackBar } from '../../utils';
import { ExplorePayableInvoices } from '../models/ExplorePayableInvoices'

let newHeaderList: string[]

test.describe('[47] Edit columns on the Shipments page', () => {
    let page: Page;
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('https://passive-dashboard.expedock.com/');
    });

    test('[47.5] User rearranges columns', async () => {
        const ship = new ExploreShipments(page)
        await ship.goto()
        const expectedHeaderList = await ship.globalNativeTable.swapColumns(page, 1, 2)
        newHeaderList = await ship.globalNativeTable.dragSourceToTargetColumn(page, 1, 2)
        const listState = await areListsEqual(expectedHeaderList, newHeaderList)
        await expect.soft(listState).toBe(true)
    })

    test('[47.4] User saves columns', async () => {
      const ship = new ExploreShipments(page)
      const pay = new ExplorePayableInvoices(page)
      const expectedHeaderList = newHeaderList
      await ship.globalFilterSection.saveViewButton.click()
      await waitForAdvanceSnackBar(page, DEFAULT_TIMEOUT_IN_MS)
      await pay.goto()
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS)
      await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS)
      await ship.goto()
      await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS)
      await waitforTablePageLoad(page, DEFAULT_TIMEOUT_IN_MS)
      const savedHeaderList = await page.getByTestId('table-header').locator('th').allTextContents()
      const listState = await areListsEqual(expectedHeaderList, savedHeaderList)
      await expect.soft(listState).toBe(true)
  })
})