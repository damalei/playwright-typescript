import { Locator, Page } from '@playwright/test';
import { GlobalFilterSection } from './globalFilterSection';
import { ModalAddCard } from './modalAddCard';
import { waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';

export class DashboardBuilder {
  readonly page: Page;
  readonly GlobalFilterSection: GlobalFilterSection;
  readonly ModalAddCard: ModalAddCard;
  readonly searchDashboard: Locator;
  readonly snackBar: Locator;
  readonly buttonEditDashboard: Locator;
  readonly buttonSave: Locator;
  readonly buttonCreateDashboard: Locator;
  readonly inputCreateDashboard: Locator;
  readonly buttonSubmitCreateDashboard: Locator;
  readonly buttonAddCard: Locator;
  readonly inputSearchDashboard: Locator;
  readonly listButtonDashboardDelete: Locator;
  readonly buttonDeleteDashboardConfirm: Locator;
  readonly buttonDuplicateDashboard: Locator;
  readonly inputDisplayName: Locator;
  readonly inputName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.GlobalFilterSection = new GlobalFilterSection(page);
    this.ModalAddCard = new ModalAddCard(page);
    this.searchDashboard = page.getByPlaceholder('Search dashboards');
    this.buttonEditDashboard = page.getByRole('button', {
      name: 'Edit Dashboard',
    });
    this.buttonSave = page.getByRole('button', { name: 'Save', exact: true });
    this.buttonCreateDashboard = page.getByTestId('create-dashboard-button');
    this.inputCreateDashboard = page.getByPlaceholder(
      'Name your new dashboard'
    );
    this.buttonSubmitCreateDashboard = page.getByTestId(
      'create-dashboard-submit-button'
    );
    this.buttonAddCard = page.getByRole('button', { name: 'Add Card' });
    this.inputSearchDashboard = page.getByPlaceholder('Search dashboards');
    this.listButtonDashboardDelete = page.locator(
      '//button[@aria-label="delete"]'
    );
    this.buttonDeleteDashboardConfirm = page.getByRole('button', {
      name: 'Delete',
    });
    this.buttonDuplicateDashboard = page.getByText('Duplicate', {
      exact: true,
    });
    this.inputName = page
      .getByLabel('Name', { exact: true })
      .locator('..')
      .locator('input');
    this.inputDisplayName = page
      .getByLabel('Display name', { exact: true })
      .locator('..')
      .locator('input');
  }

  async loadDashboard(dashboard: string) {
    await this.searchDashboard.fill(dashboard);
    await this.page.getByTestId(`dashboard-builder-tab-${dashboard}`).click();
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
    // await this.page.waitForTimeout(2000)
  }

  async exitAndReturnDashboard(dashboard1: string, dashboard2: string) {
    await this.page.goto(dashboard1);
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
    await this.page.goto(dashboard2);
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async clickSelectorToggle(selectorName: string) {
    await this.page
      .locator(`//h6[text()='${selectorName}']`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('//input[@type="checkbox"]')
      .click();
  }

  async setSelectorValue(selectorName: string, selectorValue: string) {
    await this.page
      .locator(`//h6[contains(text(), '${selectorName}')]`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('//input[@role="combobox"]')
      .fill(`${selectorValue}`);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/dashboard-builder/');
    await waitForFilterSectionToLoad(this.page, DEFAULT_TIMEOUT_IN_MS);
  }

  async clickLazyLoad(page: Page, chartName: string) {
    await waitForFilterSectionToLoad(page, DEFAULT_TIMEOUT_IN_MS);
    await this.page.getByTestId(`lazy-load-${chartName}`).click();
  }

  async clickDuplicateDashboard(page: Page, dashboard: string) {
    await this.searchDashboard.fill(dashboard);
    await this.page
      .getByTestId(`dashboard-builder-tab-${dashboard}`)
      .getByTestId('ContentCopyIcon')
      .click();
  }
}
