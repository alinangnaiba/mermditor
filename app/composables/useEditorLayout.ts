import { nextTick, ref } from 'vue'
import { logError } from '../../utils/logging'

const EDITOR_WIDTH_STORAGE_KEY = 'mermditor-editor-width'
const PREVIEW_WIDTH_STORAGE_KEY = 'mermditor-preview-width'
const WORKSPACE_WIDTH_STORAGE_KEY = 'mermditor-workspace-width'

const MOBILE_BREAKPOINT = 640
const DEFAULT_WORKSPACE_WIDTH = 258
const WORKSPACE_WIDTH_MIN = 160
const WORKSPACE_WIDTH_MAX = 480
const PANE_WIDTH_MIN_PERCENT = 20
const PANE_WIDTH_MAX_PERCENT = 80

const parseStoredNumber = (value: string, fallback: number): number => {
  const n = parseFloat(value)
  return isNaN(n) ? fallback : n
}

export const useEditorLayout = () => {
  const isMobile = ref(false)
  const showEditor = ref(true)
  const showPreview = ref(true)
  const customEditorWidth = ref<number | null>(null)
  const customPreviewWidth = ref<number | null>(null)
  const customWorkspaceWidth = ref(DEFAULT_WORKSPACE_WIDTH)

  const checkMobile = (): void => {
    if (!import.meta.client) return

    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }

  const applyPaneWidths = (): void => {
    if (!import.meta.client) return

    const editorPane = document.querySelector('.editor-pane') as HTMLElement | null
    const previewPane = document.querySelector('.preview-pane') as HTMLElement | null

    if (
      showEditor.value &&
      showPreview.value &&
      customEditorWidth.value !== null &&
      customPreviewWidth.value !== null
    ) {
      if (editorPane) {
        editorPane.style.width = `${customEditorWidth.value}%`
      }
      if (previewPane) {
        previewPane.style.width = `${customPreviewWidth.value}%`
      }
      return
    }

    if (editorPane) {
      editorPane.style.width = ''
    }
    if (previewPane) {
      previewPane.style.width = ''
    }
  }

  const savePaneWidths = (): void => {
    try {
      if (customEditorWidth.value !== null && customPreviewWidth.value !== null) {
        localStorage.setItem(EDITOR_WIDTH_STORAGE_KEY, customEditorWidth.value.toString())
        localStorage.setItem(PREVIEW_WIDTH_STORAGE_KEY, customPreviewWidth.value.toString())
      }
    } catch (error) {
      logError('layout.savePaneWidths', error)
    }
  }

  const loadPaneWidths = (): void => {
    try {
      const savedEditorWidth = localStorage.getItem(EDITOR_WIDTH_STORAGE_KEY)
      const savedPreviewWidth = localStorage.getItem(PREVIEW_WIDTH_STORAGE_KEY)

      if (savedEditorWidth && savedPreviewWidth) {
        customEditorWidth.value = parseStoredNumber(savedEditorWidth, 50)
        customPreviewWidth.value = parseStoredNumber(savedPreviewWidth, 50)
      }
    } catch (error) {
      logError('layout.loadPaneWidths', error)
    }
  }

  const loadWorkspaceWidth = (): void => {
    try {
      const savedWorkspaceWidth = localStorage.getItem(WORKSPACE_WIDTH_STORAGE_KEY)
      if (savedWorkspaceWidth) {
        customWorkspaceWidth.value = parseStoredNumber(savedWorkspaceWidth, DEFAULT_WORKSPACE_WIDTH)
      }
    } catch (error) {
      logError('layout.loadWorkspaceWidth', error)
    }
  }

  const togglePreview = (): void => {
    showPreview.value = !showPreview.value
    if (!showPreview.value && !showEditor.value) {
      showEditor.value = true
    }

    nextTick(() => applyPaneWidths())
  }

  const toggleEditor = (): void => {
    showEditor.value = !showEditor.value
    if (!showEditor.value && !showPreview.value) {
      showPreview.value = true
    }

    nextTick(() => applyPaneWidths())
  }

  const startResize = (event: MouseEvent): void => {
    event.preventDefault()

    const startX = event.clientX
    const editorPane = document.querySelector('.editor-pane') as HTMLElement | null
    const previewPane = document.querySelector('.preview-pane') as HTMLElement | null

    if (!editorPane || !previewPane || !editorPane.parentElement) return

    const startEditorWidth = editorPane.offsetWidth
    const containerWidth = editorPane.parentElement.offsetWidth

    const handleMouseMove = (nextEvent: MouseEvent): void => {
      const deltaX = nextEvent.clientX - startX
      const newEditorWidth = startEditorWidth + deltaX
      const newEditorPercent = (newEditorWidth / containerWidth) * 100

      if (newEditorPercent >= PANE_WIDTH_MIN_PERCENT && newEditorPercent <= PANE_WIDTH_MAX_PERCENT) {
        editorPane.style.width = `${newEditorPercent}%`
        previewPane.style.width = `${100 - newEditorPercent}%`
      }
    }

    const handleMouseUp = (): void => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      const editorPercent = (editorPane.offsetWidth / containerWidth) * 100
      customEditorWidth.value = editorPercent
      customPreviewWidth.value = 100 - editorPercent
      savePaneWidths()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const startWorkspaceResize = (event: MouseEvent): void => {
    event.preventDefault()

    const startX = event.clientX
    const startWidth = customWorkspaceWidth.value

    const handleMouseMove = (nextEvent: MouseEvent): void => {
      customWorkspaceWidth.value = Math.min(
        Math.max(startWidth + (nextEvent.clientX - startX), WORKSPACE_WIDTH_MIN),
        WORKSPACE_WIDTH_MAX
      )
    }

    const handleMouseUp = (): void => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      try {
        localStorage.setItem(WORKSPACE_WIDTH_STORAGE_KEY, customWorkspaceWidth.value.toString())
      } catch (error) {
        logError('layout.saveWorkspaceWidth', error)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const clearStoredLayout = (): void => {
    try {
      localStorage.removeItem(EDITOR_WIDTH_STORAGE_KEY)
      localStorage.removeItem(PREVIEW_WIDTH_STORAGE_KEY)
      localStorage.removeItem(WORKSPACE_WIDTH_STORAGE_KEY)
    } catch {
      /* ignore storage errors */
    }
  }

  const resetLayoutState = (): void => {
    showEditor.value = true
    showPreview.value = true
    customEditorWidth.value = null
    customPreviewWidth.value = null
    customWorkspaceWidth.value = DEFAULT_WORKSPACE_WIDTH
    nextTick(() => applyPaneWidths())
  }

  return {
    isMobile,
    showEditor,
    showPreview,
    customEditorWidth,
    customPreviewWidth,
    customWorkspaceWidth,
    checkMobile,
    applyPaneWidths,
    loadPaneWidths,
    loadWorkspaceWidth,
    togglePreview,
    toggleEditor,
    startResize,
    startWorkspaceResize,
    clearStoredLayout,
    resetLayoutState,
  }
}
