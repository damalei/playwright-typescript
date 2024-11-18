import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/app-operator.json";
const GLOBALTIMEOUT = 60000;

setup("authenticate", async ({ page }) => {
  await page.goto(`https://${process.env.ENV}-app.expedock.com/`);
  await page.locator("#username").fill(`${process.env.APP_CLIENT_USER}`);
  await page.locator("#password").fill(`${process.env.APP_CLIENT_PASS}`);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.waitForURL("https://passive-app.expedock.com/");
  await expect(page.getByRole("button", { name: "+ Create Task" })).toBeVisible(
    { timeout: GLOBALTIMEOUT }
  );
  await page.context().storageState({ path: authFile });
});
