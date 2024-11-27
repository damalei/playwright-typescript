import { Locator, Page } from "@playwright/test";
import { GlobalFilterSection } from "./globalFilterSection";
import { waitForFilterSectionToLoad } from "../../utils";

const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class DashboardBuilder{
    readonly page: Page
    readonly GlobalFilterSection: GlobalFilterSection
    readonly searchDashboard: Locator
    readonly snackBar: Locator

constructor(page: Page){
    this.page = page
    this.GlobalFilterSection = new GlobalFilterSection(page)
    this.searchDashboard = page.getByPlaceholder("Search dashboards")
    }

async loadDashboard(dashboard: string) {
    this.searchDashboard.fill(dashboard)
    this.page.getByTestId(`dashboard-builder-tab-${dashboard}`).click()
    await waitForFilterSectionToLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
    }

async exitAndReturnDashboard(dashboard1: string, dashboard2: string){
    this.page.goto(dashboard1)
    await waitForFilterSectionToLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
    this.page.goto(dashboard2)
    await waitForFilterSectionToLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS)
    }

// async waitForSnackBars(){
//     // const snack = this.page.locator('//div[@id="notistack-snackbar"]')
//     // snack.waitFor({
//     //     state: 'detached',
//     //     timeout: 10000
//     //     })
// }

}