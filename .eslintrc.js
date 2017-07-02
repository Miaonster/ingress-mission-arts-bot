module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "comma-dangle": ["error", "always-multiline"],
  },
  globals: {
    "_hmt": true,
    "describe": true,
    "it": true,
    "before": true,
  }
}
