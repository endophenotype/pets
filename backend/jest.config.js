/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...require('../jest.config.js'),
  // Позволяет запускать тесты по относительному пути и через шаблон
  testMatch: ["**/*.unit.test.ts", "**/*.test.ts", "**/*.spec.ts"],
}