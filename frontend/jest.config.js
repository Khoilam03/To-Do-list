// jest.config.js
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx'],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  };
  