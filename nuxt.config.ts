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
      link: [
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
        { 
          rel: 'stylesheet', 
          href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
          integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css',
          integrity: 'sha384-vs7+jbztHoMto5Yd/yinM4/y2DOkPLt0fATcN+j+G4ANY2z4faIzZIOMkpBmWdc4g==',
          crossorigin: 'anonymous'
        },
      ],
      script: [
        { 
          src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', 
          defer: true,
          integrity: 'sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8',
          crossorigin: 'anonymous'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js',
          defer: true,
          integrity: 'sha384-457emw+Nq5s7K1g4J2Q6WZ5DdYxWYqHZZyT7rQy8XrFbF6kI8vM0J+g+V93GjO98',
          crossorigin: 'anonymous'
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',
          defer: true,
          integrity: 'sha384-37W3F0YCCQ0tJfBfZcI2MqHqgF6oVg0q8N39DgDq0Jf4Q9t3FqS9d02y6e1eRjL9',
          crossorigin: 'anonymous'
        },
      ],
    },
  },
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.github.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; '),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      }
    }
  }
})
