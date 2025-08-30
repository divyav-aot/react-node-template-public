import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import vitest from "eslint-plugin-vitest";
import chaiFriendly from "eslint-plugin-chai-friendly";
import prettier from "eslint-plugin-prettier";
import typescript from "@typescript-eslint/eslint-plugin";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      vitest,
      "chai-friendly": chaiFriendly,
      prettier,
      "@typescript-eslint": typescript,
    }, // Add Vitest plugin
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "chai-friendly/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prettier/prettier": [
        "error",
        {
          trailingComma: "es5",
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
    },
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**"],
    // env: {
    //   "vitest-globals/env": true, // Enable Vitest globals
    // },
  },
]);
