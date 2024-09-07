import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    ignores: ["**/*.js", "setupTests.ts"],
    plugins: {
      react,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Allows for the parsing of JSX
        },
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },

    rules: {
      "func-style": ["error", "expression"],
      "unused-imports/no-unused-imports": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
];
