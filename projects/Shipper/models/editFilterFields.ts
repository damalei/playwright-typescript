import { Locator, Page, expect } from '@playwright/test';
import {
  DASHBOARD_TIMEOUT_IN_MS,
  DEFAULT_TIMEOUT_IN_MS,
} from '../../constants';
import { waitforTablePageLoad, waitForFilterSectionToLoad } from '../../utils';

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
  readonly loginEmail: Locator;
  readonly loginPass: Locator;
  readonly loginBtn: Locator;
  readonly exceptionManagementHeader: Locator;
  readonly lastLegArrivalStatusValue: Locator;
  readonly hasExceptionsValue: Locator;
  readonly lastLegArrivalStatusValueChip: Locator;
  readonly hasExceptionsValueChip: Locator;
  readonly hasTrueValueLocator: Locator;
  readonly lastLegArrivalStatusFilterValueLocator: Locator;
  readonly chargeableWeightFilterLocator: Locator;
  readonly lastLegArrivalStatusFilterLocator: Locator;
  readonly dischargePortFilterValueChip: (key: string) => Locator;
  readonly dischargeFilterValueLocator: (key: string) => Locator;
  readonly editFiltersDiv: Locator;
  readonly shipmentsForwarderReferenceSort: Locator;
  readonly editColumnButton: Locator;
  readonly: (key: string) => Locator;
  readonly consigneeNameFilterLocator: Locator;
  readonly originPortFilterLocator: Locator;
  readonly originPortFilterField: Locator;
  readonly consigneeNameFilterField: Locator;
  readonly failedToDepartDrilldownViewShipments: Locator;
  readonly failedToArriveDrilldownViewShipments: Locator;
  readonly exceptionManagementBreadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginEmail = page.getByLabel('Email Address');
    this.loginPass = page.getByLabel('Password');
    this.exceptionManagementHeader = page.getByTestId(
      'exceptions-management-header'
    );
    this.loginBtn = page.getByRole('button', { name: 'LOG IN' });
    this.editFilterFieldsBtn = page.getByTestId('edit-filters-button');
    this.addFilterBtn = page.getByTestId('add-filter-button');
    this.searchFilter = page.getByPlaceholder('Search Filter');
    this.updateFilterFieldsBtn = page.getByTestId('save-filters-button');
    this.shipmentWeightFilterChip = page.getByText('Shipment Weight- KG');
    this.editColumnButton = page.getByRole('button', { name: 'Edit Columns' });
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

    this.consigneeNameFilterLocator = page.locator(
      'span:has-text("Consignee Name") + *'
    );

    this.originPortFilterLocator = page.locator(
      'span:has-text("Origin Port") + *'
    );

    this.saveViewModal = page.getByRole('dialog');
    this.saveViewSuccessNote = page.getByText('has been updated');
    this.filterFields = page.getByTestId('filters');
    this.transportModeFilter = page
      .getByTestId('Transport Mode-custom-multiple-text-field')
      .getByTestId('ExpandMoreIcon');
    this.transportModeSea = page.getByText('SEASea Freight');
    this.shipmentWeightValue = page.getByLabel('value');
    this.transportModeFilterLocator = page
      .locator('[data-testid="Transport Mode-custom-multiple-text-field"]')
      .locator('span:has-text("Sea") + *');
    this.hasTrueValueLocator = page.locator('span:has-text("True") + *');
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
    this.transportModeFilterValueChip = page
      .getByRole('button', {
        name: 'SEA',
      })
      .first();
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
    this.editFiltersDiv = page.getByText('BasicAdvancedReset');
    this.shipmentsForwarderReferenceSort = page.getByTestId(
      'table-header-forwarder_reference'
    );

    this.originPortFilterField = page
      .locator('label')
      .filter({ hasText: 'Origin Port' });
    this.consigneeNameFilterField = page.getByText('Consignee Name');
    this.failedToDepartDrilldownViewShipments = page
      .locator('div')
      .filter({ hasText: /^Failed to depart \(Past 3 months\)View shipments$/ })
      .getByRole('button');
    this.failedToArriveDrilldownViewShipments = page
      .locator('div')
      .filter({ hasText: /^Failed to arrive \(Past 3 months\)View shipments$/ })
      .getByRole('button');
    this.exceptionManagementBreadcrumb = page.getByRole('link', {
      name: 'Exceptions Management',
    });
  }
  async waitForExceptionManagement() {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
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
    await this.clickDropdownValuePort(
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
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    }
  }
  async waitForContainerNumberReference() {
    await this.containerNumbers.waitFor({ state: 'visible' });
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
    await this.clickDropdownValuePort(
      'Discharge Port-custom-multiple-text-field',
      0
    );
    await this.editFiltersDiv.click();
    await this.lastLegArrivalStatusFilterChip.click();
    await this.lastLegArrivalStatusValue.click();
    await this.hasExceptionsChip.click();
    await this.page
      .getByTestId('Has Exceptions-custom-multiple-text-field')
      .getByText('True')
      .click();
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
    await this.hasTrueValueLocator.click();
    await this.lastLegArrivalStatusFilterValueLocator.click();
  }

  async checkDeletedFilterValuesExplorePages() {
    await expect(
      this.dischargeFilterValueLocator(dischargePortKey)
    ).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.hasTrueValueLocator).not.toBeVisible({
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
    await dropdownRows.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await dropdownRows.count();
    const dict: Record<string, string> = {};

    for (let i = 0; i < count - 1; i++) {
      const row = dropdownRows.nth(i);
      const divs = row.locator('div');
      const key = await divs.nth(0).textContent();
      const value = await divs.nth(1).textContent();

      if (key && value) {
        dict[key.trim()] = value.trim();
      }
    }

    if (Object.keys(dict).length === 0) {
      throw new Error('No dropdown values found in rows');
    }

    return dict;
  }

  async getDropdownKeyValue(
    fieldTestId: string,
    optionNumber: number
  ): Promise<{ key: string; value: string }> {
    const dict = await this.getDropdownRowsAsDict(fieldTestId);
    const keys = Object.keys(dict);

    if (optionNumber >= keys.length) {
      throw new Error(
        `Option number ${optionNumber} is out of bounds. Only ${keys.length} options available.`
      );
    }

    const nKey = keys[optionNumber];
    return {
      key: nKey,
      value: dict[nKey],
    };
  }

  async clickDropdownValuePort(fieldTestId: string, optionNumber: number) {
    await this.page.getByTestId(fieldTestId).click();
    const dropdownRows = this.page.locator('[class*="a1-dropdownRow"]');
    await dropdownRows.first().waitFor({ state: 'visible', timeout: 5000 });
    const result = await this.getDropdownKeyValue(fieldTestId, optionNumber);
    if (!result) throw new Error('No dropdown value found');
    dischargePortKey = result.key.trim();
    dischargePortValue = result.value.trim();
    await this.page
      .getByTestId(fieldTestId)
      .getByText(`${dischargePortKey}${dischargePortValue}`)
      .click();
    await this.page.getByTestId(fieldTestId).click();
    return { key: dischargePortKey, value: dischargePortValue };
  }

  async dragSourceToTargetColumn(
    page: Page,
    sourceIndex: number,
    targetIndex: number
  ) {
    console.log(
      `Starting dragSourceToTargetColumn from ${sourceIndex} to ${targetIndex}`
    );
    await waitForFilterSectionToLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);

    const tableHeaderList = await this.page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
    const sourceName = tableHeaderList[sourceIndex]
      .replace(/\(.*?\)/g, '')
      .trim();
    const targetName = tableHeaderList[targetIndex]
      .replace(/\(.*?\)/g, '')
      .trim();
    await this.editColumnButton.click();
    await page.waitForTimeout(2000);
    const columnPopper = this.page.getByTestId('edit-columns-popper');
    await columnPopper.waitFor({
      state: 'visible',
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    const source = columnPopper
      .locator(`//span[text()='${sourceName}']`)
      .locator('..')
      .locator('..')
      .locator('..');
    const target = columnPopper
      .locator(`//span[text()='${targetName}']`)
      .locator('..')
      .locator('..')
      .locator('..');

    await source.waitFor({
      state: 'visible',
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await target.waitFor({
      state: 'visible',
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await source.hover();
    await page.waitForTimeout(1000);
    await source.dragTo(target);
    await page.waitForTimeout(1000);
    await source.hover();
    await page.waitForTimeout(1000);
    await this.page.mouse.down();
    const box = (await target.boundingBox())!;
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await target.hover();
    await page.waitForTimeout(1000);
    await this.page.mouse.up();
    await this.editColumnButton.click();
    await page.waitForTimeout(2000);
    const newTableHeaderList = await this.getHeaderList(page);
    return newTableHeaderList;
  }

  async swapColumns(page: Page, sourceIndex: number, targetIndex: number) {
    await waitForFilterSectionToLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    await waitforTablePageLoad(page, DASHBOARD_TIMEOUT_IN_MS);
    const tableHeaderList = await this.getHeaderList(page);
    const temp = tableHeaderList[sourceIndex];
    tableHeaderList[sourceIndex] = tableHeaderList[targetIndex];
    tableHeaderList[targetIndex] = temp;
    return tableHeaderList;
  }

  async getHeaderList(page: Page) {
    return await page
      .getByTestId('table-header')
      .locator('th')
      .allTextContents();
  }
  async loginToShipperDrilldown() {
    await this.loginEmail.fill(`${process.env.SHIPPER_VIZ_CLIENT2_USER}`);
    await this.loginPass.fill(`${process.env.SHIPPER_VIZ_CLIENT2_PASS}`);
    await this.loginBtn.click();
    await expect(this.exceptionManagementHeader).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(
      this.page.getByText('Estimated Time of Arrival (').first()
    ).toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
  }

  async removeFilterFieldsDrilldown() {
    await this.originPortFilterLocator.click();
    await this.consigneeNameFilterLocator.click();
  }

  async checkRemovedFilterFieldsDrilldown() {
    await expect(this.originPortFilterField).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(this.consigneeNameFilterField).not.toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async drilldownFailedToDepartOrArrive() {
    if (await this.failedToDepartDrilldownViewShipments.isVisible()) {
      await this.failedToDepartDrilldownViewShipments.click();
    } else {
      await this.failedToArriveDrilldownViewShipments.click();
    }
    await expect(this.page.getByText('Filters applied from')).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await expect(
      this.page.getByTestId('table-body-0-forwarder_reference')
    ).toBeVisible({ timeout: DASHBOARD_TIMEOUT_IN_MS });
    await expect(this.exceptionManagementBreadcrumb).toBeVisible({
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
  }

  async addFilterValueDrilldown() {
    await this.transportModeFilter.click();
    const firstOption = this.page
      .locator('.MuiGrid-container.css-1sznya1-dropdownRow')
      .first();
    const optionText = await firstOption.innerText();
    const selectedText = optionText.split('\n')[0].trim();
    await firstOption.click();

    await this.saveViewDashboard();
    await this.navigateDashboardBackToExploreShipments();
    const chip = this.page
      .locator('.MuiChip-root')
      .filter({ hasText: selectedText });
    await expect(chip).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'True' })).toBeVisible();
  }

  async selectFirstOption(filterField: Locator) {
    await filterField.waitFor({
      state: 'visible',
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    await filterField.click();

    const dropdownOption = this.page
      .locator('.MuiGrid-container.css-1sznya1-dropdownRow')
      .first();
    await dropdownOption.waitFor({
      state: 'visible',
      timeout: DASHBOARD_TIMEOUT_IN_MS,
    });
    const selectedText = await dropdownOption.innerText();
    await dropdownOption.click();
    return selectedText.split('\n')[0].trim();
  }
}
