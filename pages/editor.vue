<template>
  <div class="flex h-screen flex-col bg-surface-primary text-text-primary">
    <header class="flex-shrink-0 border-b border-border-primary px-6 py-4">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="mr-3 h-8" >
            <h1 class="text-xl font-semibold text-accent-primary">merMDitor</h1>
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="rounded px-2 py-1 text-text-secondary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >Home</NuxtLink
          >
          <NuxtLink
            to="/tool-guide"
            class="rounded px-2 py-1 text-text-secondary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >Tool Guide</NuxtLink
          >
        </nav>
      </div>
    </header>

    <!-- Editor takes remaining space with flex-grow -->
    <div class="relative min-h-0 flex-grow">
      <MarkdownEditor />
      <!-- Floating Help Button -->
      <NuxtLink
        to="/feedback"
        class="group fixed bottom-6 right-6 z-50 rounded-full bg-surface-tertiary p-2 text-text-primary shadow-lg transition-colors hover:bg-surface-quaternary focus:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
        title="Get Help or Send Feedback"
        :aria-label="'Get Help or Send Feedback'"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <!-- Tooltip -->
        <span
          class="absolute right-full top-1/2 mr-3 -translate-y-1/2 transform whitespace-nowrap rounded-lg bg-surface-secondary px-3 py-1 text-sm text-text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
        >
          Help & Feedback
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
// MarkdownEditor is auto-imported by Nuxt

// Page-specific SEO meta tags
useSeoMeta({
  title: 'Markdown Editor - merMDitor | Free Online Editor with Mermaid Support',
  description:
    'Start writing Markdown with live preview and Mermaid diagram support. Auto-saves your work locally. No account required - just start typing!',
  ogTitle: 'Markdown Editor - merMDitor',
  ogDescription:
    'Start writing Markdown with live preview and Mermaid diagram support. Auto-saves your work locally.',
  ogUrl: 'https://www.mermditor.dev/editor',
  twitterTitle: 'Markdown Editor - merMDitor',
  twitterDescription:
    'Start writing Markdown with live preview and Mermaid diagram support. Auto-saves your work locally.',
});

useHead({
  link: [{ rel: 'canonical', href: 'https://www.mermditor.dev/editor' }],
});

// Structured data for the editor page
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'merMDitor Editor',
        description: 'Online Markdown editor with live preview and Mermaid diagram support',
        url: 'https://www.mermditor.dev/editor',
        applicationCategory: 'DesignApplication',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        operatingSystem: 'Any',
        permissions: 'No special permissions required',
      }),
    },
  ],
});
</script>
