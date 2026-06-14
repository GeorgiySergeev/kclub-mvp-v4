/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: [
    './base.js',
    'next/core-web-vitals',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // TypeScript handles this
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['.next/'],
};
