import { test, Page, expect } from '@playwright/test';
import { Dashboards } from '../models/dashboards';
import * as charts from '../fixtures/chartlist'
import { DEFAULT_TIMEOUT_IN_MS } from '../../constants';
import { logInAuth } from '../../utils';



test.describe.configure({
    mode: 'serial',
    timeout:  DEFAULT_TIMEOUT_IN_MS,
  })

test.describe('User downloads charts from Business Performance', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_JIG_USER}`,
      `${process.env.FREIGHT_BI_JIG_PASS}`
    );
    const dashboards = new Dashboards(page)
    await dashboards.goto()
    // const dashboardList = await dashboards.getDashboards(page)
  });

    test('Overview', async () => {
        test.setTimeout(600_000)
        const dashboards = new Dashboards(page)
        const section = "BusinessPerformance_"
        await dashboards.acc_businessPerformance.click()
        const dashboardList = await dashboards.getDashboards(page)
        await dashboards.downloadByDashboard(dashboardList, section)
        // await dashboards.page.getByTestId('sidebar-tab-wrapper-BUSINESS_PERFORMANCE').getByRole('link', { name: 'Overview*' }).click()

        // for (const chart of charts.bp_overview) {
        //     await dashboards.exportChart(chart, 'Business_', 'Overview___')
        // }
        // await browser.close()
    })

    test('Overview*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Overview*' , exact: true }).click()
        
        for (const chart of charts.bp_overview_ast) {
            await dashboards.exportChart(chart, 'Business_', 'Overview-ast___')
        }
    })

    test('Declaration Reports', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Declaration Reports' }).click()
        
        for (const chart of charts.bp_declarationReports) {
            await dashboards.exportChart(chart, 'Business_', 'DeclarationReports___')
        }
    })

    test('Revenue Overview*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Revenue Overview*' }).click()
        
        for (const chart of charts.bp_revenueOverview_ast) {
            await dashboards.exportChart(chart, 'Business_', 'RevenueOverview-ast___')
        }
    })

    test('Shipment Reports*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Shipment Reports' }).click()
        
        for (const chart of charts.bp_shipmentReports) {
            await dashboards.exportChart(chart, 'Business_', 'ShipmentReports___')
        }
    })

    test('Gross Profit (Margins)', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Gross Profit (Margins)' }).click()
        
        for (const chart of charts.bp_grossProfitMarginsOverview) {
            await dashboards.exportChart(chart, 'Business_', 'Gross Profit (Margins)___')
        }
    })

    test('Agent Report', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Agent Report' }).click()
        
        for (const chart of charts.bp_agentReport) {
          await dashboards.exportChart(chart, 'Business_', 'AgentReport___')
        }
    })

    test('Expenses Overview*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Expenses Overview*' }).click()
        
        for (const chart of charts.bp_expensesOverview_ast) {
          await dashboards.exportChart(chart, 'Business_', 'ExpensesOverview-ast___')
        }
    })

    test('Branch Overview*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Branch Overview*' }).click()
        
        for (const chart of charts.bp_branchOverview_ast) {
          await dashboards.exportChart(chart, 'Business_', 'BranchOverview___')
        }
    })

    test('Carrier Reports*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Carrier Reports*' }).click()
        
        for (const chart of charts.bp_carrierReports_ast) {
          await dashboards.exportChart(chart, 'Business_', 'CarrierReports-ast___')
        }
    })

    test('Carrier and Route Cost)', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Carrier and Route Cost' }).click()
        
        for (const chart of charts.bp_carrierAndRouteCostOpti) {
          await dashboards.exportChartExact(chart, 'Business_', 'CarrierandRouteCost___')
        }
    })
    
    test('Detention & Demurrage', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_businessPerformance.click()
        await dashboards.page.getByRole('link', { name: 'Detention & Demurrage' }).click()
        
        for (const chart of charts.bp_dententionAndDemurrage) {
          await dashboards.exportChart(chart, 'Business_', 'DetentionAndDemurrage___')
        }
    })
})

test.describe('User downloads charts from Operations', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_JIG_USER}`,
      `${process.env.FREIGHT_BI_JIG_PASS}`
    );
    const dashboards = new Dashboards(page)
    await dashboards.goto()
  });

    test('Route Performance', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Route Performance' }).click()
        
        for (const chart of charts.op_routePerformance) {
          await dashboards.exportChartExact(chart, 'Operations_', 'RoutePerformance___')
        }
    })

    test('Shipment Volume', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Shipment Volume' }).click()
        
        for (const chart of charts.op_shipmentVolume_ast) {
          await dashboards.exportChart(chart, 'Operations_', 'ShipmentVolume-ast___')
        }
    })
    
    test('Milestone Tracker', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Milestone Tracker' }).click()
        
        for (const chart of charts.op_milestoneTracker) {
          await dashboards.exportChart(chart, 'Operations_', 'MilestoneTracker___')
        }
    })

    test('Operations Staffing Reports', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Operations Staffing Reports' }).click()
        
        for (const chart of charts.op_operationsStaffingReports) {
          await dashboards.exportChart(chart, 'Operations_', 'OperationsStaffingReports___')
        }
    })

    test('Shipments Departing This Month', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Shipments Departing This Month' }).click()
        
        for (const chart of charts.op_shipmentsDepartingThisMonth) {
          await dashboards.exportChartExact(chart, 'Operations_', 'ShipmentsDepartingThisMonth___')
        }
    })

    test('Shipments Arriving This Month', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Shipments Arriving This Month' }).click()
        
        for (const chart of charts.op_shipmentsArrivingThisMonth) {
          await dashboards.exportChartExact(chart, 'Operations_', 'ShipmentsArrivingThisMonth___')
        }
    })

     test('Importer Report', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Importer Report' }).click()
        
        for (const chart of charts.op_importerReport) {
          await dashboards.exportChart(chart, 'Operations_', 'ImporterReport___')
        }
    })

     test('Operational KPIs', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Operational KPIs' }).click()
        
        for (const chart of charts.op_operationalKpis) {
          await dashboards.exportChartExact(chart, 'Operations_', 'OperationalKPIs___')
        }
    })

    test('Operator Efficiency', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_operations.click()
        await dashboards.page.getByRole('link', { name: 'Operator Efficiency' }).click()
        
        for (const chart of charts.op_operatorEfficiency) {
          await dashboards.exportChartExact(chart, 'Operations_', 'OperatorEfficiency___')
        }
    })
})

