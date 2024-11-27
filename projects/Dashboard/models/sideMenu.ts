import { Locator, Page } from "@playwright/test";
// import { GlobalFilterSection } from "./globalFilterSection";

export class SideMenu {
    readonly page: Page
    // readonly globalFilterSection: GlobalFilterSection
    readonly userProfile: Locator
    readonly dashboardBuilderOption: Locator

constructor(page: Page){
    this.page = page;
    // this.globalFilterSection = new GlobalFilterSection(page)
    this.userProfile = page.getByTestId("account-user-name")
    this.dashboardBuilderOption = page.locator('span').filter({ hasText: "Dashboard Builder" })}



}