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

This will also automatically set up the pre-commit hooks.

### 3. Pre-commit Hooks

This repository uses pre-commit hooks to ensure code quality. They are automatically installed when you run `npm install` or `npm ci`. The hooks will:

1. Format all staged files using Prettier
2. Run Playwright tests only on changed/new test files

This ensures that:

- All committed code follows consistent formatting
- Only working tests are committed
- Test runs are fast since only changed tests are executed

To skip the pre-commit hooks in exceptional cases (not recommended), you can use:

```sh
git commit --no-verify
```

### 4. Set the Environment

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

### 5. Run the Tests

Run the whole test suite in all projects by executing the following command:

```sh
npx playwright test --headed --workers=1
```

Note: Parallelizing tests is a work in progress (WIP).
