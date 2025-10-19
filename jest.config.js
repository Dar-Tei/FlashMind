export default {
    testEnvironment: 'jsdom',
    transform: {},
    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
      'js/**/*.js',
      '!js/main.js',
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/',
    ],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
  };