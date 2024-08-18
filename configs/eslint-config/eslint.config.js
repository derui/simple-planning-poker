import react from 'eslint-plugin-react';
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from 'typescript-eslint';

export default [
    ...tseslint.configs.recommended,
    {
        files:  ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
            react,
            "unused-imports": unusedImports
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true // Allows for the parsing of JSX
                }
            },
            globals: {
                ...globals.browser,
            },
        },

        rules: {
            "func-style": ["error", "expression"],
            "unused-imports/no-unused-imports": "warn"
        },
     }
];
