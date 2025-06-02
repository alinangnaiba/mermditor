<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-slate-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-semibold text-brand-blue">merMDitor</h1>
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-gray-300 hover:text-white">
            Home
          </NuxtLink>          <NuxtLink to="/editor" class="text-gray-300 hover:text-white">
            Editor
          </NuxtLink>          <NuxtLink to="/tool-guide" class="text-gray-300 hover:text-white">
            Tool Guide
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-grow py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white">
            Help Improve merMDitor
          </h1>
          <p class="mt-2 text-lg text-gray-300">
            Your feedback helps make merMDitor better for everyone
          </p>        </div>

        <!-- Feedback Guidelines -->
        <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 class="text-lg font-semibold text-blue-400 mb-3">
            📝 Feedback Guidelines
          </h2>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><strong>Bug Reports:</strong> Include steps to reproduce, expected vs actual behavior</li>
            <li><strong>Feature Requests:</strong> Describe the problem you're trying to solve</li>
            <li><strong>Improvements:</strong> Suggest enhancements to existing functionality</li>
            <li><strong>Questions:</strong> Ask about usage, features, or technical aspects</li>
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
  description: 'Share your feedback, report bugs, or suggest improvements for merMDitor. Help us make the best Markdown and Mermaid diagram editor.',
  ogTitle: 'Feedback & Support - merMDitor',
  ogDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.',
  ogUrl: 'https://www.mermditor.dev/feedback',
  twitterTitle: 'Feedback & Support - merMDitor',
  twitterDescription: 'Share your feedback, report bugs, or suggest improvements for merMDitor.'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.mermditor.dev/feedback' }
  ]
})

// Structured data for the feedback page
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'merMDitor Feedback & Support',
        description: 'Feedback and support page for merMDitor - Markdown and Mermaid diagram editor',
        url: 'https://www.mermditor.dev/feedback'
      })
    }
  ]
})
</script>
