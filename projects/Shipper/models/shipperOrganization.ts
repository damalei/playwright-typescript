import { Locator, Page } from '@playwright/test';
import { waitForFilterSectionToLoad } from '../../utils';
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';

export class ShipperOrganization {
  // main page
  readonly page: Page;
  readonly buttonAddOrganization: Locator;
  readonly inputOrganizationName: Locator;
  readonly inputOrganizationCode: Locator;
  readonly inputSearchOrganization: Locator;
  //modal
  readonly buttonCreateOrganization: Locator;
  readonly optionsOrganizationCode: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonAddOrganization = page.getByRole('button', {
      name: 'Add Organization',
    });
    this.inputOrganizationName = page.getByPlaceholder(
      'Enter an alias for this organization'
    );
    this.inputOrganizationCode = page.getByPlaceholder(
      'Enter at least 3 characters of your org to search'
    );
    this.buttonCreateOrganization = page.getByRole('button', {
      name: 'Create Organization',
    });
    this.inputSearchOrganization = page.getByPlaceholder(
      'Enter at least 3 characters to search'
    );
    this.optionsOrganizationCode = page.locator('//div[@role="presentation"]');
  }

  async inputOnDropDownField(field: Locator, value: string) {
    await field.pressSequentially(value);
    await this.page.keyboard.press('Space');
    await this.page.keyboard.press('Backspace');
    await this.optionsOrganizationCode.getByText(value).click();
  }
}
