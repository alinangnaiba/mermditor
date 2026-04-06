import { computed } from 'vue'
import type { Ref } from 'vue'
import type { EditorView as EditorViewType } from '@codemirror/view'
import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'
import {
  cleanupMermaidControls,
  getMermaidSourceSignature,
  getMermaidThemeConfig,
  splitMarkdownIntoPreviewSections,
} from '../utils/markdownItMermaid'
import { logError } from '../../utils/logging'
import {
  updatePreviewSections,
  type PreviewSectionState,
} from '../utils/previewSectionRenderer'
import { useMarkdownRenderer } from './useMarkdownRenderer'
import type { EditorTheme } from './editorTypes'

interface UseEditorPreviewOptions {
  editorViewRef: Ref<EditorViewType | null>
  previewContainer: Ref<HTMLElement | null>
  previewContentRoot: Ref<HTMLElement | null>
  editorTheme: Ref<EditorTheme>
}

export const useEditorPreview = ({
  editorViewRef,
  previewContainer,
  previewContentRoot,
  editorTheme,
}: UseEditorPreviewOptions) => {
  const previewProseClass = computed(() =>
    editorTheme.value === 'light' ? 'prose max-w-none' : 'prose prose-invert max-w-none'
  )

  const {
    renderMarkdownFragment,
    createMermaidPreviewHtml,
    renderMermaidDiagrams,
    highlightSyntax,
    clearMermaidCache,
  } =
    useMarkdownRenderer()

  const PREVIEW_RENDER_DEBOUNCE_MS = 50
  const MERMAID_RENDER_DEBOUNCE_MS = 300

  let previewTimeout: ReturnType<typeof setTimeout> | null = null
  let previewAnimationFrame: number | null = null
  let previewIdleCallback: number | null = null
  let mermaidTimeout: ReturnType<typeof setTimeout> | null = null
  let mermaidResolve: (() => void) | null = null
  let cleanupCodeBlockInteractions: (() => void) | null = null
  let cleanupScrollSync: (() => void) | null = null
  let renderRequestId = 0
  let lastMermaidSourceSignature = ''
  let previewSections: PreviewSectionState[] = []

  const cancelScheduledPreviewWork = (): void => {
    if (previewTimeout) {
      clearTimeout(previewTimeout)
      previewTimeout = null
    }

    if (previewAnimationFrame !== null) {
      cancelAnimationFrame(previewAnimationFrame)
      previewAnimationFrame = null
    }

    if (previewIdleCallback !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(previewIdleCallback)
      previewIdleCallback = null
    }
  }

  const scheduleDeferredPreviewRun = (nextContent: string, requestId: number): void => {
    const runOnNextFrame = () => {
      previewAnimationFrame = requestAnimationFrame(() => {
        previewAnimationFrame = null
        void runPreviewRefresh(nextContent, requestId, {
          deferMermaidHydration: true,
        })
      })
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      previewIdleCallback = window.requestIdleCallback(
        () => {
          previewIdleCallback = null
          runOnNextFrame()
        },
        { timeout: 180 }
      )
      return
    }

    runOnNextFrame()
  }

  const scheduleNextFramePreviewRun = (nextContent: string, requestId: number): void => {
    previewAnimationFrame = requestAnimationFrame(() => {
      previewAnimationFrame = null
      void runPreviewRefresh(nextContent, requestId, {
        deferMermaidHydration: true,
      })
    })
  }

  const debouncedMermaidRender = (requestId: number): Promise<void> => {
    if (mermaidTimeout) {
      clearTimeout(mermaidTimeout)
      mermaidTimeout = null
      mermaidResolve?.()
      mermaidResolve = null
    }

    return new Promise((resolve) => {
      mermaidResolve = resolve
      mermaidTimeout = setTimeout(async () => {
        mermaidTimeout = null
        mermaidResolve = null

        if (requestId !== renderRequestId) {
          resolve()
          return
        }

        await renderMermaidDiagrams(
          getMermaidThemeConfig(editorTheme.value),
          previewContentRoot.value ?? document
        )
        resolve()
      }, MERMAID_RENDER_DEBOUNCE_MS)
    })
  }

  const runPreviewRefresh = async (
    nextContent: string,
    requestId: number,
    options?: { deferMermaidHydration?: boolean }
  ): Promise<void> => {
    const mermaidConfig = getMermaidThemeConfig(editorTheme.value)
    const previewRoot = previewContentRoot.value
    const deferMermaidHydration = options?.deferMermaidHydration ?? false

    try {
      if (!previewRoot) return

      const nextSections = splitMarkdownIntoPreviewSections(nextContent)
      if (requestId !== renderRequestId) return

      previewSections = await updatePreviewSections({
        contentRoot: previewRoot,
        nextSections,
        previousSections: previewSections,
        themeKey: mermaidConfig.cacheKey ?? 'dark',
        renderMarkdownSection: renderMarkdownFragment,
        renderMermaidSection: createMermaidPreviewHtml,
      })
      if (requestId !== renderRequestId) return
      lastMermaidSourceSignature = getMermaidSourceSignature(nextContent)

      if (previewRoot.querySelector('.mermaid:not([data-processed])')) {
        if (deferMermaidHydration) {
          await debouncedMermaidRender(requestId)
          if (requestId !== renderRequestId) return
        } else {
          await renderMermaidDiagrams(mermaidConfig, previewRoot)
        }
      }

      await highlightSyntax(previewRoot)
    } catch (error) {
      logError('editor.refreshPreview', error)
      if (previewRoot) {
        previewRoot.innerHTML = '<p class="render-error">Failed to render preview.</p>'
        previewSections = []
      }
    }
  }

  const refreshPreview = async (nextContent: string): Promise<void> => {
    cancelScheduledPreviewWork()

    const requestId = ++renderRequestId
    await runPreviewRefresh(nextContent, requestId)
  }

  const schedulePreviewRefresh = (nextContent: string): void => {
    cancelScheduledPreviewWork()

    const requestId = ++renderRequestId
    const nextMermaidSourceSignature = getMermaidSourceSignature(nextContent)

    if (nextMermaidSourceSignature === lastMermaidSourceSignature) {
      scheduleNextFramePreviewRun(nextContent, requestId)
      return
    }

    previewTimeout = setTimeout(() => {
      previewTimeout = null
      scheduleDeferredPreviewRun(nextContent, requestId)
    }, PREVIEW_RENDER_DEBOUNCE_MS)
  }

  const setupScrollSync = (): void => {
    if (!editorViewRef.value || !previewContainer.value) return

    cleanupScrollSync?.()

    let syncFrame: number | null = null
    let sourcePendingSync: 'editor' | 'preview' | null = null
    let ignoreSource: 'editor' | 'preview' | null = null

    const releaseIgnoreSource = (): void => {
      requestAnimationFrame(() => {
        ignoreSource = null
      })
    }

    const syncScrollPosition = (source: 'editor' | 'preview'): void => {
      if (!previewContainer.value || !editorViewRef.value) return

      const editorElement = editorViewRef.value.scrollDOM
      const previewElement = previewContainer.value

      if (source === 'editor') {
        const scrollPercentage =
          editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight || 1)

        const maxScrollTop = previewElement.scrollHeight - previewElement.clientHeight
        ignoreSource = 'preview'
        previewElement.scrollTop = scrollPercentage * maxScrollTop
        releaseIgnoreSource()
        return
      }

      const scrollPercentage =
        previewElement.scrollTop / (previewElement.scrollHeight - previewElement.clientHeight || 1)

      const maxScrollTop = editorElement.scrollHeight - editorElement.clientHeight
      ignoreSource = 'editor'
      editorElement.scrollTop = scrollPercentage * maxScrollTop
      releaseIgnoreSource()
    }

    const scheduleScrollSync = (source: 'editor' | 'preview'): void => {
      sourcePendingSync = source

      if (syncFrame !== null) {
        return
      }

      syncFrame = requestAnimationFrame(() => {
        syncFrame = null

        if (!sourcePendingSync) return

        const sourceToSync = sourcePendingSync
        sourcePendingSync = null
        syncScrollPosition(sourceToSync)
      })
    }

    const editorScrollHandler = (): void => {
      if (ignoreSource === 'editor') return
      scheduleScrollSync('editor')
    }

    const previewScrollHandler = (): void => {
      if (ignoreSource === 'preview') return
      scheduleScrollSync('preview')
    }

    editorViewRef.value.scrollDOM.addEventListener('scroll', editorScrollHandler, { passive: true })
    previewContainer.value.addEventListener('scroll', previewScrollHandler, { passive: true })

    cleanupScrollSync = () => {
      if (syncFrame !== null) {
        cancelAnimationFrame(syncFrame)
      }
      editorViewRef.value?.scrollDOM.removeEventListener('scroll', editorScrollHandler)
      previewContainer.value?.removeEventListener('scroll', previewScrollHandler)
    }
  }

  const attachPreviewInteractions = (): void => {
    cleanupCodeBlockInteractions?.()

    if (previewContainer.value) {
      cleanupCodeBlockInteractions = attachCodeBlockInteractions(previewContainer.value)
    }
  }

  const handleThemeChange = async (content: string): Promise<void> => {
    clearMermaidCache()
    lastMermaidSourceSignature = ''
    previewSections = []
    await refreshPreview(content)
  }

  const cleanup = (): void => {
    cancelScheduledPreviewWork()
    if (mermaidTimeout) {
      clearTimeout(mermaidTimeout)
    }
    if (previewContainer.value) {
      cleanupMermaidControls(previewContainer.value)
    }
    lastMermaidSourceSignature = ''
    previewSections = []
    cleanupScrollSync?.()
    cleanupCodeBlockInteractions?.()
  }

  return {
    previewProseClass,
    refreshPreview,
    schedulePreviewRefresh,
    setupScrollSync,
    attachPreviewInteractions,
    handleThemeChange,
    cleanup,
  }
}
