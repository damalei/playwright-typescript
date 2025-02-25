import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';

let dischargePortKey;
let dischargePortValue;

export class EditFilterFields {
  readonly page: Page;
  readonly editFilterFieldsBtn: Locator;
  readonly addFilterBtn: Locator;
  readonly searchFilter: Locator;
  readonly updateFilterFieldsBtn: Locator;
  readonly shipmentWeightFilterChip: Locator;
  readonly saveDashboardView: Locator;
  readonly hasExceptionsChip: Locator;
  readonly shipperNameChip: Locator;
  readonly pageLastUpdatedOnChip: Locator;
  readonly saveViewBtn: Locator;
  readonly hasExceptionsFilterLocator: Locator;
  readonly shipperNameFilterLocator: Locator;
  readonly exploreShipmentsDashboard: Locator;
  readonly shipmentsForwarderReference: Locator;
  readonly exceptionManagementDashboard: Locator;
  readonly saveViewModal: Locator;
  readonly saveViewSuccessNote: Locator;
  readonly filterFields: Locator;
  readonly transportModeFilter: Locator;
  readonly transportModeSea: Locator;
  readonly shipmentWeightValue: Locator;
  readonly transportModeFilterLocator: Locator;
  readonly drilldownTableShipmentsArriving: Locator;
  readonly dischargePortValue: Locator;
  readonly dischargePortFilterFields: Locator;
  readonly deleteFilterValueBtn: Locator;
  readonly transportModeFilterValueChip: Locator;
  readonly shipmentWeightFilterValueChip: Locator;
  readonly failedToDepartDrilldown: Locator;
  readonly failedToArriveDrilldown: Locator;
  readonly pageLastUpdatedFilterLocator: Locator;
  readonly shipmentWeightFilterLocator: Locator;
  readonly chargeableWeightFilterChip: Locator;
  readonly lastLegArrivalStatusFilterChip: Locator;
  readonly exploreContainersDashboard: Locator;
  readonly containerNumbers: Locator;
  readonly lastLegArrivalStatusValue: Locator;
  readonly hasExceptionsValue: Locator;
  readonly lastLegArrivalStatusValueChip: Locator;
  readonly hasExceptionsValueChip: Locator;
  readonly hasExceptionsFilterValueLocator: Locator;
  readonly lastLegArrivalStatusFilterValueLocator: Locator;
  readonly chargeableWeightFilterLocator: Locator;
  readonly lastLegArrivalStatusFilterLocator: Locator;
  readonly dischargePortFilterValueChip: (key: string) => Locator;
  readonly dischargeFilterValueLocator: (key: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.editFilterFieldsBtn = page.getByTestId('edit-filters-button');
    this.addFilterBtn = page.getByTestId('add-filter-button');
    this.searchFilter = page.getByPlaceholder('Search Filter');
    this.updateFilterFieldsBtn = page.getByTestId('save-filters-button');
    this.shipmentWeightFilterChip = page.getByText('Shipment Weight- KG');
    this.containerNumbers = page.getByTestId(
      'table-body-0-container_container_number_display'
    );
    this.hasExceptionsChip = page
      .getByTestId('Has Exceptions-custom-multiple-text-field')
      .locator('div');
    this.shipperNameChip = page
      .getByTestId('Shipper Name-custom-multiple-text-field')
      .locator('div');
    this.pageLastUpdatedOnChip = page.getByTestId(
      'shipment.snowflake_date_created-picker'
    );
    this.saveDashboardView = page.getByTestId('save-view-modal-save-button');
    this.saveViewBtn = page.getByTestId('save-view-button');
    this.exploreShipmentsDashboard = page.getByText('Explore Shipments');
    this.exploreContainersDashboard = page.getByText('Explore Containers');
    this.exceptionManagementDashboard = page.getByText(
      'Exceptions Management',
      { exact: true }
    );
    this.shipmentsForwarderReference = page.getByTestId(
      'table-body-0-forwarder_reference'
    );
    this.hasExceptionsFilterLocator = page.locator(
      'span:has-text("Has Exceptions") + *'
    );
    this.pageLastUpdatedFilterLocator = page.locator(
      'span:has-text("Page Last Updated On") + *'
    );
    this.shipmentWeightFilterLocator = page.locator(
      'span:has-text("Shipment Weight") + *'
    );
    this.shipperNameFilterLocator = page.locator(
      'span:has-text("Shipper Name") + *'
    );
    this.chargeableWeightFilterLocator = page.locator(
      'span:has-text("Chargeable Weight") + *'
    );
    this.lastLegArrivalStatusFilterLocator = page.locator(
      'span:has-text("Last Leg Arrival Status") + *'
    );
    this.saveViewModal = page.getByRole('dialog');
    this.saveViewSuccessNote = page.getByText('has been updated');
    this.filterFields = page.getByTestId('filters');
    this.transportModeFilter = page
      .getByTestId('Transport Mode-custom-multiple-text-field')
      .getByTestId('ExpandMoreIcon');
    this.transportModeSea = page.getByText('SEASea Freight');
    this.shipmentWeightValue = page.getByLabel('value');
    this.transportModeFilterLocator = page.locator('span:has-text("Sea") + *');
    this.hasExceptionsFilterValueLocator = page.locator(
      'span:has-text("True") + *'
    );
    this.lastLegArrivalStatusFilterValueLocator = page.locator(
      'span:has-text("Delayed") + *'
    );
    this.dischargeFilterValueLocator = (key: string) =>
      page.locator('span:has-text("' + key + '") + *');
    this.drilldownTableShipmentsArriving = page
      .getByText('Estimated Time of Arrival (')
      .first();
    this.dischargePortFilterFields = page
      .getByTestId('Discharge Port-custom-multiple-text-field')
      .locator('div');
    this.deleteFilterValueBtn = page.getByText('Delete');
    this.dischargePortFilterValueChip = (key: string) =>
      page.getByRole('button', { name: key });
    this.transportModeFilterValueChip = page.getByRole('button', {
      name: 'SEA',
    });
    this.shipmentWeightFilterValueChip = page.getByText('Shipment Weight1 KG');
    this.failedToDepartDrilldown = page.getByText('Failed to depart (Past 3');
    this.failedToArriveDrilldown = page.getByText('Failed to arrive (Past 3');
    this.chargeableWeightFilterChip = page.getByText('Chargeable Weight- KG');
    this.lastLegArrivalStatusFilterChip = page.getByText(
      'Last Leg Arrival Status'
    );
    this.lastLegArrivalStatusValue = page.getByText('Delayed');
    this.hasExceptionsValue = page.getByText('True');
    this.lastLegArrivalStatusValueChip = page.getByRole('button', {
      name: 'Delayed',
    });
    this.hasExceptionsValueChip = page.getByRole('button', { name: 'True' });
  }

