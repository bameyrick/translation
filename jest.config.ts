import { JestConfigWithTsJest } from 'ts-jest';

const esModules = ['@angular'].join('|');

export default {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  // globalSetup: 'jest-preset-angular/global-setup',
  // transform: {
  //   [`^.+.ts?$`]: ['ts-jest', { useESM: true }],
  // },
  // testEnvironment: 'node',
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
  testTimeout: 20000,
} as JestConfigWithTsJest;