test.describe('User downloads charts from Accounting', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_JIG_USER}`,
      `${process.env.FREIGHT_BI_JIG_PASS}`
    );
    const dashboards = new Dashboards(page)
    await dashboards.goto()
  });

    test('Payable Overview', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_accounting.click()
        await dashboards.page.getByRole('link', { name: 'Payables Overview' }).click()
        
        for (const chart of charts.ac_payableOverview) {
          await dashboards.exportChart(chart, 'Accounting_', 'PayablesOverview___')
        }
    })

    test('Receivables Overview', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_accounting.click()
        await dashboards.page.getByRole('link', { name: 'Receivables Overview' }).click()
        
        for (const chart of charts.ac_receivableOverview) {
          await dashboards.exportChart(chart, 'Accounting_', 'ReceivablesOverview___')
        }
    })

    test('Billing Overview', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_accounting.click()
        await dashboards.page.getByRole('link', { name: 'Billing Speed Overview' }).click()
        
        for (const chart of charts.ac_billingSpeedOverview) {
          await dashboards.exportChart(chart, 'Accounting_', 'BillingSpeedOverview___')
        }
    })
})

test.describe('User downloads charts from Sales', () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await logInAuth(
      page,
      `${process.env.FREIGHT_BI_JIG_USER}`,
      `${process.env.FREIGHT_BI_JIG_PASS}`
    );
    const dashboards = new Dashboards(page)
    await dashboards.goto()
  });

    test('Sales Overview*', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_sales.click()
        const dashboardList = await dashboards.getDashboards(page)
        await dashboards.page.getByRole('link', { name: 'Sales Overview*' }).click()
        
        for (const chart of charts.sa_salesOverview_ast) {
          await dashboards.exportChart(chart, 'Sales_', 'SalesOverview-ast___')
        }
    })

    test('Sales Staffing Reports', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_sales.click()
        await dashboards.page.getByRole('link', { name: 'Sales Staffing Reports' }).click()
        
        for (const chart of charts.sa_salesStaffingReports) {
          await dashboards.exportChart(chart, 'Sales_', 'SalesOverview-ast___')
        }
    })

    test('Sales Targets Beta', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_sales.click()
        await dashboards.page.getByRole('link', { name: 'Sales Targets [BETA]' }).click()
        
        for (const chart of charts.sa_salesTargetBeta) {
          await dashboards.exportChart(chart, 'Sales_', 'SalesTargetBeta___')
        }
    })

    test('Risky Accounts', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_sales.click()
        await dashboards.page.getByRole('link', { name: 'Risky Accounts: Revenue &' }).click()
        
        for (const chart of charts.sa_riskyAccountsRevenueAndVolume) {
          await dashboards.exportChart(chart, 'Sales_', 'RiskyAccounts___')
        }
    })

    test('Dormant Accounts', async () => {
        const dashboards = new Dashboards(page)
        await dashboards.goto()
        await dashboards.acc_sales.click()
        await dashboards.page.getByRole('link', { name: 'Dormant Accounts Report [V4]' }).click()
        
        for (const chart of charts.sa_dormantAccountReportV4) {
            await dashboards.exportChart(chart, 'Sales_', 'DormantAccountsReportV4___')
        }
    })
})