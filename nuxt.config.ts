// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  css: ['~/app/assets/main.css'],
  alias: {
    '@': '.',
    '~': '.',
  },
  app: {
    head: {
      title: 'merMDitor - Markdown Editor with Mermaid & LaTeX',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A simple Markdown editor with Mermaid diagrams and LaTeX math support',
        },
      ],
      // CDN resources removed - KaTeX and Prism.js are now loaded dynamically via NPM packages
      // This improves FCP by eliminating render-blocking CSS
      link: [
        // Keep preconnect for Prism autoloader language definitions (loaded on-demand)
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
      ],
      script: [],
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: blob:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.github.com https://va.vercel-scripts.com blob:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        },
      },
    },
  },
})
