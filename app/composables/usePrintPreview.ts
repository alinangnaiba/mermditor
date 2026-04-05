import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Previewer } from 'pagedjs'
import { renderMermaidDiagrams } from '../utils/markdownItMermaid'
import { sanitizeHtml } from '../utils/sanitizer'
import {
  getPageStylesForPagedJS,
  getPrintMediaStyles,
  type MarginSize,
  type PageSize,
} from '../utils/printStyles'

const PRINT_CODE_LINES_CLASS = 'print-code-lines'
const PRINT_CODE_LINE_CLASS = 'print-code-line'

export const usePrintPreview = () => {
  const router = useRouter()
  const content = ref('')
  const loading = ref(true)
  const previewContainer = ref<HTMLElement | null>(null)
  const pageSize = ref<PageSize>('A4')
  const margins = ref<MarginSize>('normal')

  let currentBlobUrl: string | null = null

  const createStylesheetBlobUrl = (): string => {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
    }

    const cssContent = getPageStylesForPagedJS(
      pageSize.value,
      margins.value,
      PRINT_CODE_LINES_CLASS,
      PRINT_CODE_LINE_CLASS
    )
    const blob = new Blob([cssContent], { type: 'text/css' })
    currentBlobUrl = URL.createObjectURL(blob)
    return currentBlobUrl
  }

  const injectPrintMediaStyles = (): void => {
    const existingStyle = document.getElementById('dynamic-print-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    const styleEl = document.createElement('style')
    styleEl.id = 'dynamic-print-styles'
    styleEl.textContent = getPrintMediaStyles(pageSize.value)
    document.head.appendChild(styleEl)
  }

  const loadContent = (): void => {
    if (!import.meta.client) return

    document.documentElement.classList.remove('dark')
    const storedContent = localStorage.getItem('mermditor-print-content')
    if (storedContent) {
      content.value = sanitizeHtml(storedContent)
      return
    }

    router.push('/editor')
  }

  const normalizeCodeBlocksForPrint = (root: Element | Document): void => {
    const codeBlocks = root.querySelectorAll('pre code')

    for (const codeBlock of codeBlocks) {
      if (codeBlock.classList.contains('language-mermaid')) {
        continue
      }

      if (codeBlock.classList.contains(PRINT_CODE_LINES_CLASS)) {
        continue
      }

      const rawText = codeBlock.textContent
      if (!rawText) {
        continue
      }

      const lines = rawText.replace(/\r\n?/g, '\n').split('\n')
      const fragment = document.createDocumentFragment()

      for (const line of lines) {
        const lineElement = document.createElement('span')
        lineElement.className = PRINT_CODE_LINE_CLASS
        lineElement.textContent = line.length > 0 ? line : '\u00a0'
        fragment.appendChild(lineElement)
      }

      codeBlock.textContent = ''
      codeBlock.classList.add(PRINT_CODE_LINES_CLASS)
      codeBlock.appendChild(fragment)
    }
  }

  const initializePreview = async (): Promise<void> => {
    if (!import.meta.client) return

    injectPrintMediaStyles()
    await nextTick()

    await renderMermaidDiagrams({
      theme: 'default',
      startOnLoad: false,
      htmlLabels: false,
      flowchart: { htmlLabels: false },
      themeVariables: {
        primaryColor: '#2563eb',
        primaryTextColor: '#111827',
        primaryBorderColor: '#e5e7eb',
        lineColor: '#374151',
        secondaryColor: '#f3f4f6',
        tertiaryColor: '#ffffff',
        background: '#ffffff',
        mainBkg: '#ffffff',
        secondBkg: '#f3f4f6',
        tertiaryBkg: '#e5e7eb',
      },
    })

    normalizeCodeBlocksForPrint(document.querySelector('#print-content') ?? document)

    const paged = new Previewer()
    const source = document.querySelector('#print-content')

    if (source && previewContainer.value) {
      previewContainer.value.innerHTML = ''
      paged.on('rendered', () => {
        loading.value = false
      })

      const stylesheetUrl = createStylesheetBlobUrl()
      await paged.preview(source.innerHTML, [stylesheetUrl], previewContainer.value)
    }
  }

  const reRenderPreview = async (): Promise<void> => {
    loading.value = true
    if (previewContainer.value) {
      previewContainer.value.innerHTML = ''
    }
    await initializePreview()
  }

  const handlePrint = (): void => {
    const timestamp = Date.now()
    const originalTitle = document.title
    document.title = `document - ${timestamp}`
    window.print()
    document.title = originalTitle
  }

  const close = (): void => {
    window.close()
    if (!window.closed) {
      router.back()
    }
  }

  onMounted(async () => {
    loadContent()
    setTimeout(() => {
      initializePreview()
    }, 500)
  })

  return {
    content,
    loading,
    previewContainer,
    pageSize,
    margins,
    reRenderPreview,
    handlePrint,
    close,
  }
}
