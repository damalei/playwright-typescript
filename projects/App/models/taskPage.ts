import { Locator, Page } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly inputSearchField: Locator;
  readonly columnTodo: Locator;
  readonly columninProgress: Locator;
  readonly columnQA: Locator;
  readonly columnConfirmation: Locator;
  readonly columnDone: Locator;
  readonly buttonOpenJob: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputSearchField = page
      .getByTestId('task-search-bar')
      .locator('input');
    this.columnTodo = page.locator('//*[@data-rfd-droppable-id="TODO"]');
    this.columninProgress = page.locator(
      '//*[@data-rfd-droppable-id="IN_PROGRESS"]'
    );
    this.columnQA = page.locator('//*[@data-rfd-droppable-id="QA"]');
    this.columnConfirmation = page.locator(
      '//*[@data-rfd-droppable-id="CONFIRMATION"]'
    );
    this.columnDone = page.locator('//*[@data-rfd-droppable-id="DONE"]');
    this.buttonOpenJob = page.getByTestId('open-job-button');
  }

  async clickOnColumnCard(column: Locator, index: number) {
    await column.locator('> *').nth(index).click();
  }
}
