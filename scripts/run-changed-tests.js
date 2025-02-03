const { execSync } = require('child_process');
const path = require('path');

try {
  // Get staged files
  const stagedFiles = execSync(
    'git diff --cached --name-only --diff-filter=ACMR'
  )
    .toString()
    .trim()
    .split('\n')
    .filter((file) => file.endsWith('.spec.ts'));

  if (stagedFiles.length === 0) {
    console.log('No test files were changed.');
    process.exit(0);
  }

  // Convert file paths to test file patterns that Playwright can understand
  const testPatterns = stagedFiles
    .map((file) => path.relative(process.cwd(), file))
    .join(' ');

  // Run Playwright tests only on changed files
  console.log(`Running tests for changed files: ${testPatterns}`);
  execSync(`npx playwright test ${testPatterns}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running tests:', error);
  process.exit(1);
}
