import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/client.json";
const GLOBALTIMEOUT = 60000;

setup("authenticate", async ({ page }) => {
  await page.goto(`https://${process.env.ENV}-dashboard.expedock.com/`);
  await page.locator("#username").fill(`${process.env.FREIGHT_BI_CLIENT_USER}`);
  await page.locator("#password").fill(`${process.env.FREIGHT_BI_CLIENT_PASS}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForURL("https://passive-dashboard.expedock.com/**/");
  await expect(page.getByTestId("account-user-name")).toBeVisible({
    timeout: GLOBALTIMEOUT,
  });
  await page.context().storageState({ path: authFile });
});
