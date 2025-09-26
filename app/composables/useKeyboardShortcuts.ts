import { onMounted, onUnmounted } from 'vue'
import type { EditorActions } from './useEditorActions'

export const useKeyboardShortcuts = (actions: EditorActions) => {
  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          actions.insertFormat('**', '**')
          break
        case 'i':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertFormat('![](', ')') // Ctrl+Shift+I for image
          } else {
            e.preventDefault()
            actions.insertFormat('*', '*') // Ctrl+I for italic
          }
          break
        case 'k':
          e.preventDefault()
          actions.insertFormat('[](', ')') // Ctrl+K for link
          break
        case 'q':
          e.preventDefault()
          actions.insertBlockquote() // Ctrl+Q for blockquote
          break
        case '`':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertCodeBlock() // Ctrl+Shift+` for code block
          } else {
            e.preventDefault()
            actions.insertFormat('`', '`') // Ctrl+` for inline code
          }
          break
        case 'h':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertHighlight() // Ctrl+Shift+H for highlight
          }
          break
        case 'f':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertFootnote() // Ctrl+Shift+F for footnote
          }
          break
        case 't':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertTaskList() // Ctrl+Shift+T for task list
          }
          break
        case 'd':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertDefinitionList() // Ctrl+Shift+D for definition list
          }
          break
        case '=':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertSuperscript() // Ctrl+Shift+= for superscript
          }
          break
        case '-':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertSubscript() // Ctrl+Shift+- for subscript
          }
          break
        case 'o':
          e.preventDefault()
          actions.importMarkdownFile() // Ctrl+O for open/import
          break
        case 's':
          if (e.shiftKey) {
            e.preventDefault()
            actions.exportMarkdownFile() // Ctrl+Shift+S for save as/export
          } else {
            e.preventDefault()
            actions.saveContent() // Ctrl+S for save
          }
          break
        // Headings
        case '1':
          e.preventDefault()
          actions.insertHeading(1)
          break
        case '2':
          e.preventDefault()
          actions.insertHeading(2)
          break
        case '3':
          e.preventDefault()
          actions.insertHeading(3)
          break
        case '4':
          e.preventDefault()
          actions.insertHeading(4)
          break
        case '5':
          e.preventDefault()
          actions.insertHeading(5)
          break
        case '6':
          e.preventDefault()
          actions.insertHeading(6)
          break
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    handleKeydown,
  }
}
