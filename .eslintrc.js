module.exports = {
  plugins: ["@typescript-eslint"],
  parser: '@typescript-eslint/parser',
  extends:  [
    'plugin:prettier/recommended',
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  env: {
    es6: true,
    browser: true,
  },
  parserOptions:  {
    ecmaVersion:  2020,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    ecmaFeatures:  {
      jsx: true,  // Allows for the parsing of JSX
    },
    project: "./tsconfig.json",
  },
  rules: {
    "func-style": ["error", "expression", {allowArrowFunctions: true}],
    "react/prop-types": "off",
    "import/no-unresolved": "off",
    "react/jsx-uses-vars": "warn",
    "react/jsx-in-jsx-scope": "off",
    "react/no-unknown-property": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "prettier/prettier": ['error'],
  },
  settings:  {
    "react": {
      "createClass": "createClass",
      "pragmaFrag": "Fragment"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        extensions:  [".ts", ".tsx"]
      }
    },
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
