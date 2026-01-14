import type { Config } from "jest";

// Note: Using basic Jest config compatible with Nx
// nextJest requires app/pages directory at project root which conflicts with Nx structure
const config: Config = {
  displayName: "web",
  preset: "../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/apps/web",
  testEnvironment: "jsdom",
  testMatch: [
    "**/specs/**/*.spec.tsx",
    "**/src/**/*.spec.tsx",
    "**/src/**/*.test.tsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
