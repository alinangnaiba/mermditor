<template>
  <div class="flex flex-col h-screen bg-slate-900 text-white">
    <!-- Header - Fixed height -->
    <header class="py-4 px-6 border-b border-slate-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="~/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-semibold text-brand-blue">merMDitor</h1>
          </NuxtLink>
        </div>        <nav class="flex items-center gap-4">
          <NuxtLink to="/" class="text-gray-300 hover:text-white">
            Home
          </NuxtLink>
          <NuxtLink to="/cheatsheet" class="text-gray-300 hover:text-white">
            Cheat Sheet
          </NuxtLink>
          <NuxtLink to="/feedback" class="text-gray-300 hover:text-white">
            Feedback
          </NuxtLink>
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
// MarkdownEditor is auto-imported by Nuxt
import { RouterLink } from 'vue-router';
</script>

<!-- Using global styles from global.css -->
