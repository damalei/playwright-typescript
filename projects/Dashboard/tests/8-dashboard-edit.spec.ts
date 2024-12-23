import { test, expect } from '@playwright/test';
import { waitForElementToHide } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { SideMenu } from '../models/sideMenu';
import { UserManagement } from '../models/userManagement';

test.describe('Clicks on revenue invoices link with org type... ', () => {
    test.only('User adds a dashboard', async ({ page }) => {
        const side = new SideMenu(page)
        const user = new UserManagement(page)
        await page.goto(FREIGHT_BI_BASE_URL)
        await side.userProfile.click()
        await side.userManagement.click()
        await page.keyboard.press('Escape')
        await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.inputDashboard('Business Performance', 'QA Chart Collection')
        await user.inputDashboard('Business Performance', 'QA Test Template')
        await user.buttonSave.click()
        await waitForElementToHide(page, DEFAULT_TIMEOUT_IN_MS, `${user.buttonSave}`)
        await page.reload()

    })
})
