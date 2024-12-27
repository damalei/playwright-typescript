import { Page, test, expect } from '@playwright/test';
import { waitForElementToHide } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';
import { SideMenu } from '../models/sideMenu';
import { UserManagement } from '../models/userManagement';

const xpathUserManagementButton = '//button[text()="Save"]'
const dash1 = 'QA Chart Collection'
const dash2 = 'QA Test Template'

test.describe('User Edit dashboard list on side menu ', () => {
    let page: Page;
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto('https://passive-dashboard.expedock.com/');
    });

    test('add dashboards', async () => {
        const side = new SideMenu(page)
        const user = new UserManagement(page)
        await page.goto(FREIGHT_BI_BASE_URL)
        await side.userProfile.click()
        await side.listUserManagement.click()
        await page.keyboard.press('Escape')
        await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.inputDashboard('Business Performance', `${dash1}`)
        await user.inputDashboard('Business Performance', `${dash2}`)
        await user.buttonSave.click()
        await waitForElementToHide(page, DEFAULT_TIMEOUT_IN_MS, `${xpathUserManagementButton}`)
        await page.reload()
        await side.accBP.click()
        await expect.soft(page.locator(`//span[text()='${dash1}']`)).toBeVisible()
        await expect.soft(page.locator(`//span[text()='${dash2}']`)).toBeVisible()
    })

    test('verify dashboard is in the correct order', async () => {
        const side = new SideMenu(page)
        const menuList = await side.listWrapperBusiness.locator('li')
        const expectList = [`${dash1}`, `${dash2}`]
        await expect(menuList).toContainText(expectList)
    })

    test('remove dashboards', async () => {
        const side = new SideMenu(page)
        const user = new UserManagement(page)
        await page.goto(FREIGHT_BI_BASE_URL)
        await side.userProfile.click()
        await side.listUserManagement.click()
        await page.keyboard.press('Escape')
        await user.searchEmail(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.clickEditAccess(`${process.env.FREIGHT_BI_CLIENT_USER}`)
        await user.inputDashboard('Business Performance', `${dash1}`)
        await user.inputDashboard('Business Performance', `${dash2}`)
        await user.buttonSave.click()
        await waitForElementToHide(page, DEFAULT_TIMEOUT_IN_MS, `${xpathUserManagementButton}`)
        await page.reload()
        await side.accBP.click()
        await expect.soft(page.locator(`//span[text()='${dash1}']`)).toBeHidden()
        await expect.soft(page.locator(`//span[text()='${dash2}']`)).toBeHidden()
    })
})