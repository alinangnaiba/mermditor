<template>
  <div class="h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-semibold">merMDitor</h1>
          </RouterLink>
        </div>
        <nav class="flex items-center space-x-4">
          <RouterLink to="/editor" class="hover:text-blue-400">Editor</RouterLink>
          <RouterLink to="/cheatsheet" class="text-blue-400 font-medium">Cheat Sheet</RouterLink>
        </nav>
      </div>
    </header>
    
    <!-- Cheat Sheet Content - Scrollable area -->
    <div class="flex-1 overflow-y-auto">
      <div class="container mx-auto py-8 px-4 pb-20">
        <!-- Tab Navigation -->
        <div class="mb-8 sticky top-0 bg-gray-900 py-3 z-10 border-b border-gray-800">
          <nav class="flex justify-center space-x-4" aria-label="Tabs">
            <button 
              @click="activeTab = 'markdown'" 
              :class="['py-2 px-4 font-medium rounded-md', activeTab === 'markdown' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
              Markdown
            </button>
            <button 
              @click="activeTab = 'mermaid'" 
              :class="['py-2 px-4 font-medium rounded-md', activeTab === 'mermaid' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
              Mermaid
            </button>
            <button 
              @click="activeTab = 'shortcuts'" 
              :class="['py-2 px-4 font-medium rounded-md', activeTab === 'shortcuts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
              Shortcuts
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div>
          <MarkdownContent v-if="activeTab === 'markdown'" />
          <MermaidContent v-if="activeTab === 'mermaid'" />
          <ShortcutsContent v-if="activeTab === 'shortcuts'" />
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import { setupMermaid } from '@/plugins/mermaid';
import AppFooter from '@/components/AppFooter.vue';
import MarkdownContent from '@/components/cheatsheet/MarkdownContent.vue';
import MermaidContent from '@/components/cheatsheet/MermaidContent.vue';
import ShortcutsContent from '@/components/cheatsheet/ShortcutsContent.vue';

// Active tab state (markdown, mermaid, shortcuts)
const activeTab = ref('markdown');

onMounted(() => {
  setupMermaid();
});
</script>

<style scoped>
/* Scoped styles for this component */
</style>
