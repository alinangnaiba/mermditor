// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxtjs/sitemap'],
  css: ['~/assets/css/tailwind.css', '~/assets/css/global.css'],app: {
    head: {
      title: 'merMDitor - Free Markdown Editor with Mermaid Diagrams | No Signup Required',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Free online Markdown editor with live preview and Mermaid diagram support. Create flowcharts, sequence diagrams, and more. Works entirely in your browser with auto-save. No registration required.' },
        { name: 'keywords', content: 'markdown editor, mermaid diagrams, online editor, free markdown, flowchart maker, sequence diagram, live preview, browser editor' },
        { name: 'author', content: 'merMDitor' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'merMDitor - Free Markdown Editor with Mermaid Diagrams' },
        { property: 'og:description', content: 'Free online Markdown editor with live preview and Mermaid diagram support. Create flowcharts, sequence diagrams, and more. Works entirely in your browser with auto-save.' },
        { property: 'og:image', content: '/og-image.png' },        { property: 'og:url', content: 'https://www.mermditor.dev' },
        { property: 'og:site_name', content: 'merMDitor' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'merMDitor - Free Markdown Editor with Mermaid Diagrams' },
        { name: 'twitter:description', content: 'Free online Markdown editor with live preview and Mermaid diagram support. No signup required.' },
        { name: 'twitter:image', content: '/og-image.png' },
        // Additional SEO
        { name: 'theme-color', content: '#0f172a' },
        { name: 'msapplication-TileColor', content: '#0f172a' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://www.mermditor.dev' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap', rel: 'stylesheet' }
      ]
    }  },
  site: {
    url: 'https://www.mermditor.dev'
  },
  sitemap: {
    urls: [
      '/',
      '/editor', 
      '/tool-guide',
      '/feedback'
    ]
  },
  nitro: {
    preset: 'vercel'
  }
});