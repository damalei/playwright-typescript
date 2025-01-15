import { Locator, Page } from '@playwright/test';
import { waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class ModalAddCard {
  readonly page: Page;
  readonly inputCardName: Locator;
  readonly inputSubtitle: Locator;
  readonly inputToolTipWhat: Locator;
  readonly inputToolTipHow: Locator;
  readonly inputQuery: Locator;
  readonly modalAddCard: Locator;
  readonly buttonSave: Locator;
  readonly buttonLineChart: Locator;
  readonly inputXaxis: Locator;
  readonly inputYaxis: Locator;
  readonly buttonFilters: Locator;
  readonly sectionFilters: Locator;
  readonly buttonEditAdvanceFilter: Locator;
  readonly advanceFilterAccordionShipment: Locator;
  readonly advanceFilterButtonUpdateFilters: Locator;
  readonly buttonCancel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalAddCard = this.page.locator('//div[@role="dialog"]');
    this.inputQuery = this.modalAddCard.locator('textarea').nth(4);
    this.inputCardName = this.modalAddCard
      .getByLabel('Card Name')
      .locator('..')
      .locator('..')
      .locator('input');
    this.inputSubtitle = this.modalAddCard
      .getByLabel('Subtitle')
      .locator('..')
      .locator('..')
      .locator('input');
    this.inputToolTipWhat = this.modalAddCard
      .getByLabel('What is this report for?')
      .locator('..')
      .locator('..')
      .locator('textarea')
      .first();
    this.inputToolTipHow = this.modalAddCard
      .getByLabel('How did we get the data?')
      .locator('..')
      .locator('..')
      .locator('textarea')
      .first();
    this.buttonLineChart = this.modalAddCard.getByRole('button', {
      name: 'LINE CHART',
    });
    this.inputXaxis = this.modalAddCard
      .getByLabel('X Axis')
      .locator('..')
      .locator('..')
      .locator('input');
    this.inputYaxis = this.modalAddCard
      .getByLabel('Y Axis')
      .locator('..')
      .locator('..')
      .locator('input');
    this.buttonSave = this.modalAddCard.getByRole('button', { name: 'Save' });
    this.buttonFilters = this.modalAddCard.getByRole('button', {
      name: '+ Filters',
    });
    this.sectionFilters = this.modalAddCard
      .locator('//h5[text()="Filters"]')
      .locator('..');
    this.buttonEditAdvanceFilter = this.sectionFilters.getByTestId(
      'edit-filters-button'
    );
    this.advanceFilterAccordionShipment =
      this.sectionFilters.getByTestId('Shipment Filters');
    this.advanceFilterButtonUpdateFilters = this.sectionFilters.getByTestId(
      'update-filters-button'
    );
    this.buttonCancel = this.modalAddCard.getByText('Cancel', { exact: true });
  }

  async setAdvanceTextFilter(
    page: Page,
    section: string,
    rule_field: string,
    rule_value: string,
    row_num: number
  ) {
    const accord = this.sectionFilters.getByTestId(`${section}`);
    const ruleField = accord.locator('input').nth(row_num);
    await accord.getByRole('button', { name: 'Add rule' }).click();
    await ruleField.click();
    await this.selectDropdownOption(page, `${rule_field}`);
    const valueField = this.sectionFilters
      .getByTestId(`${section}`)
      .locator('//div[contains(@class, "rule--value")]')
      .nth(row_num)
      .locator('input');
    await valueField.click();
    await this.selectDropdownOption(page, `${rule_value}`);
    await this.advanceFilterButtonUpdateFilters.click();
  }

  async expandAdvanceFilterAccordion(page: Page, section: string) {
    await this.sectionFilters.getByTestId(`${section}`).click();
  }

  async selectDropdownOption(page: Page, option: string) {
    const dropdownPopper = this.page.locator('//div[@role="presentation"]');
    await dropdownPopper
      .locator('div')
      .getByText(`${option}`, { exact: true })
      .click();
  }

  async clickEditCard(page: Page, cardName: string) {
    const card = this.page
      .getByTestId(`data-component-${cardName}`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..');
    await card.getByTestId('EditIcon').click();
  }

  async clickDuplicateCard(page: Page, cardName: string) {
    const card = this.page
      .getByTestId(`data-component-${cardName}`)
      .locator('..')
      .locator('..')
      .locator('..')
      .locator('..');
    await card.getByTestId('ContentCopyIcon').click();
  }

  async clearAdvanceFilter(page: Page, section: string, row_num: number) {
    const delRow = this.sectionFilters
      .getByTestId(`${section}`)
      .getByTestId('DeleteIcon')
      .nth(row_num);
    await delRow.click();
  }
}
