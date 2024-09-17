import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 5 * 60 * 1000,
  testDir: './projects',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'on',
  },

  /* Configure projects for major browsers */
  projects: [
      {
      name: 'app-setup',
      testDir: './projects/App/tests',
      // testMatch: '/.auth\.setup\.ts/',
      testMatch: /App\/tests\/auth[.]setup[.]ts/,
      },

      {
      name: 'app-main-tests',
      testDir: './projects/App/tests',
      // testtestMatch: './App/*.spec.ts',
      testMatch: /.*.spec.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/app-operator.json',
        viewport: {
          width: 1920,
          height: 1080,
        },
      },
      dependencies: ['app-setup'],
      },

      {
        name: 'dashboard-setup',
        testDir: './projects/Dashboard/tests',
        testMatch: /Dashboard\/tests\/auth[.]setup[.]ts/,
      },

      {
        name: 'dashboard-main-tests',
        testDir: './projects/Dashboard/tests',
        // testtestMatch: './App/*.spec.ts',
        testMatch: /.*.spec.ts/,
        use: {
          ...devices['Desktop Chrome'],
          storageState: 'playwright/.auth/client.json',
          viewport: {
            width: 1920,
            height: 1080,
          },
        },
        dependencies: ['dashboard-setup'],
      },

      {
        name: 'shipper-setup',
        testDir: './projects/Shipper/tests',
        testMatch: /Shipper\/tests\/auth[.]setup[.]ts/,
      },

      {
        name: 'shipper-main-tests',
        testDir: './projects/Shipper/tests',
        testMatch: /.*.spec.ts/,
        use: {
          ...devices['Desktop Chrome'],
          storageState: 'playwright/.auth/shipper-client.json',
          viewport: {
            width: 1920,
            height: 1080,
          },
        },
        dependencies: ['shipper-setup'],
      },


    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  outputDir: 'test-ouput/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
