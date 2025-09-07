import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  rules: {
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
    }],
    'vue/first-attribute-linebreak': ['error', {
      multiline: 'below',
      singleline: 'ignore',
    }],
    'vue/html-closing-bracket-newline': ['error', {
      multiline: 'never',
      selfClosingTag: {
        multiline: 'never',
        singleline: 'never',
      },
      singleline: 'never',
    }],
    'vue/multiline-html-element-content-newline': 'error',
  },
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  type: 'app',
  typescript: true,
  vue: true,
})
