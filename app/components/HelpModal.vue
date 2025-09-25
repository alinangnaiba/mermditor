<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click="closeModal"
  >
    <div class="max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-lg bg-gray-800" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-gray-700 p-4">
        <h2 class="text-xl font-semibold text-white">Quick Reference</h2>
        <button
          class="rounded p-2 text-gray-400 transition-colors hover:text-white"
          @click="closeModal"
        >
          <PhX :size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="max-h-[calc(90vh-80px)] overflow-auto">
        <!-- Navigation Tabs -->
        <div class="border-b border-gray-700 px-4">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'border-b-2 px-1 py-3 text-sm font-medium transition-colors',
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
        <div class="p-4">
          <GuideContent :active-tab="activeTab" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PhX } from '@phosphor-icons/vue'
import GuideContent from './GuideContent.vue'

interface Tab {
  id: string
  name: string
}

interface Props {
  isOpen: boolean
}

defineProps<Props>()
const emit = defineEmits(['close'])

const activeTab = ref('markdown')

const tabs: Tab[] = [
  { id: 'markdown', name: 'Markdown' },
  { id: 'mermaid', name: 'Mermaid' },
  { id: 'latex', name: 'LaTeX' },
  { id: 'shortcuts', name: 'Shortcuts' },
]

const closeModal = () => {
  emit('close')
}
</script>
