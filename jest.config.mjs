import { transformSync } from '@swc/core';
import fs from 'fs-extra';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const transformFile = (src, filename) => {
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

export default {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^api/(.*)$': '<rootDir>/src/api/$1',
  },
  transform: {
    '^.+\\.tsx?$': (filePath) => {
      const code = fs.readFileSync(filePath, 'utf8');
      const result = transformFile(code, filePath);
      return {
        code: result.code,
        map: result.map,
      };
    },
  },
  testMatch: ['<rootDir>/tests/**/*.+(ts|tsx|js)', '<rootDir>/src/**/*.test.+(ts|tsx|js)'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, 'tsconfig.jest.json'),
    },
  },
};
