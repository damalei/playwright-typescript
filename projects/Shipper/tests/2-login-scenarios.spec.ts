import { test, expect } from "@playwright/test";
import { LoginPage } from "../models/login.ts";

const GLOBALTIMEOUT = 60000;
const username = `(${process.env.SHIPPER_VIZ_VALID_USER})`;
const password = `(${process.env.SHIPPER_VIZ_VALID_PASS})`;
const wrongusername = `(${process.env.SHIPPER_VIZ_INVALID_USER})`;
const wrongpassword = `(${process.env.SHIPPER_VIZ_INVALID_PASS})`;

//Test clause for visiting Shipper Page
test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    const log = new LoginPage(page);
    await log.goto();
    await expect
      .soft(log.forgotPwdLink)
      .toBeVisible({ timeout: GLOBALTIMEOUT });
  });

  test("[30.1] Log-in using correct user credentials", async ({ page }) => {
    await page.getByLabel("Email Address").fill(username);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "LOG IN" }).click();
    await expect
      .soft(page.getByTestId("exceptions-management-header"))
      .toBeVisible({ timeout: GLOBALTIMEOUT });
  });

  test("[30.2] Log-in using incorrect username", async ({ page }) => {
    await page.getByLabel("Email Address").fill(wrongusername);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "LOG IN" }).click();
    await expect
      .soft(page.getByText("Wrong email or password"))
      .toBeVisible({ timeout: GLOBALTIMEOUT }); // Error Message
  });

  test("[30.3] Log-in using incorrect password", async ({ page }) => {
    await page.getByLabel("Email Address").fill(username);
    await page.getByLabel("Password").fill(wrongpassword);
    await page.getByRole("button", { name: "LOG IN" }).click();
    await expect
      .soft(page.getByText("Wrong email or password"))
      .toBeVisible({ timeout: GLOBALTIMEOUT }); // Error Message
  });

  test("[30.4] Log-in when username is empty", async ({ page }) => {
    await page.getByLabel("Email Address").fill("");
    await page.getByLabel("Password").fill(password);
    const loginBtn = page.getByRole("button", { name: "LOG IN" });
    await expect.soft(loginBtn).toBeDisabled();
  });

  test("[30.5] Log-in when psw is empty", async ({ page }) => {
    await page.getByLabel("Email Address").fill(username);
    await page.getByLabel("Password").fill("");
    const loginBtn = page.getByRole("button", { name: "LOG IN" });
    await expect.soft(loginBtn).toBeDisabled();
  });

  test("[30.6] Log-in when both username and password is empty", async ({
    page,
  }) => {
    await page.getByLabel("Email Address").fill("");
    await page.getByLabel("Password").fill("");
    const loginBtn = page.getByRole("button", { name: "LOG IN" });
    await expect.soft(loginBtn).toBeDisabled();
  });

  test("[30.7] Forgot password", async ({ page }) => {
    await page.getByRole("link", { name: "Forgot Password" }).click();
    await page.getByLabel("Email Address").fill(username);
    await page.getByRole("button", { name: "SUBMIT" }).click();
    await expect
      .soft(page.getByText("Successfully sent!"))
      .toBeVisible({ timeout: GLOBALTIMEOUT });
  });

  test("[30.8] Log out", async ({ page }) => {
    await page.getByLabel("Email Address").fill(username);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "LOG IN" }).click();
    await expect
      .soft(page.getByTestId("exceptions-management-header"))
      .toBeVisible({ timeout: GLOBALTIMEOUT });
    await expect
      .soft(page.getByTestId("account-menu-trigger-uncollapsed"))
      .toBeVisible({ timeout: GLOBALTIMEOUT }); //log out
    await page
      .getByTestId("account-menu-trigger-uncollapsed")
      .getByText("JM")
      .click();
    await page.getByTestId("logout").click();
    await expect
      .soft(page.getByTestId("login-header"))
      .toBeVisible({ timeout: GLOBALTIMEOUT });
  });
});
