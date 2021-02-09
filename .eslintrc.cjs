module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'import/extensions': 'off',
    'no-restricted-syntax': 'off'
  }
};
