/* eslint-disable import/order, @typescript-eslint/no-require-imports, no-undef */
const imported = require('../eslint.config.js')
const baseConfig = Array.isArray(imported) ? imported : imported.default

function isReactConfig(config) {
  if (!config || typeof config !== 'object') {
    return false
  }
  if (config.plugins && Object.keys(config.plugins).some((p) => p === 'react' || p.includes('react'))) {
    return true
  }
  if (
    config.extends &&
    ((Array.isArray(config.extends) && config.extends.some((e) => typeof e === 'string' && e.includes('react'))) ||
      (typeof config.extends === 'string' && config.extends.includes('react')))
  ) {
    return true
  }
  if (config.settings && config.settings.react) {
    return true
  }
  if (config.rules && Object.keys(config.rules).some((r) => r.startsWith('react/'))) {
    return true
  }
  return false
}

// Импортируем необходимые плагины для backend
const pluginImport = require('eslint-plugin-import')
const pluginN = require('eslint-plugin-n')
const prettierPlugin = require('eslint-plugin-prettier')
const pluginJest = require('eslint-plugin-jest')
const tseslint = require('typescript-eslint')

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ['**/*'],
    rules: {
      'n/no-process-env': 'off',
    },
  },
  // Явно подключаем нужные плагины и правила для backend в одном объекте
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettierPlugin,
      import: pluginImport,
      n: pluginN,
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'n/no-process-env': 'off',
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: './env*',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: './*/env*',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: './**/env*',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '../*/env*',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '../**/env*',
              group: 'builtin',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  // Запрет на импорт из test-директории вне integration-тестов
  {
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/**/!(*.integration.test.ts)',
              from: './src/test',
              message: 'Import something from test dir only inside integration tests',
            },
          ],
        },
      ],
    },
  },
  // Блок для тестовых файлов с jest-правилом
  {
    files: ['**/*.unit.test.ts', '**/*.unit.test.js', '**/*.test.ts', '**/*.test.js'],
    plugins: {
      jest: pluginJest,
    },
    rules: {
      'jest/no-focused-tests': 'error',
    },
  },
  // Блок для конфигов без parserOptions.project (маска для всех подпапок)
  {
    files: ['**/*.config.js', '**/jest.config.js'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // не указываем project
      },
    },
  },
  ...baseConfig.filter((cfg) => !isReactConfig(cfg) && !cfg.plugins && !cfg.rules),
  // Блок для .ts файлов с parserOptions.project
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        sourceType: 'script',
      },
    },
  },
  // Блок для .js файлов без parserOptions.project
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'script',
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'n/no-process-env': 'off',
    },
  },
].map((cfg) => {
  if (cfg && cfg.settings && cfg.settings.react) {
    delete cfg.settings.react
  }
  return cfg
})
