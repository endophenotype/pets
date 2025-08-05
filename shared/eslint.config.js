/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const pluginN = require('eslint-plugin-n')
const globals = require('globals')
const tseslint = require('typescript-eslint')

const baseConfig = require('../eslint.config.js')

module.exports = [
  ...(Array.isArray(baseConfig) ? baseConfig : baseConfig.default),
  {
    ignores: ['eslint.config.js'],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
      globals: globals.node,
    },
    plugins: {
      n: pluginN,
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'n/no-process-env': 'error',
    },
  },
]
