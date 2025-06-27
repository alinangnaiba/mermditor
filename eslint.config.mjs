// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Enforce semicolons at the end of statements
      'semi': ['error', 'always'],
      // Enforce semicolon spacing
      'semi-spacing': ['error', { 'before': false, 'after': true }],
    }
  },
  // Disable strict typing for markdown-it utility files
  {
    files: ['utils/markdownIt*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  // Disable Vue parsing errors for MermaidContent.vue (contains complex markdown examples)
  {
    files: ['components/tool-guide/MermaidContent.vue'],
    rules: {
      'vue/no-parsing-error': 'off',
    }
  }
);
