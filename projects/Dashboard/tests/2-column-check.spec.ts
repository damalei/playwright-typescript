import { test, Page, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments'
import { ExploreOrganizations } from '../models/exploreOrganizations'
import { ExplorePayableInvoices } from '../models/explorePayableInvoices'
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices'
import { Console } from 'console';
// import { DEFAULT_GLOBAL_TIMEOUT_MS } from './constants'

const GLOBALTIMEOUT = 60000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

test.describe.configure({
    mode: 'parallel',
    timeout: DEFAULT_GLOBAL_TIMEOUT_MS,
  })

test.describe('User clicks column names on Explore section table headers', () => {

test('Clicking on Explore Shipment table headers, page should not break', async ({ page }) => {
    const exploreShipments = new ExploreShipments(page)
    await exploreShipments.goto()
    const elements = await exploreShipments.globalNativeTable.getColumnElements()
        for (const element of elements) {
            let headerName = await exploreShipments.globalNativeTable.clickColumnName(element)
            console.log('click' + element)
            await expect.soft(exploreShipments.globalNativeTable.table).toBeVisible({ timeout: DEFAULT_GLOBAL_TIMEOUT_MS })
            let isTableVisible = await exploreShipments.globalNativeTable.table.isVisible()
            if (!isTableVisible) {
            console.error(`Error on column click: "${headerName}"`)
            exploreShipments.page.reload()
            } else {}
        }
    })

test('Clicking on Explore Organization table headers, page should not break', async ({ page }) => {
        const exploreOrganizations = new ExploreOrganizations(page)
        await exploreOrganizations.goto()
        const elements = await exploreOrganizations.globalNativeTable.getColumnElements()
        for (const element of elements) {
            let headerName = await exploreOrganizations.globalNativeTable.clickColumnName(element)
            await expect.soft(exploreOrganizations.globalNativeTable.table).toBeVisible({ timeout: DEFAULT_GLOBAL_TIMEOUT_MS })
            let isTableVisible = await exploreOrganizations.globalNativeTable.table.isVisible()
            if (!isTableVisible) {
                console.error(`Error on column click: "${headerName}"`)
                exploreOrganizations.page.reload()
            } else {}
        }
    })

test('Clicking on Payable Invoices table headers, page should not break', async ({ page }) => {
        const explorePayableInvoices = new ExplorePayableInvoices(page)
        await explorePayableInvoices.goto()
        const elements = await explorePayableInvoices.globalNativeTable.getColumnElements()
        for (const element of elements) {
            let headerName = await explorePayableInvoices.globalNativeTable.clickColumnName(element)
            await expect.soft(explorePayableInvoices.globalNativeTable.table).toBeVisible({ timeout: DEFAULT_GLOBAL_TIMEOUT_MS })
            let isTableVisible = await explorePayableInvoices.globalNativeTable.table.isVisible()
            if (!isTableVisible) {
                console.error(`Error on column click: "${headerName}"`)
                explorePayableInvoices.page.reload()
            } else {}
        }
    })

test('Clicking on Receivable Invoices table headers, page should not break', async ({ page }) => {
        const exploreReceivableInvoices = new ExploreReceivableInvoices(page)
        await exploreReceivableInvoices.goto()
        const elements = await exploreReceivableInvoices.globalNativeTable.getColumnElements()
        for (const element of elements) {
            let headerName = await exploreReceivableInvoices.globalNativeTable.clickColumnName(element)
            await expect.soft(exploreReceivableInvoices.globalNativeTable.table).toBeVisible({ timeout: DEFAULT_GLOBAL_TIMEOUT_MS })
            let isTableVisible = await exploreReceivableInvoices.globalNativeTable.table.isVisible()
            if (!isTableVisible) {
                console.error(`Error on column click: "${headerName}"`)
                exploreReceivableInvoices.page.reload()
            } else {}
        }
    })
})
