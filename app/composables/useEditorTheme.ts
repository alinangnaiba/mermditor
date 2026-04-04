import { ref } from 'vue'
import type { Compartment, Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import type { EditorTheme } from './editorTypes'

type EditorThemeRuntime = {
  EditorView: typeof import('@codemirror/view').EditorView
  oneDark: Extension
}

const EDITOR_THEME_STORAGE_KEY = 'mermditor-editor-theme'

export const useEditorTheme = () => {
  let editorThemeCompartment: Compartment | null = null
  let editorThemeRuntime: EditorThemeRuntime | null = null

  const loadInitialEditorTheme = (): EditorTheme => {
    if (!import.meta.client) {
      return 'dark'
    }

    try {
      const savedTheme = localStorage.getItem(EDITOR_THEME_STORAGE_KEY)
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }

      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  }

  const editorTheme = ref<EditorTheme>(loadInitialEditorTheme())

  const applyDocumentTheme = (theme: EditorTheme): void => {
    if (!import.meta.client) return

    document.documentElement.setAttribute('data-editor-theme', theme)
  }

  const clearDocumentTheme = (): void => {
    if (!import.meta.client) return

    document.documentElement.removeAttribute('data-editor-theme')
  }

  const persistEditorTheme = (theme: EditorTheme): void => {
    if (!import.meta.client) return

    try {
      localStorage.setItem(EDITOR_THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore storage errors */
    }
  }

  const setEditorThemeRuntime = (
    runtime: EditorThemeRuntime,
    compartment: Compartment
  ): void => {
    editorThemeRuntime = runtime
    editorThemeCompartment = compartment
  }

  const buildEditorThemeExtension = (theme: EditorTheme): Extension => {
    if (!editorThemeRuntime) {
      return []
    }

    const { EditorView, oneDark } = editorThemeRuntime
    const baseTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '14px',
      },
      '.cm-editor': {
        height: '100%',
      },
      '.cm-scroller': {
        height: '100%',
      },
      '.cm-content': {
        minHeight: '100%',
        padding: '16px',
      },
    })

    if (theme === 'dark') {
      return [oneDark, baseTheme]
    }

    const lightTheme = EditorView.theme({
      '&': {
        color: 'var(--text)',
        backgroundColor: 'var(--editor-canvas)',
      },
      '.cm-gutters': {
        color: 'var(--muted)',
        backgroundColor: 'var(--editor-canvas)',
        borderRight: '1px solid var(--border)',
      },
      '.cm-activeLine, .cm-activeLineGutter': {
        backgroundColor: 'var(--hover)',
      },
      '.cm-selectionBackground': {
        backgroundColor: 'var(--selection-bg)',
      },
      '&.cm-focused .cm-selectionBackground': {
        backgroundColor: 'var(--selection-bg)',
      },
      '&.cm-focused .cm-cursor': {
        borderLeftColor: 'var(--accent)',
      },
      '.cm-foldPlaceholder': {
        color: 'var(--muted)',
        backgroundColor: 'var(--raised)',
        border: '1px solid var(--border)',
      },
    })

    return [baseTheme, lightTheme]
  }

  const applyThemeToEditor = (editorView: EditorView | null, theme: EditorTheme): void => {
    if (!editorView || !editorThemeCompartment) return

    editorView.dispatch({
      effects: editorThemeCompartment.reconfigure(buildEditorThemeExtension(theme)),
    })
  }

  const toggleTheme = (): void => {
    editorTheme.value = editorTheme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    editorTheme,
    applyDocumentTheme,
    clearDocumentTheme,
    persistEditorTheme,
    setEditorThemeRuntime,
    buildEditorThemeExtension,
    applyThemeToEditor,
    toggleTheme,
  }
}
