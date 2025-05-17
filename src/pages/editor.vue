<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <!-- Header - Fixed height -->
    <header class="py-4 px-6 border-b border-gray-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-3" />
            <h1 class="text-xl font-bold">merMDitor</h1>
          </RouterLink>
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

    <!-- Editor takes remaining space with flex-grow -->
    <div class="flex-grow min-h-0">
      <MarkdownEditor />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import { RouterLink } from 'vue-router';
</script>

<!-- Using global styles from global.css -->
