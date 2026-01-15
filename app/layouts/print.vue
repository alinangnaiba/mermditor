<template>
  <div class="print-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// No external CSS import to avoid loading issues
</script>

<style>
/* Print-specific overrides */

@page {
  margin: 20mm;
  size: A4;

  @bottom-right {
    content: counter(page);
    font-size: 9pt;
    color: #666;
  }
}

/* Reset body and html backgrounds */
html, body {
  background-color: white !important;
  color: black !important;
  height: auto !important;
  overflow: visible !important;
}

/* Typography Overrides (Force Light Mode) */
.prose {
  color: #374151 !important; /* gray-700 */
  max-width: none !important;
  font-size: 11pt !important; /* Standard print text size */
  line-height: 1.2 !important;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose strong, .prose b {
  color: #111827 !important; /* gray-900 */
}

.prose a {
  color: #2563eb !important; /* blue-600 */
  text-decoration: underline;
}

.prose blockquote {
  color: #4b5563 !important; /* gray-600 */
  border-left-color: #e5e7eb !important; /* gray-200 */
}

.prose code {
  color: #111827 !important; /* gray-900 */
  background-color: #f3f4f6 !important; /* gray-100 */
  border: 1px solid #e5e7eb !important; /* gray-200 */
  font-size: 9pt !important; /* Smaller for inline code */
}

.prose pre {
  background-color: #f9fafb !important; /* gray-50 */
  border: 1px solid #e5e7eb !important; /* gray-200 */
  color: #1f2937 !important; /* gray-800 */
  box-shadow: none !important;
  font-size: 9pt !important; /* Smaller font for code blocks */
  line-height: 1.2 !important; /* Tighter line height for code */
}

.prose pre code {
  background-color: transparent !important;
  border: none !important;
  color: inherit !important;
  font-size: inherit !important; /* Inherit from pre */
}

.prose table {
  border-color: #e5e7eb !important; /* gray-200 */
}

.prose th {
  background-color: #f9fafb !important; /* gray-50 */
  color: #111827 !important; /* gray-900 */
  border-color: #e5e7eb !important; /* gray-200 */
}

.prose td {
  color: #374151 !important; /* gray-700 */
  border-color: #e5e7eb !important; /* gray-200 */
}

/* Mermaid Diagram Overrides */
body .mermaid-container {
  background-color: transparent !important;
  border: none !important;
  margin: 1em 0 !important;
  box-shadow: none !important;
}

/* Hide UI elements during print if they leak through */
body .mermaid-controls,
body .code-block-header {
  display: none !important;
}

body .code-block-container {
  border: 1px solid #e5e7eb !important;
  border-radius: 4px !important;
  overflow: hidden;
}

/* Ensure pages break correctly */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid;
}

img, figure, table, .mermaid-container, .code-block-container {
  page-break-inside: avoid;
}

/* PagedJS Preview Specific Styles */
.pagedjs_page {
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

/* Styles for the PagedJS Preview UI (Screen) */
.pagedjs_pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #525659; /* Standard PDF viewer background */
  width: 100%;
}

.pagedjs_page {
  background-color: white;
  margin-bottom: 20px;
  flex: none;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

/* Hide the content source */
.print-content-source {
  display: none;
}
</style>
