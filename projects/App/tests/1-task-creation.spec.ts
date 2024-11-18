import { test, expect } from "@playwright/test";
import { setGlobalData } from "../../utils";
import { serialnum } from "../../constants";
import { APP_BASE_URL } from "../../constants";

const GLOBALTIMEOUT = 60000;

test.describe.configure({ mode: "serial" });

test("create a task", async ({ page }) => {
  await page.goto(APP_BASE_URL);
  await page.getByText("+ Create Task").click();
  //insert function test unique serial number
  await page.getByTestId("task-name-textfield").fill(serialnum);
  await page
    .getByTestId("task-message")
    .locator("textarea")
    .fill(serialnum + " message");
  await page.getByTestId("task-reference-textfield").fill(serialnum);
  await page.locator("#company-select").click();
  await page.locator("#menu-").getByTestId("AP Invoice (Demo)").click();
  await page.getByTestId("create-task-button").click();
  await expect(page.locator("#task-details-title")).not.toBeVisible({
    timeout: GLOBALTIMEOUT,
  });
});

test("search and open new task as a page", async ({ page }) => {
  await page.goto(APP_BASE_URL);
  await page.getByTestId("task-search-bar").locator("input").fill(serialnum);
  await page.getByTestId("task-search-bar").press("Enter");
  await page
    .getByTestId("task-card-" + serialnum)
    .click({ timeout: GLOBALTIMEOUT });
  await page.getByText("Open as page").click();
  await expect
    .soft(page.locator("[name='taskReferenceId']"))
    .toBeVisible({ timeout: 3 * GLOBALTIMEOUT });
  await expect
    .soft(page.locator("[name='taskReferenceId']"))
    .toHaveValue(serialnum);
  await setGlobalData(page.url());
});
