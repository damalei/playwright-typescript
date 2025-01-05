import { Locator, Page } from '@playwright/test';
import { GlobalFilterSection } from './globalFilterSection';
import { waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class DashboardBuilder {
  readonly page: Page;
  readonly GlobalFilterSection: GlobalFilterSection;
  readonly searchDashboard: Locator;
  readonly snackBar: Locator;
  readonly buttonEditDashboard: Locator;
  readonly buttonSave: Locator;

  constructor(page: Page) {
    this.page = page;
    this.GlobalFilterSection = new GlobalFilterSection(page);
    this.searchDashboard = page.getByPlaceholder('Search dashboards');
    this.buttonEditDashboard = page.getByRole('button', {name: 'Edit Dashboard'})
    this.buttonSave = page.getByRole('button', { name: 'Save', exact: true })
  }

  async loadDashboard(dashboard: string) {
    this.searchDashboard.fill(dashboard);
    this.page.getByTestId(`dashboard-builder-tab-${dashboard}`).click();
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async exitAndReturnDashboard(dashboard1: string, dashboard2: string) {
    this.page.goto(dashboard1);
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
    this.page.goto(dashboard2);
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async clickSelectorToggle(selectorName: string){
    await this.page.locator(`//h6[contains(text(), '${selectorName}')]`).locator('..').locator('..').locator('..').locator('..').locator('..').locator('//input[@type="checkbox"]').click();
  }

  async setSelectorValue(selectorName: string, selectorValue: string) {
    await this.page.locator(`//h6[contains(text(), '${selectorName}')]`).locator('..').locator('..').locator('..').locator('..').locator('..').locator('//input[@role="combobox"]').fill(`${selectorValue}`);
    await this.page.keyboard.press('ArrowDown')
    await this.page.keyboard.press('Enter')
  }

}
