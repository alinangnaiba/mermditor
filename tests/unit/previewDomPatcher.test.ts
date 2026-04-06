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
  createMermaidPreviewHtml,
  getMermaidThemeConfig,
  renderMermaidDiagrams,
  splitMarkdownIntoPreviewSections,
} from '../../app/utils/markdownItMermaid'
import { updatePreviewSections } from '../../app/utils/previewSectionRenderer'

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
    const renderMarkdownSection = vi.fn(async (source: string) => `<p>${source}</p>`)

    let previousSections = await updatePreviewSections({
      contentRoot: root,
      nextSections: splitMarkdownIntoPreviewSections(`Before

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`

After`),
      previousSections: [],
      themeKey: 'dark',
      renderMarkdownSection,
      renderMermaidSection: createMermaidPreviewHtml,
    })
    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    const originalContainer = root.querySelector(
      '.mermaid-container[data-mermaid-slot="0"]'
    ) as HTMLElement

    previousSections = await updatePreviewSections({
      contentRoot: root,
      nextSections: splitMarkdownIntoPreviewSections(`Updated before

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`

After`),
      previousSections,
      themeKey: 'dark',
      renderMarkdownSection,
      renderMermaidSection: createMermaidPreviewHtml,
    })

    expect(root.querySelector('.mermaid-container[data-mermaid-slot="0"]')).toBe(originalContainer)

    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    expect(mermaidRenderMock).toHaveBeenCalledTimes(1)
    expect(renderMarkdownSection).toHaveBeenCalledTimes(3)
  })

  it('rerenders only the changed mermaid block when multiple diagrams exist', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    const renderMarkdownSection = vi.fn(async (source: string) => `<p>${source}</p>`)

    let previousSections = await updatePreviewSections({
      contentRoot: root,
      nextSections: splitMarkdownIntoPreviewSections(`\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`

Between

\`\`\`mermaid
flowchart TD
  X-->Y
\`\`\``),
      previousSections: [],
      themeKey: 'dark',
      renderMarkdownSection,
      renderMermaidSection: createMermaidPreviewHtml,
    })
    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    const originalFirst = root.querySelector(
      '.mermaid-container[data-mermaid-slot="0"]'
    ) as HTMLElement
    const originalSecond = root.querySelector(
      '.mermaid-container[data-mermaid-slot="1"]'
    ) as HTMLElement

    previousSections = await updatePreviewSections({
      contentRoot: root,
      nextSections: splitMarkdownIntoPreviewSections(`\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`

Between updated

\`\`\`mermaid
flowchart TD
  X-->Z
\`\`\``),
      previousSections,
      themeKey: 'dark',
      renderMarkdownSection,
      renderMermaidSection: createMermaidPreviewHtml,
    })

    expect(root.querySelector('.mermaid-container[data-mermaid-slot="0"]')).toBe(originalFirst)
    expect(root.querySelector('.mermaid-container[data-mermaid-slot="1"]')).not.toBe(originalSecond)

    await renderMermaidDiagrams(getMermaidThemeConfig('dark'), root)

    expect(mermaidRenderMock).toHaveBeenCalledTimes(3)
    expect(renderMarkdownSection).toHaveBeenCalledTimes(2)
  })
})
