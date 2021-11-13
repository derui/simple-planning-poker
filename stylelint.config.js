
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  plugins: ["stylelint-prettier"],
  rules: {
    "prettier/prettier": true
  },
  ignoreFiles: [
    "src/css/reset.css"
  ]
}
