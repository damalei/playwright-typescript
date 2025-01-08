import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { SignUpPage } from '../models/signUp.ts';

let loginPage;
let signUpPage;
let page: Page;

test.describe('User signs-up on ShipperViz', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    await signUpPage.gotoShipperVizSignUp();
  });

  test('[25.1] Request for an account - non-expedock email', async () => {
    await signUpPage.requestShipperVizAccount();
    await signUpPage.loginToDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await signUpPage.checkShipperVizRequestedAccount();
  });

  test('[25.2] User signs up from different paywalls - non-expedock email', async () => {
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.searchShipmentonShipperViz();
    await signUpPage.signUpOnShipperVizPaywalls();
    await signUpPage.gotoDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await signUpPage.checkShipperVizSignUpPaywallAccess();
  });

  test('[25.3] User signs up from different paywalls - approved email', async () => {
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.searchShipmentonShipperViz();
    await signUpPage.signUpOnShipperVizPaywallsWithApprovedEmail();
  });
});
