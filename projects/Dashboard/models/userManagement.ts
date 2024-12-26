import { Locator, Page } from "@playwright/test";

export class UserManagement {
  readonly page: Page;
  readonly emailSearchField: Locator;
  readonly searchButton: Locator;
  readonly referenceComponent: Locator;
  readonly manageUserdiv: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailSearchField = page.locator('label').getByText('Email').locator('//following-sibling::div').locator('input')
    this.searchButton = page.getByRole('button', {name: 'Search'})
    this.referenceComponent = page.locator('//h5[text()="Manage Users"]')
    // this.manageUserdiv = page.locator('//main[@class="css-kappml-content"]')
    }

    async searchEmail(email: string){
        await this.emailSearchField.fill(email)
        await this.searchButton.click()
        await this.waitForReferenceComponent()
    }

    async clickEditAccess(email: string){
        await this.page.locator(`//td[text()="${email}"]`).locator('..').locator('//button[@aria-label="edit"]').click()
    }
    
    async waitForReferenceComponent() {
        await this.referenceComponent.waitFor({ state: 'visible' });
      }

}
