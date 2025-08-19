import { Locator, Page } from '@playwright/test';

export interface ThresholdRule {
  min: number;
  max: number;
  value: number;
}

export interface ThresholdValidationData {
  invoiceAmount: number;
  expectedAmount: number;
  delta: number;
  deltaAmountText: string;
  rule: ThresholdRule;
  rowIndex: number;
}

export class JobTypeSettings {
  readonly page: Page;
  readonly editThresholdsButton: Locator;
  readonly vendorThresholdHeading: Locator;
  readonly addVendorThresholdCombobox: Locator;
  readonly addThresholdSettingButton: Locator;
  readonly addRowButton: Locator;
  readonly applyButton: Locator;
  readonly saveJobTypeButton: Locator;
  readonly savingSuccessfulText: Locator;
  readonly deleteVendorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editThresholdsButton = this.page.getByRole('button', {
      name: 'EDIT THRESHOLDS',
    });
    this.vendorThresholdHeading = this.page.getByRole('heading', {
      name: 'Vendor Recon Threshold Settings',
    });
    this.addVendorThresholdCombobox = this.page.getByRole('combobox', {
      name: 'Add Vendor Threshold',
    });
    this.addThresholdSettingButton = this.page.getByRole('button', {
      name: '+ ADD THRESHOLD SETTING',
    });
    this.addRowButton = this.page.getByRole('button', { name: '+ ADD ROW' });
    this.applyButton = this.page.getByRole('button', { name: 'Apply' });
    this.saveJobTypeButton = this.page.getByTestId('save-job-type-button');
    this.savingSuccessfulText = this.page.getByText('Saving Successful');
    this.deleteVendorButton = this.page.locator(
      '.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-q3gdv0-deleteVendorBtn'
    );
  }
  private thresholds: ThresholdRule[] = [];

  async addThresholdMinAndMaxValue(
    minValue: number | string,
    maxValue: number | string,
    thresholdValue: number,
    isFirstThreshold: boolean = false
  ) {
    await this.addRowButton.nth(1).click();
    if (isFirstThreshold) {
      await this.page
        .getByRole('row', { name: '-Infinity Infinity' })
        .getByRole('spinbutton')
        .click();
      await this.page
        .getByRole('row', { name: '-Infinity Infinity' })
        .getByRole('spinbutton')
        .fill(thresholdValue.toString());
    } else {
      if (minValue !== -Infinity) {
        const rows = this.page.locator('table tbody tr');
        const lastRow = rows.last();
        await lastRow.locator('input[name="minimum"]').click();
        await lastRow
          .locator('input[name="minimum"]')
          .fill(minValue.toString());
      }

      const rows = this.page.locator('table tbody tr');
      const lastRow = rows.last();
      await lastRow.getByRole('spinbutton').click();
      await lastRow.getByRole('spinbutton').fill(thresholdValue.toString());
    }

    this.thresholds.push({
      min: typeof minValue === 'string' ? parseFloat(minValue) : minValue,
      max: typeof maxValue === 'string' ? parseFloat(maxValue) : maxValue,
      value: thresholdValue,
    });

    console.log(
      `Added threshold: ${minValue} to ${maxValue} with value ${thresholdValue}`
    );
  }

  async openThresholdSettings() {
    await this.editThresholdsButton.click();
    await this.vendorThresholdHeading.waitFor({ state: 'visible' });
  }

  async selectVendor(vendorName: string) {
    await this.addVendorThresholdCombobox.click();
    await this.addVendorThresholdCombobox.fill(vendorName);
    await this.page.getByRole('option', { name: vendorName }).click();
  }

  async addThresholdSetting() {
    await this.addThresholdSettingButton.click();
  }

  async clickAddRow() {
    await this.page.getByRole('button', { name: '+ ADD ROW' }).nth(1).click();
  }

  async applyThresholdSettings() {
    await this.applyButton.click();
    console.log('Stored thresholds:', this.thresholds);
  }

  async saveJobTypeSettings() {
    await this.saveJobTypeButton.click();
    await this.savingSuccessfulText.waitFor({ state: 'visible' });
  }

  async editThresholdValue(newValue: number) {
    const vendorSection = this.page
      .locator('div', { hasText: 'Vendor: DIAO ENG CHAI STEAMSHIP LINE' })
      .first();
    const vendorTable = vendorSection.locator('table').first();
    const vendorRows = vendorTable.locator('tbody tr');
    const lastRow = vendorRows.last();
    await lastRow.getByRole('spinbutton').click();
    await lastRow.getByRole('spinbutton').fill(newValue.toString());
    if (this.thresholds.length > 0) {
      this.thresholds[this.thresholds.length - 1].value = newValue;
    }
  }

  async deleteVendorThreshold() {
    await this.deleteVendorButton.click();
  }

  async getDefaultThresholds(): Promise<number[]> {
    const defaultVendorSection = this.page
      .locator('div', { hasText: 'Vendor: Default' })
      .first();
    const defaultRows = defaultVendorSection.locator('tbody tr');

    const defaultThresholds: number[] = [];
    const rowCount = await defaultRows.count();
    for (let i = 0; i < rowCount; i++) {
      const thresholdInput = defaultRows.nth(i).locator('input').nth(2);
      const value = await thresholdInput.inputValue();
      defaultThresholds.push(Number(value));
    }
    return defaultThresholds;
  }

  async verifyVendorSectionNotVisible(vendorName: string) {
    const vendorSection = this.page
      .locator('div', { hasText: `Vendor: ${vendorName}` })
      .first();
    await vendorSection.waitFor({ state: 'hidden' });
  }

  getThresholds(): ThresholdRule[] {
    return this.thresholds;
  }

  resetThresholds() {
    this.thresholds = [];
  }

  async getThresholdValidationData(
    rowCount: number = 2
  ): Promise<ThresholdValidationData[]> {
    const validationData: ThresholdValidationData[] = [];

    for (let row = 0; row < rowCount; row++) {
      const invoiceAmountText = await this.page
        .getByTestId(`ap-Metadata Reconciliation-${row}-1`)
        .innerText();
      const expectedAmountText = await this.page
        .getByTestId(`ap-Metadata Reconciliation-${row}-2`)
        .innerText();
      const deltaAmountText = await this.page
        .getByTestId(`ap-Metadata Reconciliation-${row}-3`)
        .innerText();
      const invoiceAmount = parseFloat(invoiceAmountText);
      const expectedAmount = parseFloat(expectedAmountText);
      const delta = Math.abs(invoiceAmount - expectedAmount);

      const rule = this.thresholds.find(
        (t) => invoiceAmount >= t.min && invoiceAmount < t.max
      );

      if (!rule) {
        throw new Error(
          `No matching threshold rule for value: ${invoiceAmount}`
        );
      }
      validationData.push({
        invoiceAmount,
        expectedAmount,
        delta,
        deltaAmountText,
        rule,
        rowIndex: row,
      });
    }
    return validationData;
  }
}
