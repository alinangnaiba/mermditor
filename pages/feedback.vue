<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Help Improve merMDitor
        </h1>
        <p class="mt-2 text-lg text-gray-600 dark:text-gray-300">
          Your feedback helps make merMDitor better for everyone
        </p>
      </div>

      <!-- Feedback Guidelines -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          📝 Feedback Guidelines
        </h2>
        <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li><strong>Bug Reports:</strong> Include steps to reproduce, expected vs actual behavior</li>
          <li><strong>Feature Requests:</strong> Describe the problem you're trying to solve</li>
          <li><strong>Improvements:</strong> Suggest enhancements to existing functionality</li>
          <li><strong>Questions:</strong> Ask about usage, features, or technical aspects</li>
        </ul>
      </div>

      <!-- Feedback Form -->
      <FeedbackForm />

      <!-- Alternative Contact -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          You can also reach out directly on 
          <a href="https://github.com/your-username/mermditor" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline">
            GitHub
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO and meta tags
useHead({
  title: 'Feedback - merMDitor',
  meta: [
    { name: 'description', content: 'Share your feedback, report bugs, or suggest improvements for Mermditor - the Markdown and Mermaid diagram editor.' }
  ]
})
</script>
