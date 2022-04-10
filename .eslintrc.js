module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "no-extra-parens": [
            "error",
            "all",
            { ignoreJSX: "single-line", returnAssign: false },
        ],
        indent: ["error", 4],
        "linebreak-style": ["error", "unix", "windows"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
    },
}
