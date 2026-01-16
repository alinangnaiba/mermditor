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

/* PagedJS Preview Specific Styles (Screen) */
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

/* Hide the content source on screen */
.print-content-source {
  display: none !important;
}

/* =============================================
   PRINT MEDIA STYLES
   These ensure the browser prints PagedJS pages correctly
   ============================================= */
@media print {
  /* Reset everything for print - remove shadows and backgrounds */
  *, *::before, *::after {
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide non-print elements */
  .print\\:hidden,
  [class*="print:hidden"] {
    display: none !important;
  }

  /* Hide the toolbar */
  .fixed.top-0,
  .toolbar {
    display: none !important;
  }

  /* Hide the original content source */
  .print-content-source,
  #print-content {
    display: none !important;
  }

  /* Hide loading overlay */
  .fixed.inset-0,
  .loading-overlay {
    display: none !important;
  }

  /* Reset body/html for print */
  html, body {
    background: white !important;
    background-color: white !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* Reset the main layout container */
  .print-layout {
    background: white !important;
    background-color: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Reset the preview wrapper */
  .print-preview-wrapper {
    background: white !important;
    background-color: white !important;
    margin: 0 !important;
    padding: 0 !important;
    min-height: auto !important;
    display: block !important;
  }

  /* Reset preview container */
  .preview-container {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    background-color: white !important;
    display: block !important;
    width: auto !important;
  }

  /* Style the PagedJS pages container for print */
  .pagedjs_pages {
    background: transparent !important;
    background-color: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
    width: auto !important;
  }

  /* Each PagedJS page should be a print page */
  .pagedjs_page {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 0 !important;
    page-break-after: always !important;
    break-after: page !important;
    background: white !important;
    background-color: white !important;
    /* Make page fill the print page */
    width: 100% !important;
    height: auto !important;
    position: relative !important;
    display: block !important;
  }

  /* Last page shouldn't have break after */
  .pagedjs_page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  /* Reset the page box container */
  .pagedjs_pagebox {
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
  }

  /* Page area styles */
  .pagedjs_area {
    background: white !important;
    background-color: white !important;
  }

  /* Ensure content inside pages prints correctly */
  .pagedjs_page_content {
    background: white !important;
    background-color: white !important;
  }

  /* Page margin boxes (header/footer area) */
  .pagedjs_margin {
    background: transparent !important;
  }
}
</style>
