import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import reactRecommended from "eslint-plugin-react/configs/recommended.js"
import reactJSXRuntime from "eslint-plugin-react/configs/jsx-runtime.js"

export default tseslint.config(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  reactRecommended,
  reactJSXRuntime,
  ...tseslint.configs.recommended,
  {
    plugins: { "unused-imports": unusedImports },
    ignores: [
      "eslint.config.mjs",
      "babel.config.js",
      "metro.config.js",
      "scripts/*",
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-extra-parens": ["off"],
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],

      "react/prop-types": ["off"],
      "react/no-multi-comp": ["error"],
      "react/self-closing-comp": ["error"],

      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/unbound-method": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          types: ["function"],
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "memberLike",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
        {
          selector: "import",
          format: [],
        },
      ],

      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
    },
  },
)
