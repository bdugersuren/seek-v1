const sharedConfig = require("../../jest.config.js");

module.exports = {
  ...sharedConfig,
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.spec.ts", "<rootDir>/src/**/*.spec.ts"],
};
