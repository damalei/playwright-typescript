import { Page, test, expect } from '@playwright/test';
import { APP_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { JobPage } from '../models/jobPage';
import { waitForTaskCardToLoad } from '../../utils';

let jobPage: JobPage;
let page: Page;

const jobsPageTableHeaders = [
  'Actions',
  'Expedock Job Code',
  'Customer Job ID',
  'Job Type',
  'Company Name',
  'Job Name',
  'Owner',
  'QA',
  'Status',
  'SLA Time Left',
];

const expectedTabs = [
  'All',
  'Todo',
  'In Progress',
  'QA',
  'Confirmation',
  'Done',
  'Deleted',
];

test.describe('[82] Jobs page tab checking', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    jobPage = new JobPage(page);
    await page.goto(APP_BASE_URL);

    await jobPage.jobsMainPage.click();
    await expect(page).toHaveURL(/.*\/jobs/);
    await Promise.all(
      expectedTabs.map(async (tabName) =>
        expect(await jobPage.getJobTab(tabName)).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        })
      )
    );
  });

  test('[82.1] Check job link under JMS Jobs page', async () => {
    for (const tabName of expectedTabs) {
      const jobsPageTab = await jobPage.getJobTab(tabName);
      await jobsPageTab.click();
      await expect(jobsPageTab).toBeVisible();

      await expect(jobPage.firstTableRow).toBeVisible();
      const tableHeaderNames = await jobPage.firstTableRow.textContent();
      for (const header of jobsPageTableHeaders) {
        await expect(tableHeaderNames).toContain(header);
      }
      if (tabName === 'Deleted') continue;

      if (
        (await jobPage.firstJobRow.isVisible()) &&
        (await jobPage.iconOpenJob.isVisible())
      ) {
        await jobPage.iconOpenJob.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('body', { state: 'visible' });
        try {
          await page.waitForLoadState('networkidle', { timeout: 10000 });
        } catch (error) {
          console.log(`Loading ${tabName} tab, continuing...`);
        }

        if (
          ['All', 'In Progress', 'QA', 'Confirmation', 'Done'].includes(tabName)
        ) {
          await expect(jobPage.documentTabPanel).toBeVisible({
            timeout: DEFAULT_TIMEOUT_IN_MS,
          });
        }
        await expect(jobPage.tabInstructions).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
        await expect(jobPage.tabDocument).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
        await expect(jobPage.tabDocument).toHaveAttribute(
          'aria-selected',
          'true'
        );
        await expect(jobPage.tabJobInformation).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
        await expect(jobPage.tabEDocs).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
        await expect(jobPage.tabTaskInfo).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });
        await expect(jobPage.tabEmail).toBeVisible({
          timeout: DEFAULT_TIMEOUT_IN_MS,
        });

        await page.goBack();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*\/jobs/);
      }
    }
  });
});
