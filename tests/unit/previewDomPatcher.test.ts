import { beforeEach, describe, expect, it, vi } from 'vitest'

const mermaidInitializeMock = vi.fn()
const mermaidRenderMock = vi.fn(async (id: string, content: string) => ({
  svg: `<svg id="${id}" xmlns="http://www.w3.org/2000/svg"><title>${content}</title><circle cx="10" cy="10" r="5"></circle></svg>`,
}))

vi.mock('mermaid', () => ({
  default: {
    initialize: mermaidInitializeMock,
    render: mermaidRenderMock,
  },
}))

import {
  clearMermaidCache,
  getMermaidThemeConfig,
  processMermaidInMarkdown,
  renderMermaidDiagrams,
} from '../../app/utils/markdownItMermaid'
import { patchPreviewContent } from '../../app/utils/previewDomPatcher'

const createPreviewHtml = (markdownBody: string): string =>
  processMermaidInMarkdown(markdownBody)

describe('previewDomPatcher', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    clearMermaidCache()
    mermaidInitializeMock.mockClear()
    mermaidRenderMock.mockClear()
  })

  it('preserves an unchanged mermaid container across non-mermaid edits', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)

    patchPreviewContent(
      root,
      createPreviewHtml(`<p>Before</p><pre><code class="language-mermaid">flowchart TD
  A-->B</code></pre><p>After</p>`),
      'dark'
    )
    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    const originalContainer = root.querySelector(
      '.mermaid-container[data-mermaid-slot="0"]'
    ) as HTMLElement

    patchPreviewContent(
      root,
      createPreviewHtml(`<p>Updated before</p><pre><code class="language-mermaid">flowchart TD
  A-->B</code></pre><p>After</p>`),
      'dark'
    )

    expect(root.querySelector('.mermaid-container[data-mermaid-slot="0"]')).toBe(originalContainer)

    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    expect(mermaidRenderMock).toHaveBeenCalledTimes(1)
  })

  it('rerenders only the changed mermaid block when multiple diagrams exist', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)

    patchPreviewContent(
      root,
      createPreviewHtml(`<pre><code class="language-mermaid">flowchart TD
  A-->B</code></pre><p>Between</p><pre><code class="language-mermaid">flowchart TD
  X-->Y</code></pre>`),
      'dark'
    )
    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    const originalFirst = root.querySelector(
      '.mermaid-container[data-mermaid-slot="0"]'
    ) as HTMLElement
    const originalSecond = root.querySelector(
      '.mermaid-container[data-mermaid-slot="1"]'
    ) as HTMLElement

    patchPreviewContent(
      root,
      createPreviewHtml(`<pre><code class="language-mermaid">flowchart TD
  A-->B</code></pre><p>Between updated</p><pre><code class="language-mermaid">flowchart TD
  X-->Z</code></pre>`),
      'dark'
    )

    expect(root.querySelector('.mermaid-container[data-mermaid-slot="0"]')).toBe(originalFirst)
    expect(root.querySelector('.mermaid-container[data-mermaid-slot="1"]')).not.toBe(originalSecond)

    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    expect(mermaidRenderMock).toHaveBeenCalledTimes(3)
  })
})
