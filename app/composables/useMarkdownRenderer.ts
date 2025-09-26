import { renderMarkdown } from '../utils/markdownItRenderer'
import {
  processMermaidInMarkdown,
  renderMermaidDiagrams,
  renderMermaidExample,
  clearMermaidCache,
  initMermaid,
} from '../utils/markdownItMermaid'
import { processLatex, renderLatexExample } from '../utils/markdownItKatex'
import { highlightSyntax } from '../utils/syntaxHighlighter'

export const useMarkdownRenderer = () => {
  const renderMarkdownContent = async (content: string): Promise<string> => {
    if (!content) return ''

    try {
      // Step 1: Render basic markdown with plugins
      let html = await renderMarkdown(content)

      // Step 2: Process Mermaid diagrams
      html = processMermaidInMarkdown(html)

      // Step 3: Process LaTeX math expressions
      html = await processLatex(html)

      return html
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return '<p class="text-red-400">Error rendering markdown</p>'
    }
  }

  // Standalone renderers for tool guide examples
  const renderMarkdownExample = async (content: string): Promise<string> => {
    if (!content) return ''

    try {
      const html = await renderMarkdown(content)
      return html
    } catch (error) {
      console.error('Example markdown rendering error:', error)
      return '<p class="text-red-400">Error rendering example</p>'
    }
  }

  return {
    renderMarkdown: renderMarkdownContent,
    renderMermaidDiagrams,
    initMermaid,
    clearMermaidCache,
    highlightSyntax,
    renderMarkdownExample,
    renderLatexExample,
    renderMermaidExample,
  }
}
