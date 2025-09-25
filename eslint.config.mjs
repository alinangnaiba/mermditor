// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
  {
    rules: {
      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/no-parsing-error': 'off', // Temporarily disable for HTML entity issues

      // General JavaScript/TypeScript rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  }
)
