module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier', // Always keep this last
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'playwright'],
  rules: {
    // Add project-specific ESLint rules here
  },
};
