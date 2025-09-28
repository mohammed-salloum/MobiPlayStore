// Import ESLint base config for JavaScript
import js from '@eslint/js'

// Import predefined global variables (like window, document)
import globals from 'globals'

// Import ESLint plugin for React Hooks rules
import reactHooks from 'eslint-plugin-react-hooks'

// Import ESLint plugin for React Fast Refresh (used in development)
import reactRefresh from 'eslint-plugin-react-refresh'

// Export ESLint configuration as an array
export default [
  // Ignore certain folders/files from linting
  { ignores: ['dist'] }, // Skip the 'dist' folder (production build)

  {
    // Apply these rules to all JS and JSX files
    files: ['**/*.{js,jsx}'],

    // Language options for ESLint
    languageOptions: {
      ecmaVersion: 2020,        // Use ECMAScript 2020 syntax
      globals: globals.browser, // Predefined browser globals (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript features
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module',   // Enable ES module syntax (import/export)
      },
    },

    // Plugins to extend ESLint functionality
    plugins: {
      'react-hooks': reactHooks,     // Enforce React Hooks rules
      'react-refresh': reactRefresh, // Enforce rules for React Fast Refresh
    },

    // Rules configuration
    rules: {
      ...js.configs.recommended.rules,         // Include recommended JS rules
      ...reactHooks.configs.recommended.rules, // Include recommended React Hooks rules

      // Error on unused variables, but ignore variables starting with capital letters or underscore
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // Warn if React Refresh is misused, but allow constant exports
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
