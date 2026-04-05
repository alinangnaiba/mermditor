export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3'
export type MarginSize = 'narrow' | 'normal' | 'wide'

export const pageSizes: Record<PageSize, string> = {
  A4: 'A4',
  Letter: 'letter',
  Legal: 'legal',
  A3: 'A3',
}

export const marginValues: Record<MarginSize, string> = {
  narrow: '10mm',
  normal: '20mm',
  wide: '30mm',
}

export const getPageStylesForPagedJS = (
  pageSize: PageSize,
  margins: MarginSize,
  printCodeLinesClass: string,
  printCodeLineClass: string
) => `
    @page {
      size: ${pageSizes[pageSize]};
      margin: ${marginValues[margins]};
    }

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

    .code-block-container {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-left: 1px solid #e5e7eb;
      border-radius: 4px;
      padding: 0.75rem 1rem;
      overflow: visible;
      break-inside: auto;
      page-break-inside: auto;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
    }

    .code-block-body {
      max-height: none !important;
      overflow: visible !important;
      background: transparent;
      display: block;
    }

    .code-block-container pre {
      display: block;
      margin: 0 !important;
      padding: 0 !important;
      background-color: #ffffff !important;
      border: 0 !important;
      color: #111827 !important;
      overflow: visible !important;
      line-height: 1.45 !important;
      white-space: break-spaces !important;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      orphans: 3;
      widows: 3;
      tab-size: 2;
    }

    .code-block-container pre code {
      display: block;
      margin: 0;
      border: 0 !important;
      white-space: break-spaces !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
      tab-size: 2;
    }

    .prose pre code.${printCodeLinesClass},
    .code-block-container pre code.${printCodeLinesClass} {
      white-space: normal !important;
      overflow-wrap: normal !important;
      word-break: normal !important;
    }

    .prose pre code.${printCodeLinesClass} .${printCodeLineClass},
    .code-block-container pre code.${printCodeLinesClass} .${printCodeLineClass} {
      display: block;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: normal;
      min-height: 1.45em;
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

    .katex, .katex * {
      color: #111827;
    }

    .prose ul li,
    .prose ol li,
    .prose li.task-list-item,
    .prose .task-list-item {
      color: #374151;
    }

    .prose input[type="checkbox"] {
      accent-color: #2563eb;
    }

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

    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }

    img, figure, table {
      page-break-inside: avoid;
    }
  `

export const getPrintMediaStyles = (pageSize: PageSize) => `
    @media print {
      @page {
        size: ${pageSizes[pageSize]};
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
