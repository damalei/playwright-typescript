import { Locator, Page } from '@playwright/test';
import path from 'path';

export class JobPage {
  readonly page: Page;
  readonly tabDocuments: Locator;
  readonly taskElements: Locator;
  readonly buttonUploadDocument: Locator;
  readonly buttonFileChooser: Locator;
  readonly buttonUpload: Locator;
  readonly buttonCheck: Locator;
  readonly inputInvoiceNumber: Locator;
  readonly inputInvoiceDate: Locator;
  readonly inputInvoiceDueDate: Locator;
  readonly iconErrorMetaField: Locator;
  readonly fieldErroNotes: Locator;
  readonly buttonSaveAndExport: Locator;
  readonly optionReconcile: Locator;
  readonly tabJobInfo: Locator;
  readonly divJobNotes: Locator;
  readonly jobsMainPage: Locator;
  readonly documentTabPanel: Locator;
  readonly tabInstructions: Locator;
  readonly tabDocument: Locator;
  readonly tabJobInformation: Locator;
  readonly tabEDocs: Locator;
  readonly tabTaskInfo: Locator;
  readonly tabEmail: Locator;
  readonly firstTableRow: Locator;
  readonly firstJobRow: Locator;
  readonly iconOpenJob: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tabDocuments = this.page.getByTestId('job-document-tab');
    this.taskElements = this.page.locator('[data-testid^="task"]');
    this.buttonUploadDocument = this.page.getByTestId('upload-icon-btn');
    this.buttonFileChooser = this.page.getByTestId('dropzone-input-generic');
    this.buttonUpload = this.page.getByRole('button', {
      name: 'Upload',
      exact: true,
    });
    this.buttonCheck = this.page.getByTestId('confirm-field-btn');
    this.inputInvoiceNumber = this.page.locator(
      '//input[@aria-label="Invoice Number"]'
    );
    this.inputInvoiceDate = this.page.locator(
      '//input[@aria-label="Invoice Date"]'
    );
    this.inputInvoiceDueDate = this.page.locator(
      '//input[@aria-label="Due Date"]'
    );
    this.iconErrorMetaField = this.page.getByTestId('ErrorIcon');
    this.fieldErroNotes = this.page.getByTestId('Error Notes-shipment-field');
    this.buttonSaveAndExport = this.page.getByTestId('save-and-export-button');
    this.optionReconcile = this.page.getByTestId('open-reconcile-ap-btn');
    this.tabJobInfo = this.page.getByTestId('job-info-tab');
    this.divJobNotes = this.page
      .locator('//h3[text()="Job Notes"]')
      .locator('..');
    this.jobsMainPage = this.page.getByRole('link', { name: 'Jobs' });
    this.documentTabPanel = this.page.getByRole('tabpanel', {
      name: 'Document',
    });
    this.tabInstructions = this.page.getByRole('tab', { name: 'Instructions' });
    this.tabDocument = this.page.getByRole('tab', { name: 'Document' });
    this.tabJobInformation = this.page.getByTestId('job-info-tab');
    this.tabEDocs = this.page.getByTestId('edocs-tab');
    this.tabTaskInfo = this.page.getByTestId('task-info-tab');
    this.tabEmail = this.page.getByTestId('email-tab');
    this.firstTableRow = this.page.getByRole('row').first();
    this.firstJobRow = this.page.getByRole('row').nth(1);
    this.iconOpenJob = this.firstJobRow.getByTestId('DescriptionIcon').first();
  }

  async fillAndEnter(locator: Locator, text: string) {
    await locator.fill(text);
    await locator.press('Enter');
  }

  async clickOnColumnCard(column: Locator, index: number) {
    await column.locator('> *').nth(index).click();
  }

  async uploadJobFile(filePath: string, fileName: string) {
    await this.buttonUploadDocument.click();
    await this.buttonFileChooser.setInputFiles(path.join(filePath, fileName));
    await this.buttonUpload.click();
  }

  async verifyMetaFields() {
    await this.inputInvoiceNumber.click();
    let count = await this.iconErrorMetaField.count();
    while (count > 0) {
      await this.buttonCheck.click();
      count = await this.iconErrorMetaField.count();
    }
  }

  async deleteTextAreaValue(locator: Locator) {
    await locator.hover();
    await locator.getByTestId('CloseIcon').click();
  }

  async getJobTab(tabName: string) {
    return this.page.getByRole('link', { name: new RegExp(`^${tabName}`) });
  }
}

export class ReconcileModal {
  readonly page: Page;
  readonly buttonReconcile: Locator;
  readonly buttonShowCustomerAP: Locator;
  readonly fieldAssignee: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonReconcile = page.getByTestId('recon-button');
    this.buttonShowCustomerAP = page.getByTestId('show-customer-aprecon');
  }

  async selectAssignee(assignee: string) {
    const fieldAssignee = this.page.getByLabel('Assignee').locator('..');
    const input = fieldAssignee.locator('input');
    const closeIcon = fieldAssignee.getByTestId('CloseIcon');
    await input.scrollIntoViewIfNeeded();
    await input.hover();
    await closeIcon.waitFor({ state: 'visible', timeout: 5000 });
    await closeIcon.click();
    await this.page.getByRole('option', { name: `${assignee}` }).click();
  }

  async selectExternalStatus(status: string) {
    const fieldExternalStatus = this.page
      .getByLabel('External Status')
      .locator('..');
    const input = fieldExternalStatus.locator('input');
    const closeIcon = fieldExternalStatus.getByTestId('CloseIcon');
    await input.hover();
    await closeIcon.waitFor({ state: 'visible', timeout: 5000 });
    await closeIcon.click();
    await this.page.getByRole('option', { name: `${status}` }).click();
  }
}
