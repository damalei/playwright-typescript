import { Locator, Page } from "@playwright/test";
import { FREIGHT_BI_BASE_URL } from '../../constants';
import { waitForChartPageLoad, waitForFilterSectionToLoad } from "../../utils";

const GLOBALTIMEOUT = 60000;
const DEFAULT_GLOBAL_TIMEOUT_MS = GLOBALTIMEOUT;

export class TestChartDashboard {
  readonly page: Page;
  readonly filterByThisValue: Locator;
  readonly viewThisShipment: Locator;
  readonly viewThisContainer: Locator;
  readonly viewThisPayableInvoice: Locator;
  readonly viewThisReceivableInvoice: Locator;
  readonly viewThisAccount: Locator;
  readonly viewThisCreditor: Locator;
  readonly viewThisDebtor: Locator;

  constructor(page: Page) {
    this.page = page;
    this.filterByThisValue = this.page.getByTestId('context-menu-filter-values')
    this.viewThisShipment = this.page.getByTestId('context-menu-view-shipments')
    this.viewThisContainer = this.page.getByTestId('context-menu-view-containers')
    this.viewThisPayableInvoice = this.page.getByTestId('context-menu-view-payables')
    this.viewThisReceivableInvoice = this.page.getByTestId('context-menu-view-receivables') 
    this.viewThisAccount= this.page.getByTestId('context-menu-view-accounts')
    this.viewThisCreditor = this.page.getByTestId('context-menu-view-creditors')
    this.viewThisDebtor= this.page.getByTestId('context-menu-view-debtors')
  }

  async goto() {
    await this.page.goto(FREIGHT_BI_BASE_URL + '/business-performance/49cbc763-32fb-4fdb-8da5-5bc889aebb36');
    await waitForFilterSectionToLoad(this.page, DEFAULT_GLOBAL_TIMEOUT_MS);
    await waitForChartPageLoad(
        this.page,
        DEFAULT_GLOBAL_TIMEOUT_MS,
        "data-component-Line Chart"
      );
  }

  async clickFilterByValue(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.scrollIntoViewIfNeeded()
    await chart.click()
    await chart.locator(pointClass).nth(1).click({ button: 'right' })
    await this.filterByThisValue.click()
  }

  async clickViewThisShipment(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisShipment.click()
  }

  async clickViewThisContainer(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisContainer.click()
  }

  async clickViewThisPayableInvoice(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisPayableInvoice.click()
  }

  async clickViewThisReceivableInvoice(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisReceivableInvoice.click()
  }

  async clickViewThisAccount(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisAccount.click()
  }  

  async clickViewThisCreditor(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisCreditor.click()
  }  

  async clickViewThisDebtor(chartName: string, pointClass: string) {
    const chart = this.page.getByTestId(`data-component-${chartName}`)
    await chart.locator(pointClass).first().click({ button: 'right' })
    await this.viewThisDebtor.click()
  }  
}
