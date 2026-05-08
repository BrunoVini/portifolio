import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';
import globals from 'globals';

const lineCap = {
  'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
};

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'wireframes.html',
      'wireframe-sketch.html',
      '.superpowers/**',
      'docs/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...lineCap,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // TS handles undefined symbols via tsc; no need to duplicate here.
      'no-undef': 'off',
    },
  },
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: lineCap,
  },
];
