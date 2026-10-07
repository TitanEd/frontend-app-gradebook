// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint', {
  rules: {
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-self-import': 'off',
    'spaced-comment': ['error', 'always', { block: { exceptions: ['*'] } }],

    // TOD: Remove this rule once we have a better way to handle this.
    'import/no-import-module-exports': 'off',
    'no-import-assign': 'off',
    'default-param-last': 'off',
    'no-unused-vars': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/button-has-type': 'off',
    'max-len': 'off',
    'no-return-assign': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
  overrides: [{
    files: ['*.test.js'], rules: { 'no-import-assign': 'off' },
  }],
});

config.settings = {
  'import/resolver': {
    node: {
      paths: ['src', 'node_modules'],
      extensions: ['.js', '.jsx'],
    },
  },
};

module.exports = config;
