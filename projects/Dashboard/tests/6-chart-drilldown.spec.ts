// import { test, Page, expect } from '@playwright/test';
// import { TestChartDashboard } from '../models/testChartDashboard';

// const lineChartPointClass= '.visx-group.visx-glyph'
// // const lineChartPointClass= '.visx-group'
// const horizontalBarPointClass= '.visx-bar'
// const verticalBarPointClass= '.visx-bar'
// const multiLineChartPointClass= '.visx-group visx-glyph'
// const nameLineChart = 'Line Chart's

// test.describe('Drilldown on a line chart', () => {
//     test('Click on filter these values', async ({page}) => {
//         const testChartDashboard = new TestChartDashboard(page);
//         await testChartDashboard.goto()D
//         await testChartDashboard.clickFilterByValue(nameLineChart, lineChartPointClass)
//         await expect.soft(page.url).toContain('/business-performance/49cbc763-32fb-4fdb-8da5-5bc889aebb3')
//         })

//     // test('Click on view these Shipments', async ({page}) => {
//     //     const testChartDashboard = new TestChartDashboard(page);
//     //     await testChartDashboard.goto()
//     //     await testChartDashboard.clickViewThisShipment(nameLineChart, lineChartPointClass)
//     //     await expect.soft(page.url).toContain('/explore/shipments')
//     //     })

//     // test('Click on view these Containers', async ({page}) => {
//     //     const testChartDashboard = new TestChartDashboard(page);
//     //     await testChartDashboard.goto()
//     //     await testChartDashboard.clickViewThisContainer(nameLineChart, lineChartPointClass)
//     //     await expect.soft(page.url).toContain('/explore/containers')
//     //     })
    
//     // test('Click on view these Payable Invoices', async ({page}) => {
//     //     const testChartDashboard = new TestChartDashboard(page);
//     //     await testChartDashboard.goto()
//     //     await testChartDashboard.clickViewThisContainer(nameLineChart, lineChartPointClass)
//     //     await expect.soft(page.url).toContain('/explore/payable-invoices')
//     //     })

//     // test('Click on view these Receivable Invoices', async ({page}) => {
//     //     const testChartDashboard = new TestChartDashboard(page);
//     //     await testChartDashboard.goto()
//     //     await testChartDashboard.clickViewThisContainer(nameLineChart, lineChartPointClass)
//     //     await expect.soft(page.url).toContain('/explore/receivable-invoices')
//     //     })
// })
