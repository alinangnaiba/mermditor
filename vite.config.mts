/// <reference types="vitest" />
// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Vue(),
    Components({
      dts: 'src/components.d.ts',
    }),
  ],
  // Vitest configuration
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'], // Optional: for global test setup
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/main.ts',
        'src/router/**',
        'src/plugins/index.ts',
        'src/**/*.d.ts',
        'src/App.vue',
        'src/pages/index.vue',
        'src/pages/cheatsheet.vue',
        'src/pages/editor.vue',
        'src/setupTests.ts',
        // Add other files/patterns to exclude from coverage if necessary
      ],
    },
    // Aliases for Vitest are typically inherited from the main Vite config's resolve.alias
    // Ensure the main resolve.alias is correctly configured.
  },
  optimizeDeps: {
    exclude: [
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Add other aliases if needed, for example:
      // '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
