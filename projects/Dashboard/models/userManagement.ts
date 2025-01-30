import { expect, Locator, Page } from '@playwright/test';
import { DEFAULT_TIMEOUT_IN_MS, FREIGHT_BI_BASE_URL } from '../../constants';

export class UserManagement {
  readonly page: Page;
  readonly emailSearchField: Locator;
  readonly searchButton: Locator;
  readonly referenceComponent: Locator;
  readonly manageUserdiv: Locator;
  readonly buttonSave: Locator;
  readonly inputSalesRep: Locator;
  readonly inputOperator: Locator;
  readonly inputBranch: Locator;
  readonly inputDepartment: Locator;
  readonly toggleSandbox: Locator;
  readonly confirmBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailSearchField = page
      .locator('label')
      .getByText('Email')
      .locator('//following-sibling::div')
      .locator('input');
    this.confirmBtn = page.getByRole('button', { name: 'Confirm' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.referenceComponent = page.locator('//h5[text()="Manage Users"]');
    this.buttonSave = page.getByRole('button', { name: 'Save' });
    this.inputBranch = page.getByLabel('Branch');
    this.inputDepartment = page.getByLabel('Department');
    this.inputOperator = page.getByLabel('Operator');
    this.inputSalesRep = page.getByLabel('Sales Rep');
    this.toggleSandbox = page
      .getByText('Can only access shipments they are assigned to')
      .locator('..')
      .locator('//input[@type="checkbox"]');
  }

  async searchEmail(email: string) {
    await this.emailSearchField.fill(email);
    await this.searchButton.click();
    await this.waitForReferenceComponent();
  }

  async clickEditAccess(email: string) {
    await this.page
      .locator(`//td[text()="${email}"]`)
      .locator('..')
      .locator('//button[@aria-label="edit"]')
      .click();
  }

  async waitForReferenceComponent() {
    await this.referenceComponent.waitFor({ state: 'visible' });
  }

  async inputDashboard(section: string, dashboard) {
    await this.page.getByLabel(section, { exact: true }).click();
    const field = this.page
      .getByLabel(section, { exact: true })
      .locator('..')
      .locator('input');
    await field.pressSequentially(dashboard);
    await this.page.keyboard.press('Space');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/user-management');
    await expect(
      this.page.getByRole('button', { name: 'Create New User' })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  }

  async confirmDashboardChange() {
    await this.confirmBtn.waitFor({ state: 'visible' });
    await this.confirmBtn.click();
  }

  async checkSandboxChips(label: string, chip: string) {
    const chipLabel = this.page.getByLabel(label, { exact: true });
    await chipLabel.waitFor({ state: 'visible' });
    const isChipVisible = await chipLabel.locator('..').getByText(chip, { exact: true }).isVisible();
    return isChipVisible;
  }
}
