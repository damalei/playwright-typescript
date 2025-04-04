import { Locator, Page } from '@playwright/test';

export class TaskPage {
  readonly page: Page;
  readonly tableJobs: Locator;
  readonly tableJobInputRow: Locator;
  readonly inputJobName: Locator;
  readonly inputJobType: Locator;
  readonly inputOwner: Locator;
  readonly inputQa: Locator;
  readonly buttonCreate: Locator;

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
}
