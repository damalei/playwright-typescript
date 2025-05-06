import { Locator, Page } from '@playwright/test';

export class SavedViews {
  readonly page: Page;
  readonly dropdownCurrency: Locator;
  readonly inputCurrency: Locator;
  readonly optionCurrency: Locator;
  readonly shipmentWeightKg: Locator;
  readonly valueShipmentWeight: Locator;
  readonly buttonUpdateAdvancedFilters: Locator;
  readonly buttonBasicFiltersView: Locator;
  readonly buttonSaveView: Locator;
  readonly radioSaveAsNewView: Locator;
  readonly inputViewName: Locator;
  readonly buttonSaveModal: Locator;
  readonly textDerivedFromShipmentReports: Locator;
  readonly labelPageLastUpdated: Locator;
  readonly labelShipmentWeight: Locator;
  readonly labelHasExceptions: Locator;
  readonly labelPacksUom: Locator;
  readonly dateFieldPageLastUpdatedOn: Locator;
  readonly optionYearToDate: Locator;
  readonly linkSavedViews: Locator;
  readonly linkBusinessPerformanceDashboardList: Locator;
  readonly linkShipmentReportsDashboard: Locator;
  readonly closeDefaultDateShipmentCreated: Locator;
  readonly dropdownPacksUom: Locator;
  readonly optionPacksUom: Locator;
  readonly dropdownHasExceptions: Locator;
  readonly optionTrue: Locator;
  readonly buttonAdvancedFilters: Locator;
  readonly buttonEditFilters: Locator;
  readonly buttonShipmentFilters: Locator;
  readonly buttonAddRule: Locator;
  readonly dropdownShipmentFilters: Locator;
  readonly selectOperator: Locator;
  readonly optionIsNotEmpty: Locator;
  readonly optionIsLessThan: Locator;
  readonly shipmentReportsHeader: Locator;
  readonly filterShipmentTransportMode: Locator;
  readonly filterShipmentWeight: Locator;
  readonly filterPacksField: Locator;
  readonly valuePacks: Locator;
  readonly headerExploreShipments: Locator;
  readonly buttonMoreActions: Locator;
  readonly buttonDeleteSavedView: Locator;
  readonly buttonDeleteViewModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dropdownCurrency = page.getByTitle('CURRENCY').getByLabel('Open');
    this.inputCurrency = page.locator('input[role="combobox"]:focus');
    this.optionCurrency = page.getByRole('option', { name: 'PHP' });
    this.shipmentWeightKg = page.getByText('- KG').last();
    this.valueShipmentWeight = page.getByLabel('value');
    this.buttonUpdateAdvancedFilters = page.getByTestId(
      'update-filters-button'
    );
    this.buttonBasicFiltersView = page.getByTestId('basic-filters-button');
    this.buttonSaveView = page.getByTestId('save-view-button');
    this.radioSaveAsNewView = page.getByText('Save as new view');
    this.inputViewName = page.getByRole('textbox', {
      name: 'Enter a name for this view',
    });
    this.buttonSaveModal = page.getByTestId('save-view-modal-save-button');
    this.dateFieldPageLastUpdatedOn = page.locator(
      '[data-testid="shipment.snowflake_date_created-picker"]'
    );
    this.optionYearToDate = page.getByText('Year to Date');
    this.linkSavedViews = page.getByText('Saved Views', { exact: true });
    this.linkBusinessPerformanceDashboardList = page.getByText(
      'Business Performance'
    );
    this.linkShipmentReportsDashboard = page.getByText('Shipment Reports');
    this.closeDefaultDateShipmentCreated = page
      .getByTestId('shipment.date_shipment_created')
      .getByTestId('CloseIcon');
    this.dropdownPacksUom = page
      .getByTestId('Packs Uom-custom-multiple-text-field')
      .locator('div');
    this.optionPacksUom = page.locator(
      'div.MuiBox-root.css-mmwtbu div.MuiGrid-root.MuiGrid-container.css-1sznya1-dropdownRow'
    );
    this.dropdownHasExceptions = page
      .getByTestId('Has Exceptions-custom-multiple-text-field')
      .locator('div');
    this.optionTrue = page.getByText('True');
    this.buttonAdvancedFilters = page.getByTestId('advanced-filters-button');
    this.buttonEditFilters = page.getByTestId('edit-filters-button');
    this.buttonShipmentFilters = page.getByRole('button', {
      name: 'Shipment Filters',
    });
    this.buttonAddRule = page.getByRole('button', { name: 'Add rule' }).first();
    this.dropdownShipmentFilters = page
      .getByTestId('Shipment Filters')
      .getByLabel('Open')
      .last();
    this.selectOperator = page
      .getByTestId('Shipment Filters')
      .locator('.MuiSelect-select')
      .last();
    this.optionIsNotEmpty = page.getByRole('option', {
      name: 'is not empty',
      exact: true,
    });
    this.optionIsLessThan = page.getByRole('option', {
      name: 'is less than',
      exact: true,
    });
    this.shipmentReportsHeader = page
      .locator('div')
      .filter({ hasText: /^Shipment ReportsSave View$/ })
      .first();
    this.filterShipmentTransportMode = page.getByText(
      'Shipment transport mode (ex.'
    );
    this.filterShipmentWeight = page.getByText('Shipment weight. Standardized');
    this.filterPacksField = page.getByTestId('shipment.packs field');
    this.valuePacks = page
      .getByTestId('shipment.packs field')
      .getByLabel('')
      .first();
    this.headerExploreShipments = page.getByText('ShipmentsSave View');
    this.buttonMoreActions = page.getByRole('button', { name: 'More Actions' });
    this.buttonDeleteSavedView = page.getByRole('button', {
      name: 'Delete saved view',
    });
    this.buttonDeleteViewModal = page.getByRole('button', {
      name: 'Delete View',
    });
  }

  async setCurrency(currency: string) {
    await this.dropdownCurrency.click();
    await this.inputCurrency.waitFor();
    await this.page.keyboard.type(currency);
    await this.optionCurrency.click();
  }

  async setShipmentWeight(weight: string) {
    await this.shipmentWeightKg.click();
    await this.valueShipmentWeight.fill(weight);
  }

  async saveAsNewView(viewName: string) {
    await this.buttonSaveView.click();
    await this.radioSaveAsNewView.click();
    await this.inputViewName.fill(viewName);
    await this.buttonSaveModal.click();
  }

  async getDateRangeState() {
    const startDate = this.dateFieldPageLastUpdatedOn.locator('input').first();
    const endDate = this.dateFieldPageLastUpdatedOn.locator('input').last();
    const hasDateRange =
      (await startDate.isVisible()) &&
      (await endDate.isVisible()) &&
      (await startDate.inputValue()) !== '' &&
      (await endDate.inputValue()) !== '';
    const hasYearToDate = await this.optionYearToDate
      .isVisible()
      .catch(() => false);
    return { hasDateRange, hasYearToDate };
  }

  async addPacksUomFilterValue() {
    await this.dropdownPacksUom.click();
    await this.optionPacksUom.nth(0).click();
    await this.optionPacksUom.nth(1).click();
  }

  async addHasExceptionsFilterValue() {
    await this.dropdownHasExceptions.click();
    await this.optionTrue.click();
  }

  async addPacksFilterValue(packs: string) {
    await this.filterPacksField.click();
    await this.valuePacks.fill(packs);
  }

  async addTransportModeFilterValue() {
    await this.dropdownShipmentFilters.click();
    await this.page.keyboard.type('Transport Mode');
    await this.filterShipmentTransportMode.click();
    await this.selectOperator.click();
    await this.optionIsNotEmpty.click();
  }

  async addPageLastUpdatedDateFilterValue() {
    await this.dateFieldPageLastUpdatedOn.click();
    await this.optionYearToDate.click();
  }

  async addShipmentWeightFilterValue() {
    await this.buttonAddRule.click(); //add async to add rule
    await this.dropdownShipmentFilters.click();
    await this.page.keyboard.type('Shipment Weight');
    await this.filterShipmentWeight.click();
    await this.selectOperator.click();
    await this.optionIsLessThan.click();
  }

  async openAdvancedFilters() {
    await this.buttonAdvancedFilters.click();
    await this.buttonEditFilters.click();
  }

  async addAdvancedShipmentFilters() {
    await this.buttonShipmentFilters.click();
    await this.buttonAddRule.click();
  }
}
