import { Locator, Page } from '@playwright/test';
import { waitForTaskCardToLoad } from '../../utils';
import { createEpochName } from './appUtils';
import { APP_BASE_URL } from '../../constants';

export class TaskPage {
  readonly page: Page;
  readonly tableJobs: Locator;
  readonly tableJobInputRow: Locator;
  readonly inputJobName: Locator;
  readonly inputJobType: Locator;
  readonly inputOwner: Locator;
  readonly inputQa: Locator;
  readonly buttonCreate: Locator;
  readonly inputSearchField: Locator;
  readonly columnTodo: Locator;
  readonly columninProgress: Locator;
  readonly columnQA: Locator;
  readonly columnConfirmation: Locator;
  readonly columnDone: Locator;
  readonly buttonOpenJob: Locator;
  readonly buttonCreateTask: Locator;
  readonly inputTaskName: Locator;
  readonly inputReferenceNumber: Locator;
  readonly dropdownCompany: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tableJobs = page.locator('table').nth(1);
    this.tableJobInputRow = this.tableJobs.locator('tr').nth(-1);
    this.inputJobName = this.tableJobInputRow
      .locator('td')
      .nth(2)
      .locator('input');
    this.inputJobType = this.tableJobInputRow
      .getByPlaceholder('Job Type')
      .locator('..')
      .locator('svg');
    this.inputOwner = this.tableJobInputRow
      .locator('td')
      .nth(4)
      .locator('input');
    this.inputQa = this.tableJobInputRow.locator('td').nth(5).locator('input');
    this.buttonCreate = this.tableJobInputRow.getByRole('button', {
      name: 'Create',
    });
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
    this.buttonCreateTask = page.getByRole('button', { name: 'Create Task' });
    this.inputTaskName = page.getByTestId('task-name-textfield');
    this.inputReferenceNumber = page.getByTestId('task-reference-textfield');
    this.dropdownCompany = page.locator(
      '//div[@aria-labelledby="company-select"]'
    );
  }

  async openNewJob(jobName: string) {
    const rowNewJob = await this.page.getByTestId(`job-row-${jobName}`);
    const buttonOpenNewJob = await rowNewJob.getByTestId('open-job-button');
    await buttonOpenNewJob.click();
  }

  async clickJobType(jobName: string) {
    await this.page
      .getByRole('row', { name: `${jobName}     Open` })
      .getByRole('combobox')
      .first()
      .click();
  }

  async clickOnColumnCard(column: Locator, index: number) {
    const taskCard = await column.locator('> *').nth(index);
    await waitForTaskCardToLoad(this.page, column);
    await taskCard.hover();
    await taskCard.click();
  }

  async goto() {
    await this.page.goto(APP_BASE_URL);
  }

  async createTask() {
    const taskName = `QATEST${createEpochName()}`;
    await this.buttonCreateTask.click();
    await this.inputTaskName.fill(taskName);
    await this.inputReferenceNumber.fill(taskName);
    await this.selectDropdownOption(this.dropdownCompany, 'AP Invoice (Demo)');
    await this.buttonCreateTask.click();
    await this.page.getByText('Task Notes').waitFor({ state: 'visible' });
    const url = await this.page.url();
    return url;
  }

  async selectDropdownOption(field: Locator, option: string) {
    await field.click();
    await this.page.getByRole('option', { name: `${option}` }).click();
  }
}
