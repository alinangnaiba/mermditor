import { useMarkdownRenderer } from './useMarkdownRenderer'
import { getMermaidThemeConfig } from '../utils/markdownItMermaid'
import { buildHtmlExport } from '../utils/htmlExportTemplate'
import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'
import { logError } from '../../utils/logging'

const STRIP_SELECTORS = ['.mermaid-controls', '.code-block-actions', '.code-block-wrap']

const extractTitle = (markdown: string): string => {
  const match = markdown.match(/^#{1,6}\s+(.+)/m)
  return match ? match[1].replace(/[*_`~]/g, '').trim() : 'document'
}

const stripInteractiveElements = (root: HTMLElement): void => {
  for (const selector of STRIP_SELECTORS) {
    root.querySelectorAll(selector).forEach((el) => el.remove())
  }
}

export const useHtmlExport = () => {
  const { renderMarkdown, renderMermaidDiagrams, highlightSyntax } = useMarkdownRenderer()

  const exportToHtml = async (markdownContent: string, filename: string): Promise<void> => {
    if (!import.meta.client) return

    try {
      const html = await renderMarkdown(markdownContent)

      const scratch = document.createElement('div')
      scratch.style.cssText = 'position:absolute;left:-9999px;visibility:hidden'
      document.body.appendChild(scratch)
      scratch.innerHTML = html

      const mermaidConfig = getMermaidThemeConfig('light')
      await renderMermaidDiagrams(
        {
          ...mermaidConfig,
          themeVariables: {
            primaryColor: '#dbeafe',
            primaryTextColor: '#1e3a5f',
            primaryBorderColor: '#93c5fd',
            lineColor: '#64748b',
            secondaryColor: '#f0f9ff',
            tertiaryColor: '#f8fafc',
            background: '#fff',
            mainBkg: '#fff',
            secondBkg: '#f0f9ff',
            tertiaryBkg: '#f8fafc',
          },
        },
        scratch
      )

      await highlightSyntax(scratch)
      attachCodeBlockInteractions(scratch)
      stripInteractiveElements(scratch)

      document.body.removeChild(scratch)

      const title = extractTitle(markdownContent)
      const exportHtml = buildHtmlExport(scratch.innerHTML, title)

      const blob = new Blob([exportHtml], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}.html`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      logError('html.export', error, { contentPreview: markdownContent.slice(0, 160) })
      alert('Failed to export as HTML.')
    }
  }

  return { exportToHtml }
}
