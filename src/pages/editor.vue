<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-hidden">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-3" />
          </RouterLink>
          <h1 class="text-xl font-bold">merMDitor</h1>
        </div>
        <nav class="flex items-center gap-4">
          <RouterLink to="/" class="text-gray-300 hover:text-white">
            Home
          </RouterLink>
          <RouterLink to="/cheatsheet" class="text-gray-300 hover:text-white">
            Cheat Sheet
          </RouterLink>
        </nav>
      </div>
    </header>

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
</style>
