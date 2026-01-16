<template>
  <div class="print-preview-wrapper">
    <!-- Toolbar -->
    <div class="toolbar print:hidden">
      <h1 class="text-xl font-bold">Print Preview</h1>
      <div class="flex gap-4">
        <button
          class="px-4 py-2 bg-accent-active hover:bg-accent-primary rounded text-white font-medium flex items-center gap-2"
          @click="handlePrint"
        >
          <PhPrinter :size="20" />
          Print / Save PDF
        </button>
        <button
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium"
          @click="close"
        >
          Close
        </button>
      </div>
    </div>

    <!-- PagedJS Container -->
    <div ref="previewContainer" class="preview-container">
      <!-- PagedJS will inject content here -->
    </div>

    <!-- Hidden Source Content -->
    <div id="print-content" class="print-content-source">
      <div class="prose max-w-none" v-html="content"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay print:hidden">
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
import { Previewer } from 'pagedjs'
import { renderMermaidDiagrams } from '../utils/markdownItMermaid'

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

    // Listen for the rendered event to hide loading
    paged.on('rendered', () => {
      loading.value = false
    })

    // Start preview
    // Note: PagedJS moves content from source to previewContainer
    // We pass the innerHTML as content, empty styles array (styles already loaded),
    // and the container to render into
    await paged.preview(source.innerHTML, [], previewContainer.value)
  }
}

const handlePrint = () => {
  // Set document title for default PDF filename
  const timestamp = Date.now()
  const originalTitle = document.title
  document.title = `document - ${timestamp}`

  window.print()

  // Restore original title after print dialog closes
  document.title = originalTitle
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
/* Screen styles for the print preview page */
.print-preview-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #525659;
}

.toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgb(17 24 39); /* gray-900 */
  color: white;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-container {
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

/* Critical print styles - these override everything during print */
@media print {
  /* Reset the wrapper */
  .print-preview-wrapper {
    min-height: auto !important;
    background: white !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Hide toolbar */
  .toolbar {
    display: none !important;
  }

  /* Hide loading overlay */
  .loading-overlay {
    display: none !important;
  }

  /* Reset preview container for print */
  .preview-container {
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
    display: block !important;
  }
}
</style>
