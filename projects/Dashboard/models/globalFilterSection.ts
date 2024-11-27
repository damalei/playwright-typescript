import { Locator, Page } from "@playwright/test";
import { FREIGHT_BI_BASE_URL } from "../../constants";
import { waitForChartPageLoad, waitForFilterSectionToLoad } from "../../utils";

const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class GlobalFilterSection {
    readonly page: Page;
    readonly basicViewButton: Locator
    readonly advanceViewButton: Locator
    readonly editBasicFiltersButton: Locator
    readonly addFilterFieldButton: Locator
    readonly searchFilterField: Locator
    readonly updateFilterField: Locator
    readonly saveViewButton: Locator
    readonly lastFilterFieldClear: Locator
    readonly advanceEditFiltersButton: Locator
    readonly advanceFilterContainerAccordion: Locator
    readonly advanceUpdateFiltersButton: Locator

constructor(page: Page) {
    this.page = page;
    this.basicViewButton = page.getByTestId("basic-filters-button")
    this.advanceViewButton = page.getByTestId("advanced-filters-button")
    this.editBasicFiltersButton = page.getByText("Edit Basic Filters")
    this.addFilterFieldButton = page.getByTestId("add-filter-button")
    this.searchFilterField = page.getByPlaceholder("Search Filter")
    this.updateFilterField = page.getByTestId("save-filters-button")
    this.saveViewButton = page.getByTestId("save-view-button")
    this.lastFilterFieldClear = page.getByTestId("ClearRoundedIcon").last()
    this.advanceEditFiltersButton = page.getByTestId("edit-filters-button")
    this.advanceFilterContainerAccordion = page.getByTestId("Container Filters")
    this.advanceUpdateFiltersButton = page.getByRole('button', {name: "Update Filters"})
  }

async goto() {
    await this.page.goto( FREIGHT_BI_BASE_URL + "/business-performance/c3f63950-8ce7-4529-b29d-31a92c6f7941");
    await waitForChartPageLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS, "data-component-Line Chart");
    await waitForFilterSectionToLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS);
}

async clickFilterField(name: string){
    await this.page.locator('span').filter({ hasText: name }).nth(1).click();
}

async setBasicTextFilter(filtername: string, option_1: string, option_2: string) {
    const boundingBox = this.page.getByTestId(`${filtername}-custom-multiple-text-field`)
    await this.page.locator('label').filter({ hasText: filtername }).click();
    await boundingBox.getByText(option_1, { exact: true }).click()
    await boundingBox.getByText(option_2, { exact: true }).click()
}

async setBasicDateFilter(filtername: string, relative_value: string) {
    await this.page.locator('label').filter({ hasText: filtername }).locator('//following-sibling::*[1]').click()
    await this.page.locator('li').filter({ hasText: relative_value }).click();
}

async setAdvanceTextFilter(row_num: number, rule_field: string, rule_value: string) {
    await this.advanceEditFiltersButton.click()
    await this.advanceFilterContainerAccordion.click()
    const ruleField = this.advanceFilterContainerAccordion.locator('input').nth(row_num)
    await ruleField.fill(rule_field)
    await ruleField.press('ArrowDown')
    await ruleField.press('Enter')
    const valueField = this.advanceFilterContainerAccordion.locator('//div[contains(@class, "rule--value")]').nth(row_num).locator('input')
    await valueField.fill(rule_value)
    await valueField.press('ArrowDown')
    await valueField.press('Enter')
}

async removeBasicDateFilter(filtername: string ){
    const label = this.page.locator(`//div[contains(@aria-labelledby, "${filtername}")]`)
    const boundingBox = label.locator('..').locator('..')
    await boundingBox.getByTestId("CloseIcon").click()
}

async removeBasicTextFilter(filtername: string, el_count: number){
    const boundingBox = this.page.getByTestId(`${filtername}-custom-multiple-text-field`)
    let i
    for (i = 0; i < el_count; i++) {
        await boundingBox.getByTestId("CloseIcon").click()
    }
}

async removeAdvanceTextFilter(filtername: string){
    await this.page.locator('span', { hasText: `${filtername}`}).locator('//following-sibling::*[1]').click()
}

}