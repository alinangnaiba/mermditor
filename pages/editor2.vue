<template>
  <div class="min-h-screen bg-deep-black">
    <!-- Header Banner -->
    <div class="bg-surface-secondary border-b border-border-primary">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-accent-primary hover:text-accent-secondary transition-colors">
            <h1 class="text-xl font-bold">merMDitor v2 (CodeMirror Testing)</h1>
          </NuxtLink>
          <div class="text-sm text-text-tertiary bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded">
            TESTING VERSION - CodeMirror 6
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink
            to="/editor"
            class="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to Original Editor
          </NuxtLink>
          <NuxtLink
            to="/tool-guide"
            class="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Tool Guide
          </NuxtLink>
          <NuxtLink
            to="/feedback"
            class="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Feedback
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Editor Content -->
    <div class="h-[calc(100vh-73px)]">
      <CodeMirrorEditor />
    </div>

    <!-- Loading Overlay -->
    <LoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import CodeMirrorEditor from '~/components/CodeMirrorEditor.vue';
import LoadingOverlay from '~/components/LoadingOverlay.vue';

// Set page title and meta tags
useHead({
  title: 'merMDitor v2 - CodeMirror Testing',
  meta: [
    {
      name: 'description',
      content: 'Testing version of merMDitor with CodeMirror 6 integration - Advanced Markdown editor with Mermaid diagrams and LaTeX math support'
    },
    {
      name: 'keywords',
      content: 'markdown editor, codemirror, mermaid diagrams, latex math, katex, testing, vue3, nuxt3'
    },
    { name: 'robots', content: 'noindex, nofollow' }, // Prevent search engines from indexing test page
  ]
});

// Page metadata
definePageMeta({
  layout: false
});
</script>

<style scoped>
/* Ensure full height layout */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>