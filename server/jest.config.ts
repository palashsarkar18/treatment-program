import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'], // Adjust if your tests are in a different directory
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json' // Ensure this path points to your server's tsconfig file
    }
  },
};

export default config;