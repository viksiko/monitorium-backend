// eslint.config.js
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'eslint.config.js'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
);