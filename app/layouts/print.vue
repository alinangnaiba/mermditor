<template>
  <div class="print-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No external CSS import to avoid loading issues
</script>

<style scoped>
/*
 * IMPORTANT: This style block is scoped to prevent CSS leaking to other pages.
 * All styles here only apply when the print layout is active.
 *
 * Note: :deep() is used for styles that need to penetrate into child components.
 */

/* PagedJS Preview Specific Styles (Screen) */
:deep(.pagedjs_pages) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #525659;
  width: 100%;
}

:deep(.pagedjs_page) {
  background-color: white;
  margin-bottom: 20px;
  flex: none;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

/* Hide the content source on screen */
:deep(.print-content-source) {
  display: none;
}
</style>

<style>
/*
 * Global styles that MUST be unscoped:
 * - @media print rules (browser print needs these globally)
 * - html/body resets for print layout pages
 *
 * These are wrapped in .print-layout to scope them to this layout only.
 */

/* Only apply these styles when print-layout is present */
.print-layout {
  background-color: white;
  color: black;
  min-height: 100vh;
}

/* Typography for print layout - scoped to .print-layout */
.print-layout .prose {
  color: #374151; /* gray-700 */
  max-width: none;
  font-size: 11pt;
  line-height: 1.2;
}

.print-layout .prose h1,
.print-layout .prose h2,
.print-layout .prose h3,
.print-layout .prose h4,
.print-layout .prose strong,
.print-layout .prose b {
  color: #111827; /* gray-900 */
}

.print-layout .prose a {
  color: #2563eb; /* blue-600 */
  text-decoration: underline;
}

.print-layout .prose blockquote {
  color: #4b5563; /* gray-600 */
  border-left-color: #e5e7eb; /* gray-200 */
}

.print-layout .prose code {
  color: #111827; /* gray-900 */
  background-color: #f3f4f6; /* gray-100 */
  border: 1px solid #e5e7eb; /* gray-200 */
  font-size: 9pt;
}

.print-layout .prose pre {
  background-color: #f9fafb; /* gray-50 */
  border: 1px solid #e5e7eb; /* gray-200 */
  color: #1f2937; /* gray-800 */
  box-shadow: none;
  font-size: 9pt;
  line-height: 1.2;
}

.print-layout .prose pre code {
  background-color: transparent;
  border: none;
  color: inherit;
  font-size: inherit;
}

.print-layout .prose table {
  border-color: #e5e7eb; /* gray-200 */
}

.print-layout .prose th {
  background-color: #f9fafb; /* gray-50 */
  color: #111827; /* gray-900 */
  border-color: #e5e7eb; /* gray-200 */
}

.print-layout .prose td {
  color: #374151; /* gray-700 */
  border-color: #e5e7eb; /* gray-200 */
}

/* KaTeX Math - scoped to .print-layout */
.print-layout .katex,
.print-layout .katex * {
  color: #111827; /* gray-900 */
}

.print-layout .katex-display {
  color: #111827;
}

/* Task Lists - scoped to .print-layout */
.print-layout .prose ul li,
.print-layout .prose ol li,
.print-layout .prose li.task-list-item,
.print-layout .prose .task-list-item {
  color: #374151; /* gray-700 */
}

.print-layout .prose ul li::marker,
.print-layout .prose ol li::marker {
  color: #374151; /* gray-700 */
}

.print-layout .prose input[type="checkbox"] {
  accent-color: #2563eb; /* blue-600 */
  border-color: #374151; /* gray-700 */
}

/* Mermaid Diagrams - scoped to .print-layout */
.print-layout .mermaid-container {
  background-color: transparent;
  border: none;
  margin: 1em 0;
  box-shadow: none;
}

.print-layout .mermaid-controls,
.print-layout .code-block-header {
  display: none;
}

.print-layout .code-block-container {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

/* Page break hints - scoped to .print-layout */
.print-layout h1,
.print-layout h2,
.print-layout h3,
.print-layout h4,
.print-layout h5,
.print-layout h6 {
  page-break-after: avoid;
}

.print-layout img,
.print-layout figure,
.print-layout table,
.print-layout .mermaid-container,
.print-layout .code-block-container {
  page-break-inside: avoid;
}

/* =============================================
   PRINT MEDIA STYLES
   These are for @media print and need to be global
   but are still scoped via .print-layout where possible
   ============================================= */
@media print {
  /* Reset everything for print */
  .print-layout *,
  .print-layout *::before,
  .print-layout *::after {
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide non-print elements */
  .print-layout .print\:hidden,
  .print-layout [class*="print:hidden"] {
    display: none !important;
  }

  /* Hide the toolbar */
  .print-layout .toolbar {
    display: none !important;
  }

  /* Hide loading overlay */
  .print-layout .loading-overlay {
    display: none !important;
  }

  /* Reset the main layout container */
  .print-layout {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Reset the preview wrapper */
  .print-layout .print-preview-wrapper {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
    display: block !important;
  }

  /* Print the PagedJS rendered pages */
  .print-layout .preview-container {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: auto !important;
  }

  /* PagedJS pages container */
  .print-layout .pagedjs_pages {
    display: block !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
    width: auto !important;
  }

  /* Each PagedJS page */
  .print-layout .pagedjs_page {
    display: block !important;
    box-shadow: none !important;
    margin: 0 !important;
    background: white !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Hide the source content - we use PagedJS rendered pages */
  .print-layout .print-content-source,
  .print-layout #print-content {
    display: none !important;
  }
}
</style>
