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
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css',
        },
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js', defer: true },
        {
          src: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js',
          defer: true,
        },
      ],
    },
  },
})
