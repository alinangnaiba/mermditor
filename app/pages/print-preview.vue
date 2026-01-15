<template>
  <div class="min-h-screen flex flex-col items-center">
    <!-- Toolbar -->
    <div class="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 shadow-lg flex justify-between items-center print:hidden">
      <h1 class="text-xl font-bold">Print Preview</h1>
      <div class="flex gap-4">
        <button
          @click="handlePrint"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium flex items-center gap-2"
        >
          <PhPrinter :size="20" />
          Print / Save PDF
        </button>
        <button
          @click="close"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium"
        >
          Close
        </button>
      </div>
    </div>

    <!-- PagedJS Container -->
    <div ref="previewContainer" class="w-full mt-20 mb-10 flex justify-center">
      <!-- PagedJS will inject content here -->
    </div>

    <!-- Hidden Source Content -->
    <div id="print-content" class="print-content-source">
      <div class="prose max-w-none" v-html="content"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40 print:hidden">
      <div class="bg-white p-6 rounded-lg shadow-xl text-gray-900 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p>Preparing document...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { PhPrinter } from '@phosphor-icons/vue'
import { Previewer, Handler } from 'pagedjs'
import { initMermaid, renderMermaidDiagrams } from '../utils/markdownItMermaid'

// Use the print layout
definePageMeta({
  layout: 'print'
})

const router = useRouter()
const content = ref('')
const loading = ref(true)
const previewContainer = ref<HTMLElement | null>(null)

const loadContent = () => {
  if (import.meta.client) {
    document.documentElement.classList.remove('dark')
    const storedContent = localStorage.getItem('mermditor-print-content')
    if (storedContent) {
      content.value = storedContent
    } else {
      // Fallback or redirect if no content
      router.push('/editor')
    }
  }
}

const initializePreview = async () => {
  if (!import.meta.client) return

  // 1. Wait for Vue to render the source content
  await nextTick()

  // 3. Render diagrams in the source container
  await renderMermaidDiagrams({
    theme: 'default',
    themeVariables: {
      primaryColor: '#2563eb', // blue-600
      primaryTextColor: '#111827', // gray-900
      primaryBorderColor: '#e5e7eb', // gray-200
      lineColor: '#374151', // gray-700
      secondaryColor: '#f3f4f6', // gray-100
      tertiaryColor: '#ffffff', // white
      background: '#ffffff',
      mainBkg: '#ffffff',
      secondBkg: '#f3f4f6',
      tertiaryBkg: '#e5e7eb',
    }
  })

  // 4. Run Paged.js
  const paged = new Previewer()
  const source = document.querySelector('#print-content')

  if (source && previewContainer.value) {
    // We need to clear previous content if any
    previewContainer.value.innerHTML = ''

    // PagedJS hooks
    paged.registerHandlers(class extends Handler {
        afterPreview() {
            loading.value = false
        }
    })

    // Start preview
    // Note: PagedJS moves content from source to previewContainer
    // We clone the content to keep the original source intact if needed,
    // but PagedJS expects to consume it.
    // We pass empty styles array as styles are already loaded by the layout
    await paged.preview(source.innerHTML, [], previewContainer.value)
  }
}

const handlePrint = () => {
  window.print()
}

const close = () => {
  window.close()
  if (!window.closed) {
    // If opened in same tab or window.close() blocked
    router.back()
  }
}

onMounted(async () => {
  loadContent()
  // Add a small delay to ensure DOM is ready and styles are loaded
  setTimeout(() => {
    initializePreview()
  }, 500)
})
</script>

<style>
/* Additional print-specific tweaks if needed */
</style>
