<template>
  <div class="print-preview-wrapper">
    <!-- Toolbar -->
    <div class="toolbar print:hidden">
      <h1 class="text-xl font-bold">Print Preview</h1>

      <!-- Settings Controls -->
      <div class="flex items-center gap-6">
        <!-- Paper Size -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-300">Size:</label>
          <select
            v-model="pageSize"
            class="settings-select"
            @change="reRenderPreview"
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
            <option value="A3">A3</option>
          </select>
        </div>

        <!-- Margins -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-300">Margins:</label>
          <select
            v-model="margins"
            class="settings-select"
            @change="reRenderPreview"
          >
            <option value="narrow">Narrow (10mm)</option>
            <option value="normal">Normal (20mm)</option>
            <option value="wide">Wide (30mm)</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
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

    <!-- PagedJS Container (for screen preview only) -->
    <div ref="previewContainer" class="preview-container print:hidden">
      <!-- PagedJS will inject content here -->
    </div>

    <!-- Source Content (hidden on screen, shown when printing) -->
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
import { sanitizeHtml } from '../utils/sanitizer'

// Use the print layout
definePageMeta({
  layout: 'print'
})

const router = useRouter()
const content = ref('')
const loading = ref(true)
const previewContainer = ref<HTMLElement | null>(null)

// Page settings
type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3'
type MarginSize = 'narrow' | 'normal' | 'wide'

const pageSize = ref<PageSize>('A4')
const margins = ref<MarginSize>('normal')

// Page size and margin values
const pageSizes: Record<PageSize, string> = {
  'A4': 'A4',
  'Letter': 'letter',
  'Legal': 'legal',
  'A3': 'A3'
}
const marginValues: Record<MarginSize, string> = {
  'narrow': '10mm',
  'normal': '20mm',
  'wide': '30mm'
}

// Generate @page CSS for PagedJS (passed as stylesheet to preview())
const getPageStylesForPagedJS = () => {
  return `
    @page {
      size: ${pageSizes[pageSize.value]};
      margin: ${marginValues[margins.value]};
    }

    /* Typography */
    .prose {
      color: #374151;
      max-width: none;
      font-size: 11pt;
      line-height: 1.2;
    }

    .prose h1, .prose h2, .prose h3, .prose h4, .prose strong, .prose b {
      color: #111827;
    }

    .prose a {
      color: #2563eb;
      text-decoration: underline;
    }

    .prose blockquote {
      color: #4b5563;
      border-left-color: #e5e7eb;
    }

    .prose code {
      color: #111827;
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      font-size: 9pt;
    }

    .prose pre {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      color: #1f2937;
      box-shadow: none;
      font-size: 9pt;
      line-height: 1.2;
    }

    .prose pre code {
      background-color: transparent;
      border: none;
      color: inherit;
      font-size: inherit;
    }

    .prose table {
      border-color: #e5e7eb;
    }

    .prose th {
      background-color: #f9fafb;
      color: #111827;
      border-color: #e5e7eb;
    }

    .prose td {
      color: #374151;
      border-color: #e5e7eb;
    }

    /* KaTeX Math */
    .katex, .katex * {
      color: #111827;
    }

    /* Task Lists */
    .prose ul li,
    .prose ol li,
    .prose li.task-list-item,
    .prose .task-list-item {
      color: #374151;
    }

    .prose input[type="checkbox"] {
      accent-color: #2563eb;
    }

    /* Mermaid Diagrams */
    .mermaid-container {
      background-color: transparent;
      border: none;
      margin: 1em 0;
      box-shadow: none;
    }

    .mermaid-viewport {
      overflow: visible !important;
      height: auto !important;
      min-height: auto !important;
    }

    .mermaid-diagram {
      transform: none !important;
    }

    .mermaid {
      display: block !important;
    }

    .mermaid svg {
      max-width: 100% !important;
      height: auto !important;
    }

    .mermaid-controls,
    .code-block-header {
      display: none;
    }

    /* Page breaks */
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }

    img, figure, table, .code-block-container {
      page-break-inside: avoid;
    }
  `
}

// Generate @media print CSS for window.print() (injected into document head)
const getPrintMediaStyles = () => {
  return `
    @media print {
      @page {
        size: ${pageSizes[pageSize.value]};
        margin: 0mm;
      }

      .pagedjs_page {
        width: 100% !important;
        height: 100vh !important;
        page-break-after: always !important;
        break-after: page !important;
      }

      .pagedjs_page:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  `
}

// Store current blob URL for cleanup
let currentBlobUrl: string | null = null

// Create a blob URL for the PagedJS stylesheet
const createStylesheetBlobUrl = () => {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl)
  }
  const cssContent = getPageStylesForPagedJS()
  const blob = new Blob([cssContent], { type: 'text/css' })
  currentBlobUrl = URL.createObjectURL(blob)
  return currentBlobUrl
}

// Inject print media styles into document head (for window.print())
const injectPrintMediaStyles = () => {
  const existingStyle = document.getElementById('dynamic-print-styles')
  if (existingStyle) existingStyle.remove()

  const styleEl = document.createElement('style')
  styleEl.id = 'dynamic-print-styles'
  styleEl.textContent = getPrintMediaStyles()
  document.head.appendChild(styleEl)
}

const loadContent = () => {
  if (import.meta.client) {
    document.documentElement.classList.remove('dark')
    const storedContent = localStorage.getItem('mermditor-print-content')
    if (storedContent) {
      content.value = sanitizeHtml(storedContent)
    } else {
      // Fallback or redirect if no content
      router.push('/editor')
    }
  }
}

const initializePreview = async () => {
  if (!import.meta.client) return

  // 1. Inject print media styles for window.print()
  injectPrintMediaStyles()

  // 2. Wait for Vue to render the source content
  await nextTick()

  // 3. Render diagrams in the source container
  await renderMermaidDiagrams({
    theme: 'default',
    startOnLoad: false,
    htmlLabels: false,
    flowchart: { htmlLabels: false },
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

  // 4. Run Paged.js with our complete stylesheet
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
    // Pass our complete stylesheet as a blob URL - this avoids PagedJS parsing
    // all document stylesheets (which can fail on complex Tailwind selectors)
    const stylesheetUrl = createStylesheetBlobUrl()
    await paged.preview(source.innerHTML, [stylesheetUrl], previewContainer.value)
  }
}

// Re-render preview when settings change
const reRenderPreview = async () => {
  loading.value = true
  if (previewContainer.value) {
    previewContainer.value.innerHTML = ''
  }
  await initializePreview()
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

.settings-select {
  background-color: rgb(55 65 81); /* gray-700 */
  border: 1px solid rgb(75 85 99); /* gray-600 */
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

.settings-select:hover {
  background-color: rgb(75 85 99); /* gray-600 */
}

.settings-select:focus {
  border-color: rgb(59 130 246); /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
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

  /* Show the PagedJS preview container during print */
  .preview-container {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* Hide the source content - use PagedJS rendered pages */
  .print-content-source {
    display: none !important;
  }
}
</style>
