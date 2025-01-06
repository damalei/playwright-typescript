# QA Automation

Playwright automation script created by Expedock QA to speed up regression testing.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) (which includes npm).
- You have access to the `env` folder from QA peers, which contains the necessary credentials.

## Install and Run

### 1. Get Environment Files

Get a copy of the `env` folder from QA peers. It contains the credentials to be used by the automation code. These files should have the following names:

- `env.staging`
- `env.passive`

**Scope:** Tests are run against `active-staging` (staging) and `passive-production` (passive) only.

### 2. Install Dependencies

Install the necessary npm packages by running:

```sh
npm ci
```

### 3. Set the Environment

Set the environment to run on:

1. Open a PowerShell terminal under the working environment.
2. Run the following command to set the environment:

   - For production passive:

     ```sh
     $env:ENV="passive"
     ```

   - For staging (avoid using staging for now -- WIP):
     ```sh
     $env:ENV="staging"
     ```

3. Run the Tests
   Run the whole test suite in all projects by executing the following command:

   ```sh
   npx playwright test --headed --workers=1
   ```

Note: Parallelizing tests is a work in progress (WIP).
