module.exports = {
  plugins: ["@typescript-eslint", "unused-imports", "import"],
  parser: '@typescript-eslint/parser',
  extends:  [
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
    "react/prop-types": "warn",
    "import/no-unresolved": "off",
    "react/jsx-uses-vars": "warn",
    "react/no-unknown-property": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "unused-imports/no-unused-imports": "warn"
  },
  settings:  {
    "react": {
      "createClass": "createClass",
      "pragmaFrag": "Fragment"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx", ".js"]
    },
    "import/resolver": {},
    react:  {
      version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
}
