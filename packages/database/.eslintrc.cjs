module.exports = {
  root: true,
  extends: ['../config/eslint/base.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules/', 'dist/', '.turbo/', 'coverage/', 'src/generated/client/'],
};
