import { Locator, Page } from '@playwright/test';

export class JobPage {
  readonly page: Page;
  readonly tabDocuments: Locator;
  readonly taskElements: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tabDocuments = page.getByTestId('job-document-tab');
    this.taskElements = page.locator('[data-testid^="task"]');
  }

  async fillAndEnter(locator: Locator, text: string) {
    await locator.fill(text);
    await locator.press('Enter');
  }

  async clickOnColumnCard(column: Locator, index: number) {
    await column.locator('> *').nth(index).click();
  }
}
