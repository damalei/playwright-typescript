import { Page, test, expect, Locator } from '@playwright/test';
import { APP_BASE_URL, DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { JobPage } from '../models/jobPage';
import { IncomingPage } from '../models/incomingPage';

let jobPage: JobPage;
let incomingPage: IncomingPage;
let page: Page;

test.describe.configure({ mode: 'serial' });

test.describe('[105] User checks or edit emails table on Incoming Page', () => {
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

  test('[105.2] User expands the rows of emails table on Incoming Page ', async () => {
    await incomingPage.selectCompany('AP Invoice (Demo)');
    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    await incomingPage.expandButtonFirstRow.click();
    await page.waitForTimeout(2000);

    const originalSubjectText =
      await incomingPage.firstEmailSubject.textContent();
    await expect(incomingPage.expandedAttachment).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(incomingPage.expandedDate).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(incomingPage.expandedIframe).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    if (originalSubjectText) {
      await expect(
        incomingPage.expandedSubjectView.filter({
          hasText: originalSubjectText,
        })
      ).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    }

    await incomingPage.closeExpandButtonFirstRow.click();
    await page.waitForTimeout(1000);

    await expect(incomingPage.expandedAttachment).not.toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(incomingPage.expandedDate).not.toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(incomingPage.expandedIframe).not.toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[105.3] User refreshes emails table on Incoming Page ', async () => {
    await page.reload();
    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await incomingPage.emailTableRefreshButton.click();
    await page.waitForTimeout(2000);

    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
    await expect(page.getByTestId('table-container')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });
  });

  test('[105.1] User sorts all columns of emails table on Incoming Page', async () => {
    await expect(incomingPage.firstEmailSubject).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    await expect(page.getByTestId('table-container')).toBeVisible({
      timeout: DEFAULT_TIMEOUT_IN_MS,
    });

    const tableHeaders = page.getByTestId('table-header').locator('th');
    const allHeaders = await tableHeaders.all();

    const sortableHeaders: Locator[] = [];
    for (const header of allHeaders) {
      const text = await header.textContent();
      if (text && text.trim().length > 0) {
        const hasSortIcon =
          (await header.getByTestId('selector-icon').count()) > 0;
        if (hasSortIcon) {
          sortableHeaders.push(header);
        }
      }
    }

    for (const currentHeader of sortableHeaders) {
      const columnText = await currentHeader.textContent();

      await currentHeader.waitFor({
        state: 'visible',
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });

      console.log(`Ascending sort for column: ${columnText}`);
      await currentHeader.click();
      await page.waitForTimeout(1000);

      await expect(incomingPage.firstEmailSubject).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });

      console.log(`Descending sort for column: ${columnText}`);
      await currentHeader.click();
      await page.waitForTimeout(1000);

      await expect(incomingPage.firstEmailSubject).toBeVisible({
        timeout: DEFAULT_TIMEOUT_IN_MS,
      });
    }

    console.log('All table columns sorting test completed successfully');
  });
});
