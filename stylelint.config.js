
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  plugins: ["stylelint-prettier"],
  rules: {
    "prettier/prettier": true,
    "selector-class-pattern": ".+"
  },
  ignoreFiles: [
    "src/css/reset.css"
  ]
}
