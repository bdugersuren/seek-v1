module.exports = {
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: ".",
  testMatch: ["**/*.spec.tsx", "**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  passWithNoTests: true,
};
