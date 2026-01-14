import { EditorView } from '@codemirror/view'
import type { Ref } from 'vue'
import mermaid from 'mermaid'
import { darkThemeVariables } from '../utils/markdownItMermaid'

export interface EditorActions {
  insertFormat: (before: string, after: string) => void
  insertHeading: (level: number) => void
  insertList: (marker: string) => void
  insertCodeBlock: () => void
  insertBlockquote: () => void
  insertFootnote: () => void
  insertDefinitionList: () => void
  insertTaskList: () => void
  insertEmoji: (emoji: string) => void
  insertHighlight: () => void
  insertSubscript: () => void
  insertSuperscript: () => void
  importMarkdownFile: () => void
  exportMarkdownFile: () => void
  exportPdfFile: () => void
  saveAsMarkdownFile: (filename: string) => void
  saveContent: () => void
}

export const useEditorActions = (
  editorView: Ref<EditorView | null>,
  content: Ref<string>,
  autosave: Ref<boolean>,
  lastSaved: Ref<string>
): EditorActions => {
  const insertFormat = (before: string, after: string): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from, to } = state.selection.main
    const selectedText = state.doc.sliceString(from, to)

    const newText = before + selectedText + after

    editorView.value.dispatch({
      changes: { from, to, insert: newText },
      selection: { anchor: from + before.length, head: from + before.length + selectedText.length },
    })

    editorView.value.focus()
  }

  const insertHeading = (level: number): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from } = state.selection.main
    const line = state.doc.lineAt(from)

    const headingText = '#'.repeat(level) + ' '

    editorView.value.dispatch({
      changes: { from: line.from, to: line.from, insert: headingText },
      selection: { anchor: line.from + headingText.length, head: line.from + headingText.length },
    })

    editorView.value.focus()
  }

  const insertList = (marker: string): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from } = state.selection.main
    const line = state.doc.lineAt(from)

    const listText = marker + ' '

    editorView.value.dispatch({
      changes: { from: line.from, to: line.from, insert: listText },
      selection: { anchor: line.from + listText.length, head: line.from + listText.length },
    })

    editorView.value.focus()
  }

  const insertCodeBlock = (): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from, to } = state.selection.main
    const selectedText = state.doc.sliceString(from, to)

    const codeBlock = `\`\`\`\n${selectedText}\n\`\`\`\n`

    editorView.value.dispatch({
      changes: { from, to, insert: codeBlock },
      selection: { anchor: from + 4, head: from + 4 }, // Position cursor after ```
    })

    editorView.value.focus()
  }

  const insertBlockquote = (): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from } = state.selection.main
    const line = state.doc.lineAt(from)

    const blockquoteText = '> '

    editorView.value.dispatch({
      changes: { from: line.from, to: line.from, insert: blockquoteText },
      selection: {
        anchor: line.from + blockquoteText.length,
        head: line.from + blockquoteText.length,
      },
    })

    editorView.value.focus()
  }

  // Extended Markdown Syntax
  const insertFootnote = (): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from, to } = state.selection.main
    const selectedText = state.doc.sliceString(from, to) || 'footnote'

    const footnoteId = Math.random().toString(36).substring(2, 8)
    const footnoteRef = `[^${footnoteId}]`
    const footnoteDefinition = `\n\n[^${footnoteId}]: ${selectedText}`

    editorView.value.dispatch({
      changes: [
        { from, to, insert: footnoteRef },
        { from: state.doc.length, insert: footnoteDefinition },
      ],
      selection: { anchor: from + footnoteRef.length },
    })

    editorView.value.focus()
  }

  const insertDefinitionList = (): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from } = state.selection.main

    const definitionList = `Term\n: Definition\n`

    editorView.value.dispatch({
      changes: { from, insert: definitionList },
      selection: { anchor: from, head: from + 4 },
    })

    editorView.value.focus()
  }

  const insertTaskList = (): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from } = state.selection.main
    const line = state.doc.lineAt(from)

    const taskText = '- [ ] '

    editorView.value.dispatch({
      changes: { from: line.from, to: line.from, insert: taskText },
      selection: { anchor: line.from + taskText.length, head: line.from + taskText.length },
    })

    editorView.value.focus()
  }

  const insertEmoji = (emoji: string): void => {
    if (!editorView.value) return

    const { state } = editorView.value
    const { from, to } = state.selection.main

    editorView.value.dispatch({
      changes: { from, to, insert: emoji },
      selection: { anchor: from + emoji.length },
    })

    editorView.value.focus()
  }

  const insertHighlight = (): void => {
    insertFormat('==', '==')
  }

  const insertSubscript = (): void => {
    insertFormat('~', '~')
  }

  const insertSuperscript = (): void => {
    insertFormat('^', '^')
  }

  const importMarkdownFile = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result
        if (typeof result !== 'string') return

        const markdown = result as string
        if (editorView.value) {
          const { state } = editorView.value
          editorView.value.dispatch({
            changes: { from: 0, to: state.doc.length, insert: markdown },
          })
          content.value = markdown
          editorView.value.focus()
        }
      }

      reader.readAsText(file, 'utf-8')
    }

    input.click()
  }

  const exportMarkdownFile = (): void => {
    const markdown = content.value
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `document-${new Date().toISOString().split('T')[0]}.md`
    link.click()

    URL.revokeObjectURL(url)
  }

  const saveAsMarkdownFile = (filename: string): void => {
    const markdown = content.value
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.md`
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportPdfFile = async (): Promise<void> => {
    try {
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default

      const element = document.querySelector('.prose')
      if (!element) return

      // Create a container for the cloned content to control styling for PDF
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = '210mm' // A4 width approx
      container.style.backgroundColor = '#ffffff'
      container.style.color = '#000000'
      // Remove max-width constraint for the PDF container to use full A4 width
      container.style.maxWidth = 'none'

      // Clone the content
      const clone = element.cloneNode(true) as HTMLElement

      // Transform styling for light mode PDF
      clone.classList.remove('prose-invert')
      clone.classList.add('prose', 'prose-pdf')
      clone.style.maxWidth = 'none'

      // Remove any dark mode specific styles that might persist
      clone.style.backgroundColor = '#ffffff'
      clone.style.color = '#000000'
      clone.style.padding = '20px'

      // Handle Mermaid diagrams - Re-render in light mode
      const mermaidElements = clone.querySelectorAll('.mermaid')
      if (mermaidElements.length > 0) {
        // Switch to light theme for rendering
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          themeVariables: {},
        })

        for (const el of mermaidElements) {
          const content = el.getAttribute('data-content')
          if (content) {
            try {
              const id = 'mermaid-pdf-' + Math.random().toString(36).substring(2, 11)
              const { svg } = await mermaid.render(id, content)
              el.innerHTML = svg
              // Ensure SVG fits
              const svgEl = el.querySelector('svg')
              if (svgEl) {
                svgEl.style.maxWidth = '100%'
                svgEl.style.height = 'auto'
                svgEl.style.backgroundColor = '#ffffff'
              }
            } catch (err) {
              console.warn('Failed to re-render mermaid for PDF:', err)
            }
          }
        }

        // Restore dark theme for the app
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: darkThemeVariables,
        })
      }

      // Ensure content is visible
      container.appendChild(clone)
      document.body.appendChild(container)

      const opt = {
        margin: [10, 10],
        filename: `document-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      await html2pdf().set(opt).from(clone).save()

      // Cleanup
      document.body.removeChild(container)
    } catch (error) {
      console.error('PDF generation failed:', error)
      // Ensure we restore the theme even if something fails
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: darkThemeVariables,
        })
      } catch (e) {
        // ignore
      }
    }
  }

  const saveContent = (): void => {
    try {
      if (autosave.value) {
        localStorage.setItem('mermditor-content', content.value)
        localStorage.setItem('mermditor-autosave', autosave.value.toString())
        lastSaved.value = new Date().toLocaleTimeString()
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  return {
    insertFormat,
    insertHeading,
    insertList,
    insertCodeBlock,
    insertBlockquote,
    insertFootnote,
    insertDefinitionList,
    insertTaskList,
    insertEmoji,
    insertHighlight,
    insertSubscript,
    insertSuperscript,
    importMarkdownFile,
    exportMarkdownFile,
    exportPdfFile,
    saveAsMarkdownFile,
    saveContent,
  }
}
