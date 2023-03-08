module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__tests__/mocks/serverHandlers.mjs",
  },
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  testPathIgnorePatterns: ["/node_modules/", "/tests/mocks/"],
};