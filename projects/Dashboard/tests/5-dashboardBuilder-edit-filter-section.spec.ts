import { test, Page, expect } from "@playwright/test";
import { waitForFilterSectionToLoad, waitForSnackBar } from "../../utils";
import { SideMenu } from "../models/sideMenu";
import { FREIGHT_BI_BASE_URL } from "../../constants";
import { DashboardBuilder } from "../models/dashboardBuilder";

const GLOBALTIMEOUT = 300000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;
const dashboard2 = FREIGHT_BI_BASE_URL + "/dashboard-builder/c3f63950-8ce7-4529-b29d-31a92c6f7941" //QA TEST Template (AP DASH DEMO)
const dashboard1 = FREIGHT_BI_BASE_URL + "/dashboard-builder/b0e04ce7-3c36-4e96-bd00-55fdf08eae5a"

test.describe("Edit and save filters fields on Dashboard Builder", () => {
    let page: Page;
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await page.goto(FREIGHT_BI_BASE_URL);
    });

    test("[10.1] User adds filter FIELDS from the basic view", async () => {
        const side = new SideMenu(page)
        const dashbuild = new DashboardBuilder(page)
        await side.userProfile.click()
        await side.dashboardBuilderOption.click()
        await dashbuild.loadDashboard("QA Test Template")
        await dashbuild.GlobalFilterSection.editBasicFiltersButton.click()
        await dashbuild.GlobalFilterSection.addFilterFieldButton.click()
        await dashbuild.GlobalFilterSection.clickFilterField('Page Last Updated On')
        await dashbuild.GlobalFilterSection.updateFilterField.click()
        await dashbuild.GlobalFilterSection.page.reload()
        await waitForFilterSectionToLoad(dashbuild.GlobalFilterSection.page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(page.locator('label', { hasText: 'Page Last Updated On' })).toBeVisible( {timeout: 10000} )      
      })

      test("[10.2] User saves filter fields from the basic", async () => {
        const dashbuild = new DashboardBuilder(page)
        await dashbuild.GlobalFilterSection.saveViewButton.click()
        await waitForSnackBar(dashbuild.page, 10000)
        await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2)
        await waitForFilterSectionToLoad(dashbuild.GlobalFilterSection.page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(page.locator('label', { hasText: 'Page Last Updated On' })).toBeVisible( {timeout: 10000} )   
      })

      test("[10.3] User removes filter fields from the basic", async () => {
        const dashbuild = new DashboardBuilder(page)
        await page.goto(dashboard2)
        await dashbuild.GlobalFilterSection.editBasicFiltersButton.click()
        await dashbuild.GlobalFilterSection.lastFilterFieldClear.click()
        await dashbuild.GlobalFilterSection.updateFilterField.click()
        await dashbuild.GlobalFilterSection.saveViewButton.click()
        await waitForSnackBar(dashbuild.page, 10000)
        await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2)
        await waitForFilterSectionToLoad(dashbuild.GlobalFilterSection.page, DEFAULT_GLOBAL_TIMEOUT_MS)
        await expect.soft(page.locator('label', { hasText: 'Page Last Updated On' })).not.toBeVisible( {timeout: 10000} )   
      })
})

test.describe("Edit and save filters VALUES on Dashboard Builder", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(FREIGHT_BI_BASE_URL);
  });

  test("[10.4] User saves a filter value from the basic and advance view", async () => {
      const dashbuild = new DashboardBuilder(page)
      await page.goto(dashboard2)
      await dashbuild.GlobalFilterSection.setBasicTextFilter('Transport Mode', 'SEA', 'AIR')
      await dashbuild.GlobalFilterSection.setBasicDateFilter('Shipment ETD', 'Today')
      await dashbuild.GlobalFilterSection.advanceViewButton.click()
      await dashbuild.GlobalFilterSection.setAdvanceTextFilter(0, 'Container Mode', 'FCL')
      await dashbuild.GlobalFilterSection.advanceUpdateFiltersButton.click()
      await dashbuild.GlobalFilterSection.saveViewButton.click()
      await waitForSnackBar(dashbuild.page, 10000)
      await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2)
      await dashbuild.GlobalFilterSection.advanceViewButton.click()
      await expect.soft(page.locator('span', { hasText: "Transport Mode is SEA and 1 other filters"})).toBeVisible()
      await expect.soft(page.locator('span', { hasText: "Shipment ETD is Today"})).toBeVisible()
      await expect.soft(page.locator('span', { hasText: "Container Mode is FCL"})).toBeVisible()      
    })

    test("[10.5] User removes and saves a filter value from the basic and advance view", async () => {
      const dashbuild = new DashboardBuilder(page)
      await dashbuild.GlobalFilterSection.basicViewButton.click()
      await dashbuild.GlobalFilterSection.removeBasicDateFilter("Shipment ETD")
      await dashbuild.GlobalFilterSection.removeBasicTextFilter("Transport Mode", 2)
      await dashbuild.GlobalFilterSection.advanceViewButton.click()
      await dashbuild.GlobalFilterSection.removeAdvanceTextFilter("Container Mode")
      await dashbuild.GlobalFilterSection.saveViewButton.click()
      await waitForSnackBar(dashbuild.page, 10000)
      await dashbuild.exitAndReturnDashboard(dashboard1, dashboard2)
      await dashbuild.GlobalFilterSection.advanceViewButton.click()
      await expect.soft(dashbuild.GlobalFilterSection.advanceEditFiltersButton).toBeVisible()
      await expect.soft(page.locator('span', { hasText: "Transport Mode is SEA and 1 other filters"})).not.toBeVisible()
      await expect.soft(page.locator('span', { hasText: "Shipment ETD is Today"})).not.toBeVisible()
      await expect.soft(page.locator('span', { hasText: "Container Mode is FCL"})).not.toBeVisible()      
    })
})

