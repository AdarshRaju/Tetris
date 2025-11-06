export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest-testing/jest.setup.js"],
  moduleNameMapper: {
    "^bootstrap$": "<rootDir>/jest-testing/__mocks__/bootstrap.js",

    "^@functions/(.*)$": "<rootDir>/functions/$1",
  },
};
