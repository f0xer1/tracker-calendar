// @ts-check
const eslint = require("@eslint/js");
const pluginSimpleImportSort = require("eslint-plugin-simple-import-sort");
const testsLint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = testsLint.config(
  {
    plugins: {
      "simple-import-sort" :  pluginSimpleImportSort
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    },},
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...testsLint.configs.recommended,
      ...testsLint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
