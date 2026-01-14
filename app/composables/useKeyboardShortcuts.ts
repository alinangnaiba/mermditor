import { onMounted, onUnmounted } from 'vue'
import type { EditorActions } from './useEditorActions'

export const useKeyboardShortcuts = (actions: EditorActions) => {
  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase()

      switch (key) {
        case 'b':
          e.preventDefault()
          actions.insertFormat('**', '**')
          break
        case 'i':
          e.preventDefault()
          actions.insertFormat('*', '*') // Ctrl+I for italic
          break
        case 'm':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertFormat('![](', ')') // Ctrl+Shift+M for image
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
          e.preventDefault()
          actions.insertFormat('`', '`') // Ctrl+` for inline code
          break
        case '~':
          // Handle Ctrl+Shift+~
          e.preventDefault()
          actions.insertCodeBlock()
          break
        case 'u':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertSuperscript() // Ctrl+Shift+U for superscript
          }
          break
        case 'y':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertSubscript() // Ctrl+Shift+Y for subscript
          }
          break
        case 'h':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertHighlight() // Ctrl+Shift+H for highlight
          }
          break
        case 'l':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertTaskList() // Ctrl+Shift+L for task list
          }
          break
        case 'r':
          if (e.shiftKey) {
            e.preventDefault()
            actions.insertDefinitionList() // Ctrl+Shift+R for definition list
          }
          break
        case 'o':
          e.preventDefault()
          actions.importMarkdownFile() // Ctrl+O for open/import
          break
        case 's':
          if (e.shiftKey) {
            e.preventDefault()
            actions.exportMarkdownFile() // Ctrl+Shift+S for export
          } else {
            e.preventDefault()
            actions.saveContent() // Ctrl+S for save
          }
          break
        // Headings - these are safe as they're numbers
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
