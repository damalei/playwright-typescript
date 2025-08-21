import { Page, Locator } from '@playwright/test';

export class UserSettings {
  readonly page: Page;

  readonly navbarButton: Locator;
  readonly usersLink: Locator;
  readonly backdropRoot: Locator;
  readonly emailInput: Locator;
  readonly searchButton: Locator;
  readonly editButton: Locator;
  readonly operatorCombobox: Locator;
  readonly branchCombobox: Locator;
  readonly departmentCombobox: Locator;
  readonly externalAssigneeCombobox: Locator;
  readonly lockOperatorCheckbox: Locator;
  readonly lockBranchCheckbox: Locator;
  readonly lockDepartmentCheckbox: Locator;
  readonly lockExternalCheckbox: Locator;
  readonly unlockOperatorCheckbox: Locator;
  readonly unlockBranchCheckbox: Locator;
  readonly unlockDepartmentCheckbox: Locator;
  readonly unlockExternalCheckbox: Locator;
  readonly updateButton: Locator;
  readonly cancelIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navbarButton = page.getByTestId('navbar').getByRole('button').nth(2);
    this.usersLink = page.getByRole('link', { name: 'Users' });
    this.backdropRoot = page.locator('.MuiBackdrop-root');
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.editButton = page.getByRole('button', { name: 'edit' });
    this.operatorCombobox = page.getByRole('combobox', {
      name: 'Operator',
      exact: true,
    });
    this.branchCombobox = page.getByRole('combobox', { name: 'Branch' });
    this.departmentCombobox = page.getByRole('combobox', {
      name: 'Department',
    });
    this.externalAssigneeCombobox = page.getByRole('combobox', {
      name: 'External Assignee',
    });
    this.lockOperatorCheckbox = page.getByRole('checkbox', {
      name: 'Lock Recon Dashboard Operator filter for user',
    });
    this.lockBranchCheckbox = page.getByRole('checkbox', {
      name: 'Lock Recon Dashboard Branch filter for user',
    });
    this.lockDepartmentCheckbox = page.getByRole('checkbox', {
      name: 'Lock Recon Dashboard Department filter for user',
    });
    this.lockExternalCheckbox = page.getByRole('checkbox', {
      name: 'Lock Recon Dashboard External Assignee Filter to this User',
    });
    this.unlockOperatorCheckbox = page.getByRole('checkbox', {
      name: 'Recon Dashboard Operator filter locked',
    });
    this.unlockBranchCheckbox = page.getByRole('checkbox', {
      name: 'Recon Dashboard Branch filter locked',
    });
    this.unlockDepartmentCheckbox = page.getByRole('checkbox', {
      name: 'Recon Dashboard Department filter locked',
    });
    this.unlockExternalCheckbox = page.getByRole('checkbox', {
      name: 'External Recon Dashboard Assignee Filter Locked to this User',
    });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.cancelIcon = page.getByTestId('CancelIcon');
  }

  async navigateToUsersPage() {
    await this.navbarButton.click();
    await this.usersLink.click();
  }

  async searchForUser(email: string) {
    await this.backdropRoot.click();
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.emailInput.press('Enter');
    await this.searchButton.click();
    await this.editButton.click();
  }

  async addOperatorFilter(operatorName: string) {
    await this.operatorCombobox.click();
    await this.page.getByRole('option', { name: operatorName }).click();
  }

  async addBranchFilters(branchNames: string[]) {
    for (const branchName of branchNames) {
      await this.branchCombobox.click();
      await this.branchCombobox.fill(branchName);
      await this.page.getByRole('option', { name: branchName }).click();
    }
  }

  async addDepartmentFilters(departmentNames: string[]) {
    for (const departmentName of departmentNames) {
      await this.departmentCombobox.click();
      await this.departmentCombobox.fill(departmentName);
      await this.page.getByRole('option', { name: departmentName }).click();
    }
  }

  async addExternalAssigneeFilter(assigneeName: string) {
    await this.externalAssigneeCombobox.click();
    await this.externalAssigneeCombobox.fill(assigneeName);
    await this.page.getByRole('option', { name: assigneeName }).first().click();
  }

  async lockFilterFields() {
    await this.lockOperatorCheckbox.check();
    await this.lockBranchCheckbox.check();
    await this.lockDepartmentCheckbox.check();
    await this.lockExternalCheckbox.check();
  }

  async unlockFilterFields() {
    await this.unlockOperatorCheckbox.uncheck();
    await this.unlockBranchCheckbox.uncheck();
    await this.unlockDepartmentCheckbox.uncheck();
    await this.unlockExternalCheckbox.uncheck();
  }

  async updateUserSettings() {
    await this.updateButton.click();
    await this.page.waitForTimeout(20000);
  }

  async removeFilterByText(filterText: string) {
    await this.page
      .getByText(filterText)
      .locator('..')
      .getByTestId('CancelIcon')
      .click();
  }

  async removeAllFilters(filterNames: string[]) {
    for (const filterName of filterNames) {
      await this.removeFilterByText(filterName);
    }
  }

  async reloadAndReopenUserSettings(email: string) {
    await this.page.reload();
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.emailInput.press('Enter');
    await this.searchButton.click();
    await this.editButton.click();
  }

  async searchUser(email: string) {
    await this.backdropRoot.click();
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.emailInput.press('Enter');
    await this.searchButton.click();
    await this.editButton.click();
  }

  async addUserDashboardFilters(
    operatorName: string,
    branchNames: string[],
    departmentNames: string[],
    assigneeName: string
  ) {
    await this.addOperatorFilter(operatorName);
    await this.addBranchFilters(branchNames);
    await this.addDepartmentFilters(departmentNames);
    await this.addExternalAssigneeFilter(assigneeName);
  }
}
