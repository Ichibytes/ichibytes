const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, "src/**/*.{js,ts,jsx,tsx,mdx}"),
    join(__dirname, ".storybook/**/*.{js,ts,jsx,tsx,mdx}"),
    ...(createGlobPatternsForDependencies(__dirname) || []),
  ].filter(Boolean),
  // Theme is now defined in CSS using @theme directive
  // Dark mode using class strategy for Storybook integration
  darkMode: "class",
  plugins: [],
};
