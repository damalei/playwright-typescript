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
  readonly buttonSave: Locator;
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
  readonly inputShipment: Locator;
  readonly inputHbl: Locator;
  readonly inputMbl: Locator;
  readonly inputVoyageNumber: Locator;
  readonly inputContainerNumber: Locator;
  readonly inputVendorShipment: Locator;
  readonly divLineItem: Locator;
  readonly optionBatchReconcile: Locator;
  readonly optionSendToCw: Locator;
  readonly toggleAutoReconAutoPostIfMatch: Locator;

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
    this.buttonSave = this.page.getByRole('button', {
      name: 'Save',
      exact: true,
    });
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
    // this.inputShipment = this.page.locator(
    //   '//input[@aria-label="Reference No"]'
    // );
    this.inputShipment = this.page.getByLabel('Reference No');
    this.inputHbl = this.page.getByLabel('HBL No');
    this.inputMbl = this.page.getByLabel('MBL No');
    this.inputVoyageNumber = this.page.getByLabel('Voyage No.');
    this.inputContainerNumber = this.page.getByLabel('Container Number');
    this.divLineItem = this.page
      .getByRole('combobox', { name: 'Line Items' })
      .locator('ancestor::*[4]');
    this.optionBatchReconcile = this.page.getByText('Batch Reconcile SOA');
    this.optionSendToCw = this.page.getByTestId('open-send-to-cw-btn');
    this.toggleAutoReconAutoPostIfMatch = this.page.locator(
      'input[name="autoReconAutoPostIfMatch"]'
    );
    this.inputVendorShipment = this.page.getByTestId('Vendor-shipment-field');
  }

  async fillAndEnter(locator: Locator, text: string) {
    await locator.fill(text);
    await locator.press('Enter');
  }

  async clickOnColumnCard(column: Locator, index: number) {
    await column.locator('> *').nth(index).click();
  }

  async uploadJobFile(filePath: string, fileName: string, jobType: string) {
    await this.buttonUploadDocument.click();
    await this.buttonFileChooser.setInputFiles(path.join(filePath, fileName));
    if (jobType == 'SOA NYC (Demo)') {
      await this.page.getByTestId('file-upload-select-all').click();
    }
    await this.buttonUpload.click();
  }

  async verifyMetaFields() {
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

  async addMissingAccrualValue() {
    await this.page
      .locator('//*[@data-testid="edit-line-item-table"]')
      .scrollIntoViewIfNeeded();
    await this.page.getByTestId('edit-line-item-table').click();
    const inputcell = this.page.getByTestId('charge-cost-cell').nth(0);
    await inputcell.click();
    await inputcell.pressSequentially('160000');
    await this.page.keyboard.press('Enter');
    await this.page.getByTestId('hide-line-item-table').click();
  }

  async reconcileAndCheckReconciliationResults() {
    await this.buttonSaveAndExport.click();
    await this.optionReconcile.click();
    await this.page.getByTestId('recon-button').click();
  }

  /**
   * Toggle the auto recon auto post if match checkbox if it's currently off
   */
  async enableAutoReconAutoPostIfMatch() {
    const isEnabled = await this.toggleAutoReconAutoPostIfMatch.isChecked();
    if (!isEnabled) {
      await this.toggleAutoReconAutoPostIfMatch.click();
    }
  }
}

export class ReconcileModal {
  readonly page: Page;
  readonly buttonReconcile: Locator;
  readonly buttonShowCustomerAP: Locator;
  readonly fieldAssignee: Locator;
  readonly buttonSaveJobDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonReconcile = page.getByTestId('recon-button');
    this.buttonShowCustomerAP = page.getByTestId('show-customer-aprecon');
    this.buttonSaveJobDetails = page.getByTestId('save-job-details-btn');
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

export class SendToCwModal {
  readonly page: Page;
  readonly modal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page
      .locator('div[role="dialog"]')
      .filter({ hasText: 'Review Data to Send to CW' });
  }
}

export class ExportActionsModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly buttonClose: Locator;
  readonly checkBox_edocPages: Locator;
  readonly checkBox_sendtoCW: Locator;
  readonly checkBox_postToCW: Locator;
  readonly button_goBack: Locator;
  readonly button_showToCustomer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole('dialog').filter({ hasText: 'Export Actions' });
    this.buttonClose = this.modal.getByTestId('close-btn');
    this.checkBox_edocPages = this.modal
      .getByTestId('edoc-pages-checkbox')
      .locator('input');
    this.checkBox_sendtoCW = this.modal
      .getByTestId('send-to-cw-checkbox')
      .locator('input');
    this.checkBox_postToCW = this.modal
      .getByTestId('post-to-cw-checkbox')
      .locator('input');
    this.button_goBack = this.modal.getByText('Go Back');
    this.button_showToCustomer = this.modal.getByTestId(
      'continue-to-customer-btn'
    );
  }
}

export class ShowToCustomerWithActionModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly button_cancel: Locator;
  readonly button_showToCustomer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page
      .getByRole('dialog')
      .filter({ hasText: 'Show to customer with the selected actions?' });
    this.button_cancel = this.modal.getByText('Cancel');
    this.button_showToCustomer = this.modal.getByRole('button', {
      name: 'Show to Customer',
    });
  }
}
