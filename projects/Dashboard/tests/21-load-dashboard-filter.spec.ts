import { test, expect } from '@playwright/test';
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { SideMenu } from '../models/sideMenu';

test.describe('Load dashboard and filter settings', () => {


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