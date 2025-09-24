import { EditorView } from '@codemirror/view'
import type { Ref } from 'vue'

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
      selection: { anchor: from, head: from + 4 }, // Select "Term"
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

  // Import/Export functionality
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

  const saveContent = (): void => {
    try {
      localStorage.setItem('mermditor-content', content.value)
      localStorage.setItem('mermditor-autosave', autosave.value.toString())
      lastSaved.value = new Date().toLocaleTimeString()
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
    saveContent,
  }
}
