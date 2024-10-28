import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import root from "../eslint.config.mjs";

export default [
  root,
  react.configs.recommended,
  reactHooks.configs.recommended,
  {
    plugins: {
      reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
      },
    },
  },
];
