<template>
  <div class="flex min-h-screen flex-col bg-surface-primary text-text-primary">
    <!-- Header -->
    <header class="flex-shrink-0 border-b border-border-primary px-6 py-4">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            <img src="../assets/images/logo.png" alt="merMDitor Logo" class="mr-2 h-8" />
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
            to="/editor"
            class="rounded px-2 py-1 text-text-secondary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >Editor</NuxtLink
          >
          <NuxtLink
            to="/guide"
            class="rounded px-2 py-1 text-text-secondary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >Tool Guide</NuxtLink
          >
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-grow py-8">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-text-primary">Help Improve merMDitor</h1>
          <p class="mt-2 text-lg text-text-secondary">
            Your feedback helps make merMDitor better for everyone
          </p>
        </div>

        <!-- Feedback Guidelines -->
        <div class="mb-8 rounded-lg border border-border-primary bg-surface-secondary p-6">
          <h2 class="mb-3 text-lg font-semibold text-accent-primary">📝 Feedback Guidelines</h2>
          <ul class="space-y-2 text-sm text-text-secondary">
            <li>
              <strong class="text-text-primary">Bug Reports:</strong> Include steps to reproduce,
              expected vs actual behavior
            </li>
            <li>
              <strong class="text-text-primary">Feature Requests:</strong> Describe the problem
              you're trying to solve
            </li>
            <li>
              <strong class="text-text-primary">Improvements:</strong> Suggest enhancements to
              existing functionality
            </li>
            <li>
              <strong class="text-text-primary">Questions:</strong> Ask about usage, features, or
              technical aspects
            </li>
          </ul>
        </div>

        <!-- Feedback Form -->
        <FeedbackForm />
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Page-specific SEO meta tags
useSeoMeta({
  title: 'Feedback & Support - merMDitor | Report Bugs & Suggest Features',
  description:
    'Share your feedback, report bugs, or suggest improvements for merMDitor. Help us make the best Markdown and Mermaid diagram editor.',
  ogTitle: 'Feedback & Support - merMDitor',
  ogDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.',
  ogUrl: 'https://www.mermditor.dev/feedback',
  twitterTitle: 'Feedback & Support - merMDitor',
  twitterDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://www.mermditor.dev/feedback' }],
})

// Structured data for the feedback page
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'merMDitor Feedback & Support',
        description:
          'Feedback and support page for merMDitor - Markdown and Mermaid diagram editor',
        url: 'https://www.mermditor.dev/feedback',
      }),
    },
  ],
})
</script>
