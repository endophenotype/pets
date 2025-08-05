// eslint.config.js — CommonJS, рабочий flat config + поддержка jest

const pluginJs = require('@eslint/js')
const eslintConfigPrettier = require('eslint-config-prettier')
const pluginImport = require('eslint-plugin-import')
const pluginN = require('eslint-plugin-n')
const prettierPlugin = require('eslint-plugin-prettier')
const eslintReact = require('eslint-plugin-react')
const pluginReact = require('eslint-plugin-react')
const pluginJest = require('eslint-plugin-jest')
const globals = require('globals')
const tseslint = require('typescript-eslint')
// const pluginJsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'coverage', 'eslint.config.js', '**/dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    rules: {
      'n/no-process-env': 'error',
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: eslintReact,
      // 'react-hooks': eslintReactHooks,
      // 'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
      import: pluginImport,
      n: pluginN,
    },
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
      ...prettierPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'no-new': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
    },
  },
  // Запрет на import.meta.env во всех TypeScript-файлах с кастомным сообщением
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: '[object.type=MetaProperty][property.name=env]',
          message: 'Use instead import { env } from "lib/env"',
        },
      ],
    },
  },
  // Явное применение jest-правил только к тестовым файлам
  {
    files: ['**/*.unit.test.ts', '**/*.unit.test.js', '**/*.test.ts', '**/*.test.js'],
    plugins: {
      jest: pluginJest,
    },
    rules: {
      'jest/no-focused-tests': 'error',
    },
  },
  // Игнорировать все *.config.js файлы во всех подпапках
  {
    ignores: ['**/*.config.js'],
  },
]
