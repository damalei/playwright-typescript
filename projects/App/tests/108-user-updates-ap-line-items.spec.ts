import { Page, test, expect } from '@playwright/test';
import { JobPage } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName } from '../../constants';
import { createJob, inputApJobMetaFields } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import { JobTypeSettings } from '../models/JobTypeSettings';

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let jobTypeSettings: JobTypeSettings;

test.describe.configure({ mode: 'serial' });

test.describe('[108] User checks and updates [AP] line items ', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.APP_TEAMLEAD_USER}`,
      `${process.env.APP_TEAMLEAD_PASS}`
    );
    jobPage = new JobPage(page);
    jobTemplate = new JobTemplate(page);
    jobTypeSettings = new JobTypeSettings(page);
  });

  test('[108.1] User copies [AP] line items  ', async () => {
    const jobName = await createJob(
      page,
      'AP Invoice NYC (Demo)',
      `${process.env.APP_CLIENT_USER}`,
      `${process.env.APP_CLIENT_USER}`,
      __apFileName
    );

    await inputApJobMetaFields(page, jobName);
    const jobUrl = await page.url();
    await jobPage.deleteTextAreaValue(jobPage.fieldErroNotes);

    await jobPage.openLineItemTable();
    await expect(
      jobPage.extractTableBox
        .getByRole('cell', { name: 'Charge Code' })
        .locator('div')
    ).toBeVisible();
    await expect(jobPage.backToJobHideLineItemTable).toBeVisible();

    await jobPage.insertRowBelow(6);
    await jobPage.copyRow(6);
    await jobPage.pasteToRow(7);
    await jobPage.waitForTableUpdate(2000);

    const isCopied = await jobPage.compareRowValues(5, 6); // 0-indexed: row 6 = index 5, row 7 = index 6
    expect(isCopied).toBe(true);

    await jobPage.closeLineItemTable();
    await jobPage.openLineItemTable();
    await jobPage.waitForTableUpdate(2000);

    const copiedRowValues = await jobPage.getRowValues(5);
    const pastedRowValues = await jobPage.getRowValues(6);
    console.log(
      'After closing line item table, source row 6 values:',
      copiedRowValues
    );
    console.log(
      'After closing line item table, target row 7 values:',
      pastedRowValues
    );

    const isRetainedAfterReopen = await jobPage.compareRowValues(5, 6);
    console.log('Row successfully copied and pasted');
    expect(isRetainedAfterReopen).toBe(true);
  });

  test('[108.2] User cuts [AP] line items', async () => {
    const originalRow1Values = await jobPage.getRowValues(0); //row 1 content indexed
    console.log('=== DEBUG: Cut Test - Original Row 2 Values ===');
    console.log('Original row 2 values:', originalRow1Values);

    await jobPage.insertRowAbove(1); //row 1 playwright locator
    const currentRow1Values = await jobPage.getRowValues(0);
    const currentRow2Values = await jobPage.getRowValues(1);
    console.log('Current row 1 values:', currentRow1Values);
    console.log('Current row 2 values:', currentRow2Values);

    await jobPage.cutRow(2);
    await jobPage.waitForTableUpdate(1000);
    const isRow2Empty = await jobPage.verifyRowIsEmpty(1);
    expect(isRow2Empty).toBe(true);

    await jobPage.pasteToRow(1);
    await jobPage.waitForTableUpdate(2000);

    const row1Values = await jobPage.getRowValues(0);
    for (let i = 0; i < originalRow1Values.length; i++) {
      if (originalRow1Values[i].trim() !== '') {
        console.log(
          `Comparing cell ${i}: Original="${originalRow1Values[i]}" vs Pasted="${row1Values[i]}"`
        );
        expect(row1Values[i]).toBe(originalRow1Values[i]);
      }
    }
    const isRow2StillEmpty = await jobPage.verifyRowIsEmpty(1);
    expect(isRow2StillEmpty).toBe(true);
    await jobPage.closeLineItemTable();
    await jobPage.openLineItemTable();
    await jobPage.waitForTableUpdate(2000);
    const finalRow1Values = await jobPage.getRowValues(0);
    const finalRow2Values = await jobPage.getRowValues(1);

    for (let i = 0; i < originalRow1Values.length; i++) {
      if (originalRow1Values[i].trim() !== '') {
        console.log(
          `Final comparison cell ${i}: Original="${originalRow1Values[i]}" vs Final="${finalRow1Values[i]}"`
        );
        expect(finalRow1Values[i]).toBe(originalRow1Values[i]);
        expect(finalRow2Values[i].trim()).toBe('');
      }
    }
  });

  test('[108.3] User inserts/adds a row on [AP] line items', async () => {
    const initialRowCount = await jobPage.getTableRowCount();
    const row1OriginalValues = await jobPage.getRowValues(0);
    console.log('Initial row count:', initialRowCount);
    console.log('Row 1 original values:', row1OriginalValues);

    await jobPage.insertRowBelow(1);
    await jobPage.waitForTableUpdate(2000);

    const rowCountAfterBelow = await jobPage.getTableRowCount();
    expect(rowCountAfterBelow).toBeGreaterThan(initialRowCount);

    const row1AfterBelow = await jobPage.getRowValues(0);
    for (let i = 0; i < row1OriginalValues.length; i++) {
      console.log(
        `Comparing cell ${i}: Original="${row1OriginalValues[i]}" vs After="${row1AfterBelow[i]}"`
      );
      expect(row1AfterBelow[i]).toBe(row1OriginalValues[i]);
    }

    const newRowBelow = await jobPage.getRowValues(1);
    for (let i = 0; i < newRowBelow.length; i++) {
      expect(newRowBelow[i].trim()).toBe('');
    }

    await jobPage.insertRowAbove(1);
    await jobPage.waitForTableUpdate(2000);
    const rowCountAfterAbove = await jobPage.getTableRowCount();
    expect(rowCountAfterAbove).toBeGreaterThan(rowCountAfterBelow);

    const originalRowIndex = await jobPage.findRowWithContent(
      row1OriginalValues[0]
    );
    expect(originalRowIndex).toBeGreaterThan(-1);

    const preservedRowValues = await jobPage.getRowValues(originalRowIndex);
    for (let i = 0; i < row1OriginalValues.length; i++) {
      expect(preservedRowValues[i]).toBe(row1OriginalValues[i]);
    }

    let emptyRowCount = 0;
    for (let i = 0; i < Math.min(rowCountAfterAbove, 5); i++) {
      const isEmpty = await jobPage.verifyRowIsEmpty(i);
      if (isEmpty) emptyRowCount++;
    }
    expect(emptyRowCount).toBeGreaterThan(0);

    await jobPage.closeLineItemTable();
    await jobPage.openLineItemTable();
    await jobPage.waitForTableUpdate(2000);

    const finalRowCount = await jobPage.getTableRowCount();
    expect(finalRowCount).toBeGreaterThan(initialRowCount);

    let emptyRowCountAfterReopen = 0;
    for (let i = 0; i < Math.min(finalRowCount, 5); i++) {
      const isEmpty = await jobPage.verifyRowIsEmpty(i);
      if (isEmpty) emptyRowCountAfterReopen++;
    }
    expect(emptyRowCountAfterReopen).toBeGreaterThan(0);
  });

  test('[108.4] User deletes a row on [AP] line items', async () => {
    const initialRowCount = await jobPage.getTableRowCount();
    const originalRowContents: string[][] = [];
    console.log('Initial row count:', initialRowCount);

    for (let i = 0; i < 3; i++) {
      const rowValues = await jobPage.getRowValues(i);
      originalRowContents.push(rowValues);
      console.log(`Original row ${i + 1} values:`, rowValues);
    }

    for (let i = 0; i < 3; i++) {
      await jobPage.removeRow(1);
      await jobPage.waitForTableUpdate(1000);
    }
    const rowCountAfterDelete = await jobPage.getTableRowCount();
    expect(rowCountAfterDelete).toBeLessThan(initialRowCount);
    await jobPage.closeLineItemTable();
    await jobPage.openLineItemTable();
    await jobPage.waitForTableUpdate(2000);
    const finalRowCount = await jobPage.getTableRowCount();
    expect(finalRowCount).toBeLessThan(initialRowCount);
  });
});
