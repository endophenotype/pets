/* eslint-disable import/order, @typescript-eslint/no-require-imports, no-undef */
const imported = require('../eslint.config.js')
const baseConfig = Array.isArray(imported) ? imported : imported.default
const pluginJest = require('eslint-plugin-jest')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...baseConfig,
  // Блок для тестовых файлов с jest-правилом (если его нет в корне)
  {
    files: ['**/*.unit.test.ts', '**/*.unit.test.js', '**/*.test.ts', '**/*.test.js'],
    plugins: {
      jest: pluginJest,
    },
    rules: {
      'jest/no-focused-tests': 'error',
    },
  },
  // Блок для jest.config.js без parserOptions.project и с отключением require-импортов (последний, чтобы перекрыть все)
  {
    files: ['**/jest.config.js'],
    languageOptions: {
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Отключаем правило no-empty-object-type для всех файлов webapp (последний блок)
  {
    files: ['**/*'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      'n/no-process-env': 'error',
    },
  },
]
