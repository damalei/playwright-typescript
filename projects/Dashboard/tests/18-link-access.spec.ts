import { test, expect } from '@playwright/test';
import { ExploreShipments } from '../models/exploreShipments'
import { ExploreOrganizations } from '../models/exploreOrganizations'
import { ExplorePayableInvoices } from '../models/explorePayableInvoices'
import { ExploreReceivableInvoices } from '../models/exploreReceivableInvoices'
import { MainOrganizations } from '../models/mainOrganization';
import { ExploreShipmentDetails } from '../models/exploreShipmentDetails';
import { waitForFilterSectionToLoad } from '../../utils';

const GLOBALTIMEOUT = 3000000
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT

test.describe.configure({
    mode: 'parallel',
    timeout: DEFAULT_GLOBAL_TIMEOUT_MS,
  })

test.describe('User clicks on page links', () => {
    test('Shipments page > Forward Reference', async ({ page }) => {
        const exploreShipments = new ExploreShipments(page)
        const exploreShipmentDetails = new ExploreShipmentDetails(page)
        await exploreShipments.goto()
        await exploreShipments.waitForReferenceComponent()
        await exploreShipments.referenceComponent.click()
        await exploreShipmentDetails.waitForReferenceComponent()
        await expect.soft(exploreShipmentDetails.referenceComponent).toBeVisible()
    })

    test('Payable Invoices > Forward Reference/Job Number', async ({ page }) => {
        const explorePayableInvoices = new ExplorePayableInvoices(page)
        const exploreShipmentDetails = new ExploreShipmentDetails(page)
        await explorePayableInvoices.goto()
        await explorePayableInvoices.waitForReferenceComponent()
        await explorePayableInvoices.jobNumber.click()
        await exploreShipmentDetails.waitForReferenceComponent()
        await expect.soft(exploreShipmentDetails.referenceComponent).toBeVisible()
    })

    test('Receivable Invoices > Forward Reference/Job Number', async ({ page }) => {
        const exploreReceivableInvoices = new ExploreReceivableInvoices(page)
        const exploreShipmentDetails = new ExploreShipmentDetails(page)
        await exploreReceivableInvoices.goto()
        await exploreReceivableInvoices.waitForReferenceComponent()
        await exploreReceivableInvoices.jobNumber.click()
        await exploreShipmentDetails.waitForReferenceComponent()
        await expect.soft(exploreShipmentDetails.referenceComponent).toBeVisible()
    })
})

test.describe('User clicks on organization name link as ...', () => {
    test('Shipper', async ({ page }) => {
        const exploreOrganization = new ExploreOrganizations(page)
        const mainOrganization = new MainOrganizations(page)
        await exploreOrganization.goto()
        await exploreOrganization.setOrgtype(page, 'Shipper')
        await exploreOrganization.referenceComponent.click()
        await waitForFilterSectionToLoad(page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(mainOrganization.bannerDropdown).toHaveText('Shipper')
        await expect.soft(mainOrganization.filterSection).toBeVisible()
    })

    test('Local Client', async ({ page }) => {
        const exploreOrganization = new ExploreOrganizations(page)
        const mainOrganization = new MainOrganizations(page)
        await exploreOrganization.goto()
        await exploreOrganization.setOrgtype(page, 'Local Client')
        await exploreOrganization.referenceComponent.click()
        await waitForFilterSectionToLoad(page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(mainOrganization.bannerDropdown).toHaveText('Local Client')
        await expect.soft(mainOrganization.filterSection).toBeVisible()
    })

    test('Debtor', async ({ page }) => {
        const exploreOrganization = new ExploreOrganizations(page)
        const mainOrganization = new MainOrganizations(page)
        await exploreOrganization.goto()
        await exploreOrganization.setOrgtype(page, 'Debtor')
        await exploreOrganization.referenceComponent.click()
        await waitForFilterSectionToLoad(page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(mainOrganization.bannerDropdown).toHaveText('Debtor')
        await expect.soft(mainOrganization.filterSection).toBeVisible()
    })

    test('Creditor', async ({ page }) => {
        const exploreOrganization = new ExploreOrganizations(page)
        const mainOrganization = new MainOrganizations(page)
        await exploreOrganization.goto()
        await exploreOrganization.setOrgtype(page, 'Creditor')
        await exploreOrganization.referenceComponent.click()
        await waitForFilterSectionToLoad(page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(mainOrganization.bannerDropdown).toHaveText('Creditor')
        await expect.soft(mainOrganization.filterSection).toBeVisible()
    })

    test('Consignee', async ({ page }) => {
        const exploreOrganization = new ExploreOrganizations(page)
        const mainOrganization = new MainOrganizations(page)
        await exploreOrganization.goto()
        await exploreOrganization.setOrgtype(page, 'Consignee')
        await exploreOrganization.referenceComponent.click()
        await waitForFilterSectionToLoad(page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(mainOrganization.bannerDropdown).toHaveText('Consignee')
        await expect.soft(mainOrganization.filterSection).toBeVisible()
    })
})