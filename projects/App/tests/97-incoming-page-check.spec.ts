import { Page, test, expect } from '@playwright/test';
import { APP_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { JobPage } from '../models/jobPage';
import { IncomingPage } from '../models/incomingPage';

let jobPage: JobPage;
let incomingPage: IncomingPage;
let page: Page;

test.describe('[97] Incoming page Actions check', () => {
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

  test('[97.1] User checks "View Job" action on Incoming page', async () => {
    await incomingPage.selectCompany('AP Invoice (Demo)');
    await incomingPage.buttonViewJobFirstRow.waitFor({
      state: 'visible',
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await incomingPage.buttonViewJobFirstRow.click();
    await page.waitForTimeout(5000);

    await expect.soft(jobPage.documentTabPanel).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(jobPage.tabInstructions).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(jobPage.tabDocument).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect
      .soft(jobPage.tabDocument)
      .toHaveAttribute('aria-selected', 'true');
    await expect.soft(jobPage.tabJobInformation).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(jobPage.tabEDocs).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(jobPage.tabTaskInfo).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(jobPage.tabEmail).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect
      .soft(page.getByTestId('grid-container').locator('div'))
      .toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    await page.goBack();
    await expect.soft(incomingPage.emailIngestTab).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[97.2] User checks "View Task" action on Incoming page', async () => {
    await incomingPage.buttonViewTaskFirstRow.waitFor({
      state: 'visible',
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await incomingPage.buttonViewTaskFirstRow.click();
    await page.waitForTimeout(5000);

    await expect.soft(page.getByText('Open as pageJobsTask')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(page.getByRole('tab', { name: 'Jobs' })).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect
      .soft(page.getByRole('tab', { name: 'Task Info' }))
      .toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    await expect
      .soft(page.getByText('IngestionActionsJob NameJob'))
      .toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    await expect
      .soft(
        page.getByRole('cell', { name: 'view delete duplicate' }).locator('div')
      )
      .toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });

    await incomingPage.closeButtonTaskCard.click();
    await page.waitForTimeout(5000);

    await expect.soft(page.getByText('Open as pageJobsTask')).not.toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(incomingPage.emailIngestTab).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(incomingPage.buttonViewTaskFirstRow).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect.soft(incomingPage.buttonViewJobFirstRow).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });
});
