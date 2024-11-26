# qa-automation

Playwright automation script created by Expedock QA to speed up regression test

## Install and Run

0. Get a copy of the env folder from qa peers.
   It contains the credentials to be used by the automation code.
   Looking into secrets manager :D

Files should have the following names:
a. env.staging
b. env.passive

Scope: tests are run against active-staging (staging) and passive-production (passive) only

1. Set the environment to run on
   a. Open a powershell terminal under the working environment
   b. run $env:ENV="passive"
   c. or run $env:ENV="staging" //avoid using staging for now -- WIP

2. Run the whole test in all projects by running this command
   a. npx playwright test --headed --workers=1 //WIP pararellizing tests
