import { Page, test, expect, Locator } from '@playwright/test';
import { APP_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { JobPage } from '../models/jobPage';
import { IncomingPage } from '../models/incomingPage';

let jobPage: JobPage;
let incomingPage: IncomingPage;
let page: Page;

test.describe('[104] User searches ingested emails on Incoming Page', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    jobPage = new JobPage(page);
    incomingPage = new IncomingPage(page);
    await page.goto(APP_BASE_URL);
    await incomingPage.navigateToIncomingPage();
    await expect(
      page.getByRole('heading', { name: 'Incoming Documents' })
    ).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[104.1] User adds email filter to search emails from Email Ingest on Incoming Page ', async () => {
    await incomingPage.selectCompany('AP Invoice (Demo)');
    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    await incomingPage.emailFilterMenuButton.click();
    await incomingPage.emailFilterAddButton.click();
    const currentDateTime = await incomingPage.setupDateAndTimeReceivedFilter();

    await page.keyboard.press('Escape');
    await incomingPage.ingestedEmailSearch.click();
    await page.waitForTimeout(5000);

    const filterDate = new Date(currentDateTime);
    const validationDateAndTimeReceivedResults =
      await incomingPage.validateEmailDatesWithFilterApplied(filterDate);

    for (const result of validationDateAndTimeReceivedResults) {
      expect(result.isValid).toBe(true);
    }

    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[104.2] User adds multiple email filters to search emails from Email Ingest on Incoming Page ', async () => {
    await incomingPage.emailFilterMenuButton.click();
    await incomingPage.emailFilterAddButton.click();

    await incomingPage.addJobStatusFilter('IN_PROGRESS');
    await incomingPage.emailFilterAddButton.click();
    await incomingPage.addJobTypeFilter('AP Invoice (Demo)');

    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');

    await incomingPage.ingestedEmailSearch.waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await incomingPage.ingestedEmailSearch.click();
    await page.waitForTimeout(5000);

    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[104.3] User deletes email filters to search emails from Email Ingest on Incoming Page ', async () => {
    await incomingPage.emailFilterMenuButton.click();
    const count = await incomingPage.deleteEmailFilter.count();

    for (let i = count - 1; i >= 0; i--) {
      await incomingPage.deleteEmailFilter.nth(i).click();
      await page.waitForTimeout(500);
    }

    await page.keyboard.press('Escape');
    await incomingPage.ingestedEmailSearch.click();
    await page.waitForTimeout(2000);

    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    console.log(`Deleted ${count} email filters`);
  });
});
