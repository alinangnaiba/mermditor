import { useRouter } from 'vue-router'
import { useMarkdownRenderer } from './useMarkdownRenderer'

export const usePdfExport = () => {
  const router = useRouter()
  const { renderMarkdown } = useMarkdownRenderer()

  const exportToPdf = async (markdownContent: string) => {
    if (!import.meta.client) return

    try {
      // 1. Render Markdown to HTML
      const html = await renderMarkdown(markdownContent)

      // 2. Store HTML in localStorage for the preview page to pick up
      localStorage.setItem('mermditor-print-content', html)

      // 3. Open the print preview page in a new tab
      const url = router.resolve('/print-preview').href
      window.open(url, '_blank')
    } catch (error) {
      console.error('Failed to export PDF:', error)
      alert('Failed to prepare document for PDF export.')
    }
  }

  return {
    exportToPdf
  }
}
