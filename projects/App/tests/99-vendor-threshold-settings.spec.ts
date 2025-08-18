import { Page, test, expect } from '@playwright/test';
import { JobPage } from '../models/jobPage';
import { logInAuth } from '../../utils';
import { __apFileName } from '../../constants';
import { createJob, inputApJobMetaFields } from '../models/appUtils';
import { JobTemplate } from '../models/jobTemplate';
import {
  JobTypeSettings,
  ThresholdRule,
  ThresholdValidationData,
} from '../models/JobTypeSettings';

/**
 * Developer's Note:
 * If this TS fails, ensure to delete the vendor threshold settings in AP Invoice CompanY > AP NYC Job type
 */

let page: Page;
let jobPage: JobPage;
let jobTemplate: JobTemplate;
let jobTypeSettings: JobTypeSettings;

let thresholds: ThresholdRule[] = [];

test.describe
  .parallel('[99] User edits the company vendor recon threshold settings ', () => {
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

  test('[99.1] User adds a vendor recon threshold settings ', async () => {
    thresholds = [];
    jobTypeSettings.resetThresholds();
    await jobTemplate.gotoApJobTemplate();
    await expect(
      page.getByRole('heading', { name: 'Job Type Details' })
    ).toBeVisible();

    //Edit Vendor Recon Threshold Settings
    await jobTypeSettings.openThresholdSettings();
    await jobTypeSettings.selectVendor('DIAO ENG CHAI STEAMSHIP LINE');
    // await jobTypeSettings.selectVendor('Herculean Ocean Logistics');
    await jobTypeSettings.addThresholdSetting();
    await jobTypeSettings.addThresholdMinAndMaxValue(-Infinity, 1000, 10, true);
    await jobTypeSettings.clickAddRow();
    await jobTypeSettings.addThresholdMinAndMaxValue(1000, 1500, 50);
    await jobTypeSettings.addThresholdMinAndMaxValue(1500, Infinity, 200);
    await jobTypeSettings.applyThresholdSettings();
    thresholds = jobTypeSettings.getThresholds();
    console.log('Stored thresholds:', thresholds);
    await jobTypeSettings.saveJobTypeSettings();

    //Create Job to Check
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
    await jobPage.reconcileAndCheckReconciliationResults();
    await expect(page.getByText('Reconciliation Results')).toBeVisible();
    await page.waitForTimeout(2000);

    const reconciliationResultsTable = page.locator('table').nth(1);
    const totalAmountRow = reconciliationResultsTable
      .locator('tr', { hasText: 'Total Amount' })
      .first();
    await expect(totalAmountRow).toBeVisible();

    const validationAmounts =
      await jobTypeSettings.getThresholdValidationData(2);
    for (const data of validationAmounts) {
      console.log(
        `Row ${data.rowIndex}: Invoice Amount = ${data.invoiceAmount}, Threshold Used = ${data.rule.value}, Range = [${data.rule.min}, ${data.rule.max})`
      );
      expect(data.delta).toBeLessThanOrEqual(data.rule.value);
      expect(data.deltaAmountText).toContain(`threshold of ${data.rule.value}`);
    }
  });

  test('[99.2] User edits a saved vendor recon threshold settings ', async () => {
    const context = await page.context();
    const templatePage = await context.newPage();
    const jobTemplateTab = new JobTemplate(templatePage);
    const jobTypeSettingsTab = new JobTypeSettings(templatePage);
    await jobTemplateTab.gotoApJobTemplate();

    await jobTypeSettingsTab.openThresholdSettings();
    await jobTypeSettingsTab.editThresholdValue(999);
    if (thresholds.length > 0) {
      thresholds[thresholds.length - 1].value = 999;
    }
    await jobTypeSettingsTab.applyThresholdSettings();
    await jobTypeSettingsTab.saveJobTypeSettings();

    await page.bringToFront();
    await page.reload();

    await jobPage.reconcileAndCheckReconciliationResults();
    await expect(page.getByText('Reconciliation Results')).toBeVisible();

    const metaTable = page.locator('table').nth(1); // or nth(0), nth(2), etc.
    const totalAmountRow = metaTable
      .locator('tr', { hasText: 'Total Amount' })
      .first();
    await expect(totalAmountRow).toBeVisible();

    const validationAmounts =
      await jobTypeSettings.getThresholdValidationData(2);
    for (const data of validationAmounts) {
      console.log(
        `Row ${data.rowIndex}: Invoice Value = ${data.invoiceAmount}, Threshold Used = ${data.rule.value}, Range = [${data.rule.min}, ${data.rule.max})`
      );
      expect(data.delta).toBeLessThanOrEqual(data.rule.value);
      expect(data.deltaAmountText).toContain(`threshold of ${data.rule.value}`);
    }
  });

  test('[99.3] User deletes a vendor recon threshold settings ', async () => {
    const pages = await page.context().pages();
    const templatePage = pages[1];
    await templatePage.bringToFront();

    const jobTypeSettingsTab = new JobTypeSettings(templatePage);
    await jobTypeSettingsTab.openThresholdSettings();
    const defaultThresholds = await jobTypeSettingsTab.getDefaultThresholds();

    await jobTypeSettingsTab.deleteVendorThreshold();
    await jobTypeSettingsTab.verifyVendorSectionNotVisible(
      'DIAO ENG CHAI STEAMSHIP LINE'
    );
    // await jobTypeSettingsTab.verifyVendorSectionNotVisible(
    //   'Herculean Ocean Logistics'
    // );
    await jobTypeSettingsTab.applyThresholdSettings();
    await jobTypeSettingsTab.saveJobTypeSettings();

    await page.bringToFront();
    await page.reload();
    await jobPage.reconcileAndCheckReconciliationResults();
    await expect(page.getByText('Reconciliation Results')).toBeVisible();

    const metaTable = page.locator('table').nth(1);
    const totalAmountRow = metaTable
      .locator('tr', { hasText: 'Total Amount' })
      .first();
    await expect(totalAmountRow).toBeVisible();

    for (let row = 0; row < 2; row++) {
      const deltaText = await page
        .getByTestId(`ap-Metadata Reconciliation-${row}-3`)
        .innerText();
      const matchedThreshold = defaultThresholds.find((val) =>
        deltaText.includes(`threshold of ${val}`)
      );

      console.log(
        `Row ${row}: deltaText = "${deltaText}", matched default threshold = ${matchedThreshold}`
      );
      expect(
        defaultThresholds.some((val) =>
          deltaText.includes(`threshold of ${val}`)
        ),
        `Delta text should reference a default threshold value: ${deltaText}`
      ).toBeTruthy();
    }
    await templatePage.close();
  });
});
