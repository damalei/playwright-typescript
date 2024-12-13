import { Locator, Page } from '@playwright/test';


const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class AdvancedFilterView {
  readonly page: Page;
  readonly transportModeFilterLocator: Locator;
  readonly hasExceptionsFilterLocator: Locator;
  readonly shipmentWeightFilterLocator: Locator;
  readonly filterView: Locator;
  readonly advancedFilterBtn: Locator;
  readonly editFiltersBtn: Locator;
  readonly shipmentFiltersBtn: Locator;
  readonly shipmentTransportMode: Locator;
  readonly shipmentTransportModeCondition: Locator;
  readonly shipmentTransportModeOption: Locator;
  readonly shipmentFilterField1: Locator;
  readonly shipmentFilterField2: Locator;
  readonly addRuleBtn: Locator;
  readonly shipmentFilterField3: Locator;
  readonly yesNoExceptions: Locator;
  readonly shipmentWeightFilter: Locator;
  readonly shipmentWeightFilterCondition: Locator;
  readonly shipmentWeightFilterOption: Locator;
  readonly shipmentWeightFilterValue: Locator;
  readonly setShipmentWeightFilterValue: Locator;
  readonly advancedUpdateFiltersBtn: Locator;
  readonly saveAdvanceFiltersBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.filterView = page.getByTestId('filters');
    this.editFiltersBtn = page.getByTestId('edit-filters-button');
    this.advancedFilterBtn = page.getByTestId('advanced-filters-button');
    this.shipmentFiltersBtn = page.getByRole('button', {
      name: 'Shipment Filters',
    });
    this.shipmentTransportMode = page.getByText('Shipment transport mode (ex.');
    this.shipmentTransportModeCondition = page.getByText('is', { exact: true });
    this.shipmentTransportModeOption = page.getByRole('option', {
      name: 'is not empty',
      exact: true,
    });
    this.addRuleBtn = page.getByRole('button', { name: 'Add rule' });
    this.shipmentFilterField1 = page
      .getByTestId('Shipment Filters')
      .getByLabel('Open')
      .nth(1);
    this.shipmentFilterField2 = page
      .getByTestId('Shipment Filters')
      .getByLabel('Open')
      .nth(2);
    this.shipmentFilterField3 = page
      .getByTestId('Shipment Filters')
      .getByLabel('Open')
      .nth(3);
    this.yesNoExceptions = page.getByText('This is true if the shipment');
    this.shipmentWeightFilter = page.getByText('Shipment weight. Standardized');
    this.shipmentWeightFilterCondition = page
      .getByTestId('Shipment Filters')
      .getByText('is')
      .nth(3);
    this.shipmentWeightFilterOption = page.getByRole('option', {
      name: 'is less than',
      exact: true,
    });
    this.shipmentWeightFilterValue = page.getByText('- KG');
    this.setShipmentWeightFilterValue = page.getByLabel('value');
    this.advancedUpdateFiltersBtn = page.getByTestId('update-filters-button');
    this.saveAdvanceFiltersBtn = page.getByTestId('save-view-button');
    this.transportModeFilterLocator = page.locator('span:has-text("Transport Mode") + *');
    this.hasExceptionsFilterLocator = page.locator('span:has-text("Has Exceptions") + *');
    this.shipmentWeightFilterLocator = page.locator('span:has-text("Shipment Weight") + *');
  }
  async waitForFilterFields() {
    await this.filterView.waitFor({ state: 'visible' });
  }

  async clickAdvanceFilterBtn() {
    await this.advancedFilterBtn.click();
  }

  async clickEditFiltersBtn() {
    await this.editFiltersBtn.click();
  }

  async clickShipmentFiltersBtn() {
    await this.shipmentFiltersBtn.click();
  }

  async clickShipmentTransportMode() {
    await this.shipmentTransportMode.click();
  }
  async clickShipmentTransportModeCondition() {
    await this.shipmentTransportModeCondition.click();
    await this.shipmentTransportModeOption.click();
  }

  async addAdvanceFilterRule() {
    await this.addRuleBtn.click();
  }
  async clickAddedFilterFields1() {
    await this.shipmentFilterField1.click();
  }
  async clickAddedFilterFields2() {
    await this.shipmentFilterField2.click();
  }
  async clickAddedFilterFields3() {
    await this.shipmentFilterField3.click();
  }
  async BooleanHasExceptions() {
    await this.yesNoExceptions.click();
  }
  async clickShipmentWeightFilter() {
    await this.shipmentWeightFilter.click();
  }
  async setShipmentWeightFilter() {
    await this.shipmentWeightFilterCondition.click();
    await this.shipmentWeightFilterOption.click();
    await this.shipmentWeightFilterValue.click();
    await this.setShipmentWeightFilterValue.fill('20');
  }
  async clickAdvanceUpdateFiltersBtn() {
    await this.advancedUpdateFiltersBtn.click();
  }

  async saveAdvancedFiltersBtn() {
    await this.saveAdvanceFiltersBtn.click();
  }

  async removeAdvanceFilters() {
    await this.transportModeFilterLocator.click();
    await this.hasExceptionsFilterLocator.click();
    await this.shipmentWeightFilterLocator.click();
  }
}
