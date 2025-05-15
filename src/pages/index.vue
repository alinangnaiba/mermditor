<template>  <div class="header bg-gray-900 text-white py-2 px-4">
    <h1 class="text-lg font-semibold flex items-center">
      <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-6 mr-2 pt-1" />
      MerMDitor: Markdown editor with Mermaid syntax support
    </h1>
  </div>

  <MarkdownEditor />
</template>

<script lang="ts" setup>
import MarkdownEditor from '@/components/MarkdownEditor.vue';
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
