import { test, Page, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments'
import { ExploreOrganizations } from '../models/exploreOrganizations'
import { ExplorePayableInvoices } from '../models/explorePayableInvoices'
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices'
import { Console, count } from 'console';
import { ExploreContainers } from '../models/exploreContainers';
// import { DEFAULT_GLOBAL_TIMEOUT_MS } from './constants'

const GLOBALTIMEOUT = 3000000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

test.describe.configure({
    mode: 'parallel',
    timeout: DEFAULT_GLOBAL_TIMEOUT_MS,
  })

// test.describe('User clicks edits column > disable all', () => {
//     test('Shipments page', async ({ page }) => {
//         const exploreShipments = new ExploreShipments(page)
//         await exploreShipments.goto()
//         await exploreShipments.waitForReferenceComponent()
//         await exploreShipments.globalNativeTable.editColumnButton.click()
//         await exploreShipments.globalNativeTable.editDisableAll.click()
//         await exploreShipments.globalNativeTable.editColumnButton.click()
//         await expect.soft(exploreShipments.globalNativeTable.columnHeader.nth(1)).not.toBeVisible({ timeout: GLOBALTIMEOUT })
//         await expect.soft(exploreShipments.columnForwarderReference).toBeVisible()
//     })

//     test('Organization page', async ({ page }) => {
//         const exploreOrg = new ExploreOrganizations(page)
//         await exploreOrg.goto()
//         await exploreOrg.waitForReferenceComponent()
//         await exploreOrg.globalNativeTable.editColumnButton.click()
//         await exploreOrg.globalNativeTable.editDisableAll.click()
//         await exploreOrg.globalNativeTable.editColumnButton.click()
//         await expect.soft(exploreOrg.globalNativeTable.columnHeader.nth(1)).not.toBeVisible({ timeout: GLOBALTIMEOUT })
//         await expect.soft(exploreOrg.columnOrganization).toBeVisible()
//     })

//     test('Payable Invoices page', async ({ page }) => {
//         const explorePay = new ExplorePayableInvoices(page)
//         await explorePay.goto()
//         await explorePay.waitForReferenceComponent()
//         await explorePay.globalNativeTable.editColumnButton.click()
//         await explorePay.globalNativeTable.editDisableAll.click()
//         await explorePay.globalNativeTable.editColumnButton.click()
//         await expect.soft(explorePay.globalNativeTable.columnHeader.nth(1)).not.toBeVisible({ timeout: GLOBALTIMEOUT })
//         await expect.soft(explorePay.columnInvoiceNumber).toBeVisible()
//     })

//     test('Receivable Invoices page', async ({ page }) => {
//         const exploreRec = new ExploreReceivableInvoices(page)
//         await exploreRec.goto()
//         await exploreRec.waitForReferenceComponent()
//         await exploreRec.globalNativeTable.editColumnButton.click()
//         await exploreRec.globalNativeTable.editDisableAll.click()
//         await exploreRec.globalNativeTable.editColumnButton.click()
//         await expect.soft(exploreRec.globalNativeTable.columnHeader.nth(1)).not.toBeVisible({ timeout: GLOBALTIMEOUT })
//         await expect.soft(exploreRec.columnInvoiceNumber).toBeVisible()
//     })

//     test('Container page', async ({ page }) => {
//         const exploreCon = new ExploreContainers(page)
//         await exploreCon.goto()
//         await exploreCon.waitForReferenceComponent()
//         await exploreCon.globalNativeTable.editColumnButton.click()
//         await exploreCon.globalNativeTable.editDisableAll.click()
//         await exploreCon.globalNativeTable.editColumnButton.click()
//         await expect.soft(exploreCon.globalNativeTable.columnHeader.nth(2)).not.toBeVisible({ timeout: GLOBALTIMEOUT })
//         await expect.soft(exploreCon.columnContainer).toBeVisible()
//         await expect.soft(exploreCon.columnShipmentForwarderReference).toBeVisible()
//     })
// })    

test.describe('User clicks edits column > show all', () => {
    test('Shipments page', async ({ page }) => {
        const exploreShipments = new ExploreShipments(page)
        await exploreShipments.goto()
        await exploreShipments.waitForReferenceComponent()
        await exploreShipments.globalNativeTable.editColumnButton.click()
        await exploreShipments.globalNativeTable.editShowAll.click()
        await exploreShipments.globalNativeTable.editColumnButton.click()
        await expect.soft(exploreShipments.globalNativeTable.columnHeader).toHaveCount(454)
    })

    test('Organization page', async ({ page }) => {
        const exploreOrg = new ExploreOrganizations(page)
        await exploreOrg.goto()
        await exploreOrg.waitForReferenceComponent()
        await exploreOrg.globalNativeTable.editColumnButton.click()
        await exploreOrg.globalNativeTable.editShowAll.click()
        await exploreOrg.globalNativeTable.editColumnButton.click()
        await expect.soft(exploreOrg.globalNativeTable.columnHeader).toHaveCount(89)
    })

    test('Payable Invoices page', async ({ page }) => {
        const explorePay = new ExplorePayableInvoices(page)
        await explorePay.goto()
        await explorePay.waitForReferenceComponent()
        await explorePay.globalNativeTable.editColumnButton.click()
        await explorePay.globalNativeTable.editShowAll.click()
        await explorePay.globalNativeTable.editColumnButton.click()
        await expect.soft(explorePay.globalNativeTable.columnHeader).toHaveCount(28)
    })

    test('Receivable Invoices page', async ({ page }) => {
        const exploreRec = new ExploreReceivableInvoices(page)
        await exploreRec.goto()
        await exploreRec.waitForReferenceComponent()
        await exploreRec.globalNativeTable.editColumnButton.click()
        await exploreRec.globalNativeTable.editShowAll.click()
        await exploreRec.globalNativeTable.editColumnButton.click()
        await expect.soft(exploreRec.globalNativeTable.columnHeader).toHaveCount(28)
    })

    test('Container page', async ({ page }) => {
        const exploreCon = new ExploreContainers(page)
        await exploreCon.goto()
        await exploreCon.waitForReferenceComponent()
        await exploreCon.globalNativeTable.editColumnButton.click()
        await exploreCon.globalNativeTable.editShowAll.click()
        await exploreCon.globalNativeTable.editColumnButton.click()
        await expect.soft(exploreCon.globalNativeTable.columnHeader).toHaveCount(402)

    })
    
})