  async waitForExceptionManagement() {
    await this.page.waitForLoadState('load');
    await this.drilldownTableShipmentsArriving.waitFor({ state: 'visible' });
    await this.filterFields.waitFor({ state: 'visible' });
    await this.failedToDepartDrilldown.waitFor({ state: 'visible' });
    await this.failedToArriveDrilldown.waitFor({ state: 'visible' });
  }

  async gotoExploreShipmentsDashboard() {
    await this.exploreShipmentsDashboard.click();
    await expect(this.shipmentsForwarderReference).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async gotoExploreContainersDashboard() {
    await this.exploreContainersDashboard.click();
    await expect(this.containerNumbers).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async editFilterFields() {
    await this.editFilterFieldsBtn.click();
    await expect(this.addFilterBtn).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async addFilterFields() {
    this.addFilterBtn.click();
    await this.page.waitForLoadState('load');
  }

  async searchFilterFields(filterFieldName: string) {
    await this.searchFilter.fill(filterFieldName);
    const columnDiv = this.page
      .locator('span')
      .filter({ hasText: filterFieldName })
      .first();
    await expect(columnDiv).toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await columnDiv.first().click();
  }

  async updateFiltersFields() {
    await this.page.waitForLoadState('load');
    await this.updateFilterFieldsBtn.click();
  }

  async saveViewDashboard() {
    await this.saveViewBtn.click();
    await expect(this.saveViewModal).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.saveDashboardView.click();
    await expect(this.saveViewSuccessNote).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async checkAddedFilterFieldsExceptionManagement() {
    const filterChips = [
      this.shipmentWeightFilterChip,
      this.hasExceptionsChip,
      this.pageLastUpdatedOnChip,
      this.shipperNameChip,
    ];

    for (const addedFilterchip of filterChips) {
      await expect(addedFilterchip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterChipExceptionManagement() {
    await this.hasExceptionsFilterLocator.click();
    await this.shipperNameFilterLocator.click();
    await this.waitForExceptionManagement();
  }

  async checkDeletedFilterChipsExceptionManagement() {
    await expect(this.hasExceptionsFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.shipperNameFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async navigateDashboardBackToExceptionManagement() {
    await this.exploreShipmentsDashboard.click();
    await expect(this.shipmentsForwarderReference).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.exceptionManagementDashboard.click();
    await this.waitForExceptionManagement();
  }

  async addFilterValuesExceptionManagement() {
    await this.waitForExceptionManagement();
    await this.transportModeFilter.click();
    await this.transportModeSea.click();
    await this.shipmentWeightFilterChip.click();
    await this.shipmentWeightValue.fill('1');
    await this.clickDropdownValue(
      'Discharge Port-custom-multiple-text-field',
      0
    );
    await this.waitForExceptionManagement();
  }

  async navigateDashboardBackToExploreShipments() {
    await this.exceptionManagementDashboard.click();
    await this.waitForExceptionManagement();
    await this.exploreShipmentsDashboard.click();
    await expect(this.shipmentsForwarderReference).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async checkAddedFilterValuesExceptionManagement() {
    const filterValueChips = [
      this.dischargePortFilterValueChip(dischargePortKey),
      this.transportModeFilterValueChip,
      this.shipmentWeightFilterValueChip,
    ];
    for (const addedFilterValueChip of filterValueChips) {
      await expect(addedFilterValueChip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterValuesExceptionManagement() {
    await this.transportModeFilterLocator.click();
    await this.dischargeFilterValueLocator(dischargePortKey).click();
    await this.shipmentWeightFilterValueChip.click();
    await this.deleteFilterValueBtn.click();
    await this.waitForExceptionManagement();
  }

  async checkDeletedFilterValuesExceptionManagement() {
    await expect(this.transportModeFilterValueChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(
      this.dischargePortFilterValueChip(dischargePortKey)
    ).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.shipmentWeightFilterValueChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async deleteRemainingFilterChipExceptionManagement() {
    await this.pageLastUpdatedFilterLocator.click();
    await this.shipmentWeightFilterLocator.click();
    await this.waitForExceptionManagement();
  }

  async checkDeleteRemainingFilterChipExceptionManagement() {
    await expect(this.shipmentWeightFilterChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.pageLastUpdatedOnChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async navigateDashboardBackToExploreContainers() {
    await this.exploreShipmentsDashboard.click();
    await expect(this.shipmentsForwarderReference).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.exploreContainersDashboard.click();
    await expect(this.containerNumbers).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async checkAddedFilterFieldsExplorePages() {
    const filterChips = [
      this.chargeableWeightFilterChip,
      this.lastLegArrivalStatusFilterChip,
      this.pageLastUpdatedOnChip,
      this.shipperNameChip,
    ];
    for (const addedFilterchip of filterChips) {
      await expect(addedFilterchip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterChipExplorePages() {
    await this.pageLastUpdatedFilterLocator.click();
    await this.shipperNameFilterLocator.click();
    await this.page.waitForLoadState('load');
  }

  async checkDeletedFilterChipsExplorePages() {
    await expect(this.pageLastUpdatedFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.shipperNameFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }
  async waitForShipmentsReferenceComponent() {
    await this.shipmentsForwarderReference.waitFor({ state: 'visible' });
  }

  async addFilterValuesExplorePages() {
    await this.clickDropdownValue(
      'Discharge Port-custom-multiple-text-field',
      0
    );
    await this.lastLegArrivalStatusFilterChip.click();
    await this.lastLegArrivalStatusValue.click();
    await this.hasExceptionsChip.click();
    await this.hasExceptionsValue.click();
  }

  async checkAddedFilterValuesExplorePages() {
    const filterValueValueChipsExplorePages = [
      this.hasExceptionsValueChip,
      this.dischargePortFilterValueChip(dischargePortKey),
      this.lastLegArrivalStatusValueChip,
    ];
    for (const addedFilterValueChip of filterValueValueChipsExplorePages) {
      await expect(addedFilterValueChip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterValuesExplorePages() {
    await this.dischargeFilterValueLocator(dischargePortKey).click();
    await this.hasExceptionsFilterValueLocator.click();
    await this.lastLegArrivalStatusFilterValueLocator.click();
  }

  async checkDeletedFilterValuesExplorePages() {
    await expect(
      this.dischargeFilterValueLocator(dischargePortKey)
    ).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.hasExceptionsFilterValueLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.lastLegArrivalStatusFilterValueLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async deleteRemainingFilterChipExplorePages() {
    await this.chargeableWeightFilterLocator.click();
    await this.hasExceptionsFilterLocator.click();
    await this.lastLegArrivalStatusFilterLocator.click();
  }

  async checkDeleteRemainingFilterChipExplorePages() {
    await this.filterFields.waitFor({ state: 'visible' });
    await expect(this.chargeableWeightFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.lastLegArrivalStatusFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async getDropdownRowsAsDict(
    fieldTestId: string
  ): Promise<Record<string, string>> {
    const field = this.page.getByTestId(fieldTestId);
    const dropdownRows = this.page.locator('[class*="a1-dropdownRow"]');
    const count = await dropdownRows.count();
    console.log(count);
    const dict: Record<string, string> = {};

    for (let i = 0; i < count; i++) {
      const row = dropdownRows.nth(i);
      const divs = row.locator('div');
      const key = await divs.nth(0).textContent();
      const value = await divs.nth(1).textContent();

      if (key && value) {
        dict[key.trim()] = value.trim();
      }
    }

    return dict;
  }

  async getDropdownKeyValue(
    fieldTestId: string,
    optionNumber: number
  ): Promise<{ key: string; value: string } | null> {
    const dict = await this.getDropdownRowsAsDict(fieldTestId);
    const keys = Object.keys(dict);

    if (keys.length > 0) {
      const nKey = keys[optionNumber];
      return {
        key: nKey,
        value: dict[nKey],
      };
    }

    return null;
  }

  async clickDropdownValue(fieldTestId: string, optionNumber: number) {
    await this.page.getByTestId(fieldTestId).click();
    const result = await this.getDropdownKeyValue(fieldTestId, optionNumber);
    if (!result) throw new Error('No dropdown value found');
    dischargePortKey = result.key.replace(' ', '');
    dischargePortValue = result.value.replace(' ', '');
    await this.page
      .getByTestId(fieldTestId)
      .getByText(`${dischargePortKey}${dischargePortValue}`)
      .click();
    return { key: dischargePortKey, value: dischargePortValue };
  }
}
