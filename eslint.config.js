// Import necessary ESLint plugins and configurations
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

// Export the ESLint configuration
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'], // Or 'flat/strongly-recommended' or 'flat/recommended'
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // Vue specific rules
      'vue/multi-word-component-names': 'off', // Turn off for pages like index.vue, editor.vue
      // Add other rules as needed
    }
  },
  {
    ignores: ["dist", "node_modules", ".vscode", "public"] // Add other ignored paths
  }
];
