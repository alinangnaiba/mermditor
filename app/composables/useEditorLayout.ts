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

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const parseFiniteNumber = (value: string | null): number | null => {
  if (!value) return null

  const parsedValue = Number.parseFloat(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

const normalizeStoredPaneWidths = (
  editorWidth: string | null,
  previewWidth: string | null
): { editor: number; preview: number } | null => {
  const storedEditor = parseFiniteNumber(editorWidth)
  const storedPreview = parseFiniteNumber(previewWidth)

  if (storedEditor !== null) {
    const editor = clamp(storedEditor, PANE_WIDTH_MIN_PERCENT, PANE_WIDTH_MAX_PERCENT)
    return { editor, preview: 100 - editor }
  }

  if (storedPreview !== null) {
    const preview = clamp(storedPreview, PANE_WIDTH_MIN_PERCENT, PANE_WIDTH_MAX_PERCENT)
    return { editor: 100 - preview, preview }
  }

  return null
}

export const useEditorLayout = () => {
  const isMobile = ref(false)
  const showEditor = ref(true)
  const showPreview = ref(true)
  const customEditorWidth = ref<number | null>(null)
  const customPreviewWidth = ref<number | null>(null)
  const customWorkspaceWidth = ref(DEFAULT_WORKSPACE_WIDTH)
  let cleanupPaneResize: (() => void) | null = null
  let cleanupWorkspaceResize: (() => void) | null = null

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
      const storedPaneWidths = normalizeStoredPaneWidths(savedEditorWidth, savedPreviewWidth)

      if (storedPaneWidths) {
        customEditorWidth.value = storedPaneWidths.editor
        customPreviewWidth.value = storedPaneWidths.preview
      }
    } catch (error) {
      logError('layout.loadPaneWidths', error)
    }
  }

  const loadWorkspaceWidth = (): void => {
    try {
      const savedWorkspaceWidth = localStorage.getItem(WORKSPACE_WIDTH_STORAGE_KEY)
      const storedWidth = parseFiniteNumber(savedWorkspaceWidth)

      if (storedWidth !== null) {
        customWorkspaceWidth.value = clamp(
          storedWidth,
          WORKSPACE_WIDTH_MIN,
          WORKSPACE_WIDTH_MAX
        )
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
    cleanupPaneResize?.()

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
      cleanupPaneResize?.()
      const editorPercent = (editorPane.offsetWidth / containerWidth) * 100
      customEditorWidth.value = clamp(editorPercent, PANE_WIDTH_MIN_PERCENT, PANE_WIDTH_MAX_PERCENT)
      customPreviewWidth.value = 100 - customEditorWidth.value
      savePaneWidths()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    cleanupPaneResize = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      cleanupPaneResize = null
    }
  }

  const startWorkspaceResize = (event: MouseEvent): void => {
    event.preventDefault()
    cleanupWorkspaceResize?.()

    const startX = event.clientX
    const startWidth = customWorkspaceWidth.value

    const handleMouseMove = (nextEvent: MouseEvent): void => {
      customWorkspaceWidth.value = Math.min(
        Math.max(startWidth + (nextEvent.clientX - startX), WORKSPACE_WIDTH_MIN),
        WORKSPACE_WIDTH_MAX
      )
    }

    const handleMouseUp = (): void => {
      cleanupWorkspaceResize?.()
      try {
        localStorage.setItem(WORKSPACE_WIDTH_STORAGE_KEY, customWorkspaceWidth.value.toString())
      } catch (error) {
        logError('layout.saveWorkspaceWidth', error)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    cleanupWorkspaceResize = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      cleanupWorkspaceResize = null
    }
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

  const cleanup = (): void => {
    cleanupPaneResize?.()
    cleanupWorkspaceResize?.()
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
    cleanup,
  }
}
