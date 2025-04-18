import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'antfu/if-newline': 'off',
    'node/prefer-global/process': 'off',
    'perfectionist/sort-objects': ['error'],
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
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
    'yaml/plain-scalar': 'off',
  },
  type: 'app',
  typescript: true,
  vue: true,
})
