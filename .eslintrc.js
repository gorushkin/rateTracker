module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', '@stylistic/ts'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'no-console': ['warn', { allow: ['error'] }],
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
        multilineDetection: 'brackets',
      },
    ],
  },
};
