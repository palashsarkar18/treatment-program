import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',  // Ensure this is set or default
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  // Add setupFilesAfterEnv to include jest.setup.ts
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'] // Adjust the path as necessary
};

export default config;