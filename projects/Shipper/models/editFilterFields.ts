import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_TIMEOUT_IN_MS } from '../../constants';

export class EditFilterFields {
  readonly page: Page;
  readonly editFilterFieldsBtn: Locator;
  readonly addFilterBtn: Locator;
  readonly searchFilter: Locator;
  readonly updateFilterFieldsBtn: Locator;
  readonly shipmentWeightFilterChip: Locator;
  readonly saveDashboardView: Locator;
  readonly hasExcpetionsChip: Locator;
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
  readonly dischargeFilterValueLocator: Locator;
  readonly dischargePortValue: Locator;
  readonly dischargePortFilterFields: Locator;
  readonly deleteFilterValueBtn: Locator;
  readonly dischargePortFilterValueChip: Locator;
  readonly transportModeFilterValueChip: Locator;
  readonly shipmentWeightFilterValueChip: Locator;
  readonly failedToDepartDrilldown: Locator;
  readonly failedToArriveDrilldown: Locator;
  readonly pageLastUpdatedFilterLocator: Locator;
  readonly shipmentWeightFilterLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editFilterFieldsBtn = page.getByTestId('edit-filters-button');
    this.addFilterBtn = page.getByTestId('add-filter-button');
    this.searchFilter = page.getByPlaceholder('Search Filter');
    this.updateFilterFieldsBtn = page.getByTestId('save-filters-button');
    this.shipmentWeightFilterChip = page.getByText('Shipment Weight- KG');
    this.hasExcpetionsChip = page
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
      'span:has-text("Page Last") + *'
    );
    this.shipmentWeightFilterLocator = page.locator(
      'span:has-text("Shipment Weight") + *'
    );
    this.shipperNameFilterLocator = page.locator(
      'span:has-text("Shipper Name") + *'
    );
    this.saveViewModal = page.getByRole('dialog');
    this.saveViewSuccessNote = page.getByText('Your "Exceptions Management');
    this.filterFields = page.getByTestId('filters');
    this.transportModeFilter = page
      .getByTestId('Transport Mode-custom-multiple-text-field')
      .locator('div');
    this.transportModeSea = page.getByText('SEA', { exact: true });
    this.shipmentWeightValue = page.getByLabel('value');
    this.transportModeFilterLocator = page.locator('span:has-text("Sea") + *');
    this.dischargeFilterValueLocator = page.locator(
      'span:has-text("NLAMS") + *'
    );
    this.drilldownTableShipmentsArriving = page
      .getByText('Estimated Time of Arrival (')
      .first();
    this.dischargePortValue = page.getByText('NLAMSAmsterdam');
    this.dischargePortFilterFields = page
      .getByTestId('Discharge Port-custom-multiple-text-field')
      .locator('div');
    this.deleteFilterValueBtn = page.getByText('Delete');
    this.dischargePortFilterValueChip = page.getByRole('button', {
      name: 'NLAMS',
    });
    this.transportModeFilterValueChip = page.getByRole('button', {
      name: 'SEA',
    });
    this.shipmentWeightFilterValueChip = page.getByText('Shipment Weight1 KG');
    this.failedToDepartDrilldown = page.getByText('Failed to depart (Past 3');
    this.failedToArriveDrilldown = page.getByText('Failed to arrive (Past 3');
  }

  async waitForExceptionManagement() {
    await this.page.waitForLoadState('load');
    await this.drilldownTableShipmentsArriving.waitFor({ state: 'visible' });
    await this.filterFields.waitFor({ state: 'visible' });
    await this.failedToDepartDrilldown.waitFor({ state: 'visible' });
    await this.failedToArriveDrilldown.waitFor({ state: 'visible' });
  }

  async editFilterFields() {
    await this.editFilterFieldsBtn.click();
    await expect(this.addFilterBtn).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async addFilterFields() {
    this.addFilterBtn.click();
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
    await this.updateFilterFieldsBtn.click();
    await this.waitForExceptionManagement();
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
    await this.waitForExceptionManagement();
  }

  async checkAddedFilterFields() {
    const filterChips = [
      this.shipmentWeightFilterChip,
      this.hasExcpetionsChip,
      this.pageLastUpdatedOnChip,
      this.shipperNameChip,
    ];

    for (const addedFilterchip of filterChips) {
      await expect(addedFilterchip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterChip() {
    await this.hasExceptionsFilterLocator.click();
    await this.shipperNameFilterLocator.click();
    await this.waitForExceptionManagement();
  }

  async checkDeletedFilterChips() {
    await expect(this.hasExceptionsFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.shipperNameFilterLocator).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async navigateDashboardtoCheck() {
    await this.exploreShipmentsDashboard.click();
    await expect(this.shipmentsForwarderReference).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await this.exceptionManagementDashboard.click();
    await this.waitForExceptionManagement();
  }

  async addFilterValues() {
    await this.transportModeFilter.click();
    await this.transportModeSea.click();
    await this.shipmentWeightFilterChip.click();
    await this.shipmentWeightValue.fill('1');
    await this.dischargePortFilterFields.click();
    await this.dischargePortValue.click();
    await this.waitForExceptionManagement();
  }

  async checkAddedFilterValues() {
    const filterValueChips = [
      this.dischargePortFilterValueChip,
      this.transportModeFilterValueChip,
      this.shipmentWeightFilterValueChip,
    ];
    for (const addedFilterValueChip of filterValueChips) {
      await expect(addedFilterValueChip).toBeVisible({
        timeout: DASHBOARD_TIMEOUT_IN_MS,
      });
    }
  }

  async deleteFilterValues() {
    await this.transportModeFilterLocator.click();
    await this.dischargeFilterValueLocator.click();
    await this.shipmentWeightFilterValueChip.click();
    await this.deleteFilterValueBtn.click();
    await this.waitForExceptionManagement();
  }

  async checkDeletedFilterValues() {
    await expect(this.transportModeFilterValueChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.dischargePortFilterValueChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.shipmentWeightFilterValueChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async deleteRemainingFilterChip() {
    await this.pageLastUpdatedFilterLocator.click();
    await this.shipmentWeightFilterLocator.click();
    await this.waitForExceptionManagement();
  }

  async checkDeleteRemainingFilterChip() {
    await expect(this.shipmentWeightFilterChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.pageLastUpdatedOnChip).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }
}
