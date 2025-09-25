<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="border-b border-gray-700 bg-gray-800">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Icon -->
          <NuxtLink
            to="/"
            class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            <img src="../assets/images/logo.png" alt="merMDitor Logo" class="mr-2 h-8" />
            <h1 class="text-xl font-semibold text-accent-primary">merMDitor</h1>
          </NuxtLink>

          <!-- Navigation -->
          <nav class="flex items-center space-x-6">
            <NuxtLink
              to="/"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/editor"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Editor
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 class="mb-8 text-4xl font-bold">Tool Guide</h1>
      <!-- Navigation Tabs -->
      <div class="mb-8 border-b border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'border-b-2 px-1 py-2 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-400'
                : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300',
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
      <!-- Tab Content -->
      <GuideContent :active-tab="activeTab" />
    </div>
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import GuideContent from '../components/GuideContent.vue'

interface Tab {
  id: string
  name: string
}

const activeTab: Ref<string> = ref('markdown')

const tabs: Tab[] = [
  { id: 'markdown', name: 'Markdown' },
  { id: 'mermaid', name: 'Mermaid' },
  { id: 'latex', name: 'LaTeX' },
  { id: 'shortcuts', name: 'Shortcuts' },
]
</script>
