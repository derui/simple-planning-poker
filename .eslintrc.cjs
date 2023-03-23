module.exports = {
  plugins: ["@typescript-eslint", "import", "unused-imports"],
  parser: '@typescript-eslint/parser',
  extends: ["plugin:import/errors", "plugin:import/warnings"],
  env: {
    es6: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',
    // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
    // project: "./tsconfig.json",
  },

  rules: {
    "import/order": "error",
    "func-style": ["error", "expression"],
    "import/no-unresolved": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    // "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "unused-imports/no-unused-imports": "warn"
  },
  settings: {
    "react": {
      "createClass": "createClass",
      "pragmaFrag": "Fragment"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js"]
    },
    "import/resolver": {}
  }
};
