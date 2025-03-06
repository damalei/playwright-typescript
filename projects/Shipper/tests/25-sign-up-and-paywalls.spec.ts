import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../models/login.ts';
import { SignUpPage } from '../models/signUp.ts';
import { getFormattedDateTime, removeSpacesAndColons } from '../../utils';

let loginPage;
let signUpPage;
let page: Page;
let emailNonExpedock;
let emailPayNonExpedock;
let dateNow;
let cleanDateNow;

test.describe.serial('User signs-up on ShipperViz', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    signUpPage = new SignUpPage(page);
    await signUpPage.gotoShipperVizSignUp();
    dateNow = getFormattedDateTime().replace(' ', '');
    cleanDateNow = removeSpacesAndColons(dateNow);
  });

  test('[25.1] Request for an account - non-expedock email', async () => {
    emailNonExpedock = `regtestautomation_tester_${cleanDateNow}@tester.com`;
    await signUpPage.setGlobalShipperEmail(emailNonExpedock);
    await signUpPage.requestShipperVizAccount(emailNonExpedock);
    await signUpPage.loginToDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await signUpPage.checkShipperVizRequestedAccount(emailNonExpedock);
  });

  test('[25.2] User signs up from different paywalls - non-expedock email', async () => {
    emailPayNonExpedock = `regtestautomation_tester_${cleanDateNow}_paywall@tester.com`;
    await signUpPage.setGlobalShipperMultPayEmail(emailPayNonExpedock);
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.searchShipmentonShipperViz();
    await signUpPage.signUpOnShipperVizPaywalls(emailPayNonExpedock);
    await signUpPage.gotoDashboard();
    await signUpPage.gotoDashboardUserPortalManagement();
    await signUpPage.checkShipperVizSignUpPaywallAccess(emailPayNonExpedock);
  });

  test('[25.3] User signs up from different paywalls - approved email', async () => {
    await signUpPage.gotoShipperVizSignUp();
    await signUpPage.searchShipmentonShipperViz();
    await signUpPage.signUpOnShipperVizPaywallsWithApprovedEmail();
  });
});
