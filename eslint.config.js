import js from "@eslint/js";
import globals from "globals";
import pluginImport from "eslint-plugin-import";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,     // allow require, module.exports, etc.
      },
    },
    plugins: {
      import: pluginImport,
      jest: pluginJest,
    },
    rules: {
      ...js.configs.recommended.rules,
      // Optional general rules
      "no-unused-vars": "warn",
      "no-console": "off",
      // Import plugin rules
      "import/prefer-default-export": "off",
    },
  },
  // Jest-specific config
  {
    files: ["**/__tests__/**/*.js", "**/jest-testing/**/*.js"],
    languageOptions: {
      globals: globals.jest,
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      ...pluginJest.configs.recommended.rules,
    },
  },
];