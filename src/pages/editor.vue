<template>
  <div>
    <div class="header bg-gray-900 text-white py-4 px-6 flex justify-between items-center">
      <h1 class="text-lg font-semibold flex items-center">
        <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
          <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-6 mr-2 pt-1" />
        </RouterLink>
        <span>MerMDitor: the markdown editor with Mermaid syntax support</span>
      </h1>
      <div class="flex items-center">
        <RouterLink to="/cheatsheet" class="text-gray-300 hover:text-white">
          Cheat Sheet
        </RouterLink>
      </div>
    </div>

    <MarkdownEditor />
  </div>
</template>

<script lang="ts" setup>
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { RouterLink } from 'vue-router';
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.header a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.header a:hover {
  color: #3B82F6;
}
</style>
