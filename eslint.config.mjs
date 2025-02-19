import es from "eslint-plugin-es-x";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import importPlugin from "eslint-plugin-import-x";
import node from "eslint-plugin-n";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import lodash from "eslint-plugin-lodash";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    ignores: ["server/migrations/*.js"],
  },
  js.configs.recommended,
  typescriptEslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettier,
  {
    plugins: {
      es,
      typescriptEslint,
      import: importPlugin,
      node,
      react,
      "react-hooks": reactHooks,
      lodash,
      prettier: prettierPlugin
    },

    languageOptions: {

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        extraFileExtensions: [".json"],
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        createClass: "createReactClass",
        pragma: "React",
        version: "detect",
      },

      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {},
      },
    },

    rules: {
      eqeqeq: "error",
      curly: "error",
      "no-console": "error",
      "arrow-body-style": ["error", "as-needed"],
      "spaced-comment": "error",
      "object-shorthand": "error",
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error",

      "es/no-regexp-lookbehind-assertions": "error",
      "react/self-closing-comp": [
        "error",
        { component: true, html: true },
      ],
      // Добавляем проверки для хуков
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],

      "lodash/import-scope": ["warn", "method"],
      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
      "import-x/newline-after-import": "error",
      "import-x/order": [
        "error",
        {
          alphabetize: { order: "asc" },
          pathGroups: [
            { pattern: "@shared/**", group: "external", position: "after" },
            { pattern: "@server/**", group: "external", position: "after" },
            { pattern: "~/stores{,/**}", group: "external", position: "after" },
            { pattern: "~/models/**", group: "external", position: "after" },
            { pattern: "~/scenes/**", group: "external", position: "after" },
            { pattern: "~/components/**", group: "external", position: "after" },
            { pattern: "~/**", group: "external", position: "after" },
          ],
        },
      ],

      "prettier/prettier": [
        "error",
        { printWidth: 80, trailingComma: "es5" },
      ],
    },
  },
];
