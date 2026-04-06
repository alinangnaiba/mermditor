import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import type { EditorView as EditorViewType } from '@codemirror/view'

const {
  renderMarkdownFragmentMock,
  createMermaidPreviewHtmlMock,
  renderMermaidDiagramsMock,
  highlightSyntaxMock,
  clearMermaidCacheMock,
  updatePreviewSectionsMock,
  getMermaidThemeConfigMock,
  getMermaidSourceSignatureMock,
} = vi.hoisted(() => ({
  renderMarkdownFragmentMock: vi.fn(async () => '<p>rendered</p>'),
  createMermaidPreviewHtmlMock: vi.fn(() => '<div class="mermaid"></div>'),
  renderMermaidDiagramsMock: vi.fn(async () => {}),
  highlightSyntaxMock: vi.fn(async () => {}),
  clearMermaidCacheMock: vi.fn(),
  updatePreviewSectionsMock: vi.fn(async () => []),
  getMermaidThemeConfigMock: vi.fn(() => ({ cacheKey: 'dark' as const })),
  getMermaidSourceSignatureMock: vi.fn((content: string) => {
    const mermaidBlocks = Array.from(
      content.matchAll(/```mermaid[^\S\r\n]*\r?\n([\s\S]*?)```/g),
      (match) => (match[1] ?? '').trim()
    )

    return mermaidBlocks.join('\n\n@@mermaid-block@@\n\n')
  }),
}))

vi.mock('../../app/utils/codeBlockInteractions', () => ({
  attachCodeBlockInteractions: vi.fn(() => () => {}),
}))

vi.mock('../../utils/logging', () => ({
  logError: vi.fn(),
}))

vi.mock('../../app/utils/previewSectionRenderer', () => ({
  updatePreviewSections: updatePreviewSectionsMock,
}))

vi.mock('../../app/composables/useMarkdownRenderer', () => ({
  useMarkdownRenderer: () => ({
    renderMarkdownFragment: renderMarkdownFragmentMock,
    createMermaidPreviewHtml: createMermaidPreviewHtmlMock,
    renderMermaidDiagrams: renderMermaidDiagramsMock,
    highlightSyntax: highlightSyntaxMock,
    clearMermaidCache: clearMermaidCacheMock,
  }),
}))

vi.mock('../../app/utils/markdownItMermaid', () => ({
  cleanupMermaidControls: vi.fn(),
  getMermaidSourceSignature: getMermaidSourceSignatureMock,
  getMermaidThemeConfig: getMermaidThemeConfigMock,
  splitMarkdownIntoPreviewSections: vi.fn((content: string) => [
    {
      kind: 'markdown',
      key: 'markdown:0',
      source: content,
    },
  ]),
}))

import { useEditorPreview } from '../../app/composables/useEditorPreview'

const flushPromises = async (): Promise<void> => {
  await Promise.resolve()
  await Promise.resolve()
}

describe('useEditorPreview scheduling', () => {
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame
  const originalCancelAnimationFrame = globalThis.cancelAnimationFrame
  const originalRequestIdleCallback = window.requestIdleCallback
  const originalCancelIdleCallback = window.cancelIdleCallback

  beforeEach(() => {
    vi.useFakeTimers()
    renderMarkdownFragmentMock.mockClear()
    createMermaidPreviewHtmlMock.mockClear()
    renderMermaidDiagramsMock.mockClear()
    highlightSyntaxMock.mockClear()
    clearMermaidCacheMock.mockClear()
    updatePreviewSectionsMock.mockClear()
    getMermaidThemeConfigMock.mockClear()
    getMermaidSourceSignatureMock.mockClear()

    globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) =>
      setTimeout(() => callback(0), 0)) as typeof requestAnimationFrame
    globalThis.cancelAnimationFrame = ((handle: number) =>
      clearTimeout(handle)) as typeof cancelAnimationFrame
    window.requestIdleCallback = ((callback: IdleRequestCallback) =>
      setTimeout(
        () =>
          callback({
            didTimeout: false,
            timeRemaining: () => 16,
          }),
        0
      )) as typeof window.requestIdleCallback
    window.cancelIdleCallback = ((handle: number) =>
      clearTimeout(handle)) as typeof window.cancelIdleCallback
  })

  afterEach(() => {
    vi.useRealTimers()
    globalThis.requestAnimationFrame = originalRequestAnimationFrame
    globalThis.cancelAnimationFrame = originalCancelAnimationFrame
    window.requestIdleCallback = originalRequestIdleCallback
    window.cancelIdleCallback = originalCancelIdleCallback
  })

  it('runs non-mermaid preview updates on the next frame when mermaid source is unchanged', async () => {
    const preview = useEditorPreview({
      editorViewRef: ref(null as EditorViewType | null),
      previewContainer: ref(document.createElement('div')),
      previewContentRoot: ref(document.createElement('div')),
      editorTheme: ref('dark'),
    })

    await preview.refreshPreview(`Before

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\``)
    updatePreviewSectionsMock.mockClear()

    preview.schedulePreviewRefresh(`After

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\``)

    expect(updatePreviewSectionsMock).not.toHaveBeenCalled()

    await vi.runOnlyPendingTimersAsync()
    await flushPromises()

    expect(updatePreviewSectionsMock).toHaveBeenCalledTimes(1)
  })

  it('keeps mermaid-changing updates on the deferred path', async () => {
    const preview = useEditorPreview({
      editorViewRef: ref(null as EditorViewType | null),
      previewContainer: ref(document.createElement('div')),
      previewContentRoot: ref(document.createElement('div')),
      editorTheme: ref('dark'),
    })

    await preview.refreshPreview(`Before

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\``)
    updatePreviewSectionsMock.mockClear()

    preview.schedulePreviewRefresh(`Before

\`\`\`mermaid
flowchart TD
  A-->C
\`\`\``)

    expect(updatePreviewSectionsMock).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(50)
    await flushPromises()
    expect(updatePreviewSectionsMock).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()
    await flushPromises()

    expect(updatePreviewSectionsMock).toHaveBeenCalledTimes(1)
  })
})
