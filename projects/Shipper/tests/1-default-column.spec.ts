import { test, Page, expect } from '@playwright/test';

const GLOBALTIMEOUT = 60000;
test.describe.configure({ mode: 'serial' });

const shipColumns: string[] = [
  'Forwarder Reference',
  'Order Refs',
  'House Bill',
  'Booking Reference',
  'Transport Mode',
  'Pickup Location',
  'Delivery Location',
  'First Origin',
  'First Origin ETD (GMT+08:00)',
  'First Origin ATD (GMT+08:00)',
  'Origin Port',
  'Origin Port ETA (GMT+08:00)',
  'Origin Port ATA (GMT+08:00)',
  'Origin Port ETD (GMT+08:00)',
  'Origin Port ATD (GMT+08:00)',
  'Discharge Port',
  'Discharge Port ETA (GMT+08:00)',
  'Discharge Port ATA (GMT+08:00)',
  'Discharge Port ETD (GMT+08:00)',
  'Discharge Port ATD (GMT+08:00)',
  'Final Destination',
  'Final Destination ETA (GMT+08:00)',
  'Final Destination ATA (GMT+08:00)',
  'Shipment Weight (KG)',
  'Shipment Volume (M³)',
  'Shipment Teus',
];

const contColumns: string[] = [
  'Container',
  'Shipment Forwarder Reference',
  'Shipment Order Refs',
  'Container Shipment Goods Description',
  'Container Latest Tracked Event',
  'Latest Tracked Event Time (GMT+08:00)',
  'Shipment Delivery Location',
  'Container Estimated Delivery Date (GMT+08:00)',
  'Container Actual Delivery Date (GMT+08:00)',
  'Shipment Pickup Location',
  'Container Estimated Pickup Date (GMT+08:00)',
  'Container Actual Pickup Date (GMT+08:00)',
  'Shipment Final Destination Port',
  'Shipment Final Destination ETA (GMT+08:00)',
  'Shipment Final Destination ATA (GMT+08:00)',
  'Shipment First Origin Port',
  'Shipment First Origin ETD (GMT+08:00)',
  'Shipment First Origin ATD (GMT+08:00)',
  'Container Gross Weight (KG)',
  'Goods Weight of Container-Shipment Pair (KG)',
  'Goods Volume of Container-Shipment Pair (M3)',
  'Container TEUs',
  'Container Mode',
  'Container Count & Type',
  'Shipment Carrier',
  'Shipment Shipper',
  'Shipment Consignee',
];

test.describe('Default Column check on Shipper', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto(
      `https://dashdemo.${process.env.ENV}-portal.expedock.com/login`
    );
    await page
      .getByLabel('Email Address')
      .fill(`${process.env.SHIPPER_VIZ_CLIENT_USER}`);
    await page
      .getByLabel('Password')
      .fill(`${process.env.SHIPPER_VIZ_CLIENT_PASS}`);
    await page.getByRole('button', { name: 'LOG IN' }).click();
    await page.waitForURL('https://dashdemo.passive-portal.expedock.com/login');
    await expect(page.getByTestId('exceptions-management-header')).toBeVisible({
      timeout: GLOBALTIMEOUT,
    });
  });

  test('Shipments page', async () => {
    test.slow;
    await page.getByText('Shipments', { exact: true }).click();
    for (const column of shipColumns) {
      await expect
        .soft(page.getByRole('columnheader', { name: column, exact: true }))
        .toBeVisible();
    }
  });

  test('Containers page', async () => {
    test.slow;
    await page.getByText('Containers', { exact: true }).click();
    for (const column of contColumns) {
      await expect
        .soft(page.getByRole('columnheader', { name: column, exact: true }))
        .toBeVisible();
    }
  });
});
