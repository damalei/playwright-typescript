import { Page, test, expect } from '@playwright/test';
import { APP_BASE_URL } from '../../constants';
import { TaskPage } from '../models/taskPage';
import { JobPage } from '../models/jobPage';
import { waitForTaskCardToLoad } from '../../utils';

let taskPage: TaskPage;
let jobPage: JobPage;

test.describe.parallel('[80] Tasks page tab checking', () => {
  test.beforeEach(async ({ page }) => {
    taskPage = new TaskPage(page);
    jobPage = new JobPage(page);
    await page.goto(APP_BASE_URL);
    await taskPage.inputSearchField.click();
    await taskPage.inputSearchField.fill('');
    await taskPage.inputSearchField.press('Enter');
    // await waitForTaskCardToLoad(page);
  });

  test('[80.1] User should be able to access the jobs under Done column', async () => {
    await taskPage.clickOnColumnCard(taskPage.columnDone, 0);
    await taskPage.buttonOpenJob.nth(0).click();
    await expect(jobPage.tabDocuments).toBeVisible();
  });

  test('[80.1] User should be able to access the jobs under To Do column', async () => {
    await taskPage.clickOnColumnCard(taskPage.columnTodo, 0);
    await taskPage.buttonOpenJob.nth(0).click();
    await expect(jobPage.tabDocuments).toBeVisible();
  });

  test('[80.1] User should be able to access the jobs under In Progress column', async () => {
    await taskPage.clickOnColumnCard(taskPage.columninProgress, 0);
    await taskPage.buttonOpenJob.nth(0).click();
    await expect(jobPage.tabDocuments).toBeVisible();
  });

  test('[80.1] User should be able to access the jobs under QA column', async () => {
    await taskPage.clickOnColumnCard(taskPage.columnQA, 0);
    await taskPage.buttonOpenJob.nth(0).click();
    await expect(jobPage.tabDocuments).toBeVisible();
  });

  test('[80.1] User should be able to access the jobs under Confirmation column', async () => {
    await taskPage.clickOnColumnCard(taskPage.columnConfirmation, 0);
    await taskPage.buttonOpenJob.nth(0).click();
    await expect(jobPage.tabDocuments).toBeVisible();
  });
});
