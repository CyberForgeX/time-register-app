import path from 'path';
import { transformSync } from '@swc/core';
import { server } from './__mocks__/server';
import fs from 'fs-extra';

interface JestSetup {
  beforeAll: () => void;
  afterEach: () => void;
  afterAll: () => void;
  transform: {
    [key: string]: string | ((filePath: string) => { code: string; map: string });
  };
  moduleNameMapper: {
    [key: string]: string;
  };
  testMatch: string[];
  testEnvironment: string;
  bail: boolean;
  collectCoverageFrom: string[];
  testPathIgnorePatterns: string[];
  transformIgnorePatterns: string[];
  watchPlugins: string[];
}

// Function to transform source code using SWC
const transformFile = (src: string, filename: string): { code: string; map: string } => {
  const parserSyntax = filename.endsWith('.ts') || filename.endsWith('.tsx') ? 'typescript' : 'ecmascript';
  const jsc = {
    parser: {
      syntax: parserSyntax,
      jsx: true,
    },
    transform: {
      legacyDecorator: true,
      react: {
        runtime: 'automatic',
        pragma: 'React.createElement',
        pragmaFrag: 'React.Fragment',
      },
    },
  };
  return transformSync(src, { filename, sourceMaps: true, jsc });
};

// Jest configuration object
const jestSetup: JestSetup = {
  beforeAll: (): void => server.listen(),
  afterEach: (): void => server.resetHandlers(),
  afterAll: (): void => server.close(),

  // Use SWC to transform code during Jest tests
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': (filePath: string): { code: string; map: string } => {
      const code = fs.readFileSync(filePath, 'utf8');
      const result = transformFile(code, filePath);
      return {
        code: result.code,
        map: result.map,
      };
    },
  },

  // Mock API responses using Jest's built-in mocking functions
  moduleNameMapper: {
    '^api/(.*)$': '<rootDir>/src/api/$1',
  },

  // Define patterns for Jest to look for when running tests
  testMatch: ['/tests/**/*.+(ts|tsx|js|mjs)', '/**/?(*.)+(spec|test).+(ts|tsx|js|mjs)'],

  // Use JSDOM as the test environment
  testEnvironment: 'jsdom',

  // Define additional Jest configuration options
  bail: true, // Stop running tests after the first failure
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx, mjs}', '!src/**/*.d.ts'], // Collect coverage from all source files except declarations
  testPathIgnorePatterns: ['/node_modules/', '/.next/'], // Ignore test files in node_modules and .next directories
  transformIgnorePatterns: ['/node_modules/'], // Ignore transformation for files in node_modules
  watchPlugins: ['jestPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'], // Use typeahead for improved test selection during watch mode
};

module.exports = jestSetup;