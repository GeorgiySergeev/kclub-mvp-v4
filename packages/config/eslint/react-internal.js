/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ['./base.js', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // TypeScript handles this
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
