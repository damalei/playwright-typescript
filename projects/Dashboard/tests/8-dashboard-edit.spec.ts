import { test, expect } from '@playwright/test';
import { ExploreOrganizations } from '../models/exploreOrganizations';
import { ExplorePayableInvoices } from '../models/explorePayableInvoices';
import { ExploreShipments } from '../models/exploreShipments'
import { waitForFilterSectionToLoad, waitforTablePageLoad } from '../../utils';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { SideMenu } from '../models/sideMenu';
import { UserManagement } from '../models/userManagement';

test.describe('Clicks on revenue invoices link with org type... ', () => {
    test('User adds a dashboard', async ({ page }) => {
        const side = new SideMenu(page)
        const user = new UserManagement(page)
        await page.goto(FREIGHT_BI_BASE_URL)
        await side.userProfile.click()
        await side.userManagement.click()
        await page.keyboard.press('Escape')
        await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`)
    })

})
