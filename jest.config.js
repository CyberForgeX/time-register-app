module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};