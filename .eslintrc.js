/* eslint-disable indent, no-undef */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-undef
module.exports = {
    settings: {
        react: {
            version: "detect",
        },
    },
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "no-extra-parens": ["off"],
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "react/prop-types": ["off"],
        indent: ["off"],
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
                selector: "typeLike",
                format: ["PascalCase"],
            },
        ],
        "@typescript-eslint/restrict-plus-operands": "off",
    },
}
