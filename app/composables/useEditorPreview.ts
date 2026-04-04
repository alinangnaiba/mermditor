import { computed, nextTick, ref } from 'vue'
import type { Ref } from 'vue'
import type { EditorView as EditorViewType } from '@codemirror/view'
import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'
import { getMermaidThemeConfig } from '../utils/markdownItMermaid'
import { useMarkdownRenderer } from './useMarkdownRenderer'
import type { EditorTheme } from './editorTypes'

interface UseEditorPreviewOptions {
  editorViewRef: Ref<EditorViewType | null>
  previewContainer: Ref<HTMLElement | null>
  editorTheme: Ref<EditorTheme>
}

export const useEditorPreview = ({
  editorViewRef,
  previewContainer,
  editorTheme,
}: UseEditorPreviewOptions) => {
  const renderedContent = ref('')
  const previewProseClass = computed(() =>
    editorTheme.value === 'light' ? 'prose max-w-none' : 'prose prose-invert max-w-none'
  )

  const { renderMarkdown, renderMermaidDiagrams, highlightSyntax, clearMermaidCache } =
    useMarkdownRenderer()

  let mermaidTimeout: ReturnType<typeof setTimeout> | null = null
  let cleanupCodeBlockInteractions: (() => void) | null = null
  let cleanupScrollSync: (() => void) | null = null

  const debouncedMermaidRender = (): Promise<void> => {
    if (mermaidTimeout) {
      clearTimeout(mermaidTimeout)
    }

    return new Promise((resolve) => {
      mermaidTimeout = setTimeout(async () => {
        await renderMermaidDiagrams(getMermaidThemeConfig(editorTheme.value))
        resolve()
      }, 300)
    })
  }

  const refreshPreview = async (nextContent: string): Promise<void> => {
    renderedContent.value = await renderMarkdown(nextContent)
    await nextTick()
    await debouncedMermaidRender()
    await highlightSyntax()
  }

  const setupScrollSync = (): void => {
    if (!editorViewRef.value || !previewContainer.value) return

    cleanupScrollSync?.()

    let isEditorScrolling = false
    let isPreviewScrolling = false

    const editorScrollHandler = (): void => {
      if (isPreviewScrolling || !previewContainer.value || !editorViewRef.value) return

      isEditorScrolling = true

      const editorElement = editorViewRef.value.scrollDOM
      const scrollPercentage =
        editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight || 1)

      const previewElement = previewContainer.value
      const maxScrollTop = previewElement.scrollHeight - previewElement.clientHeight
      previewElement.scrollTop = scrollPercentage * maxScrollTop

      requestAnimationFrame(() => {
        isEditorScrolling = false
      })
    }

    const previewScrollHandler = (): void => {
      if (isEditorScrolling || !previewContainer.value || !editorViewRef.value) return

      isPreviewScrolling = true

      const previewElement = previewContainer.value
      const scrollPercentage =
        previewElement.scrollTop / (previewElement.scrollHeight - previewElement.clientHeight || 1)

      const editorElement = editorViewRef.value.scrollDOM
      const maxScrollTop = editorElement.scrollHeight - editorElement.clientHeight
      editorElement.scrollTop = scrollPercentage * maxScrollTop

      requestAnimationFrame(() => {
        isPreviewScrolling = false
      })
    }

    editorViewRef.value.scrollDOM.addEventListener('scroll', editorScrollHandler)
    previewContainer.value.addEventListener('scroll', previewScrollHandler)

    cleanupScrollSync = () => {
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
    await refreshPreview(content)
  }

  const cleanup = (): void => {
    if (mermaidTimeout) {
      clearTimeout(mermaidTimeout)
    }
    cleanupScrollSync?.()
    cleanupCodeBlockInteractions?.()
  }

  return {
    renderedContent,
    previewProseClass,
    refreshPreview,
    setupScrollSync,
    attachPreviewInteractions,
    handleThemeChange,
    cleanup,
  }
}
