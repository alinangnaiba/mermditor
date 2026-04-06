import { beforeEach, expect, it, describe, vi } from 'vitest'

const mermaidRenderMock = vi.fn(async (id: string) => ({
  svg: `<svg id="${id}" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5"></circle></svg>`,
}))

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: mermaidRenderMock,
  },
}))

import {
  clearMermaidCache,
  cloneCachedMermaidSvg,
  cleanupMermaidControls,
  getMermaidSourceSignature,
  setupMermaidControls,
} from '../../app/utils/markdownItMermaid'

describe('mermaid control cleanup', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    mermaidRenderMock.mockClear()
    clearMermaidCache()
  })

  it('stops drag interactions after cleanup and closes modal listeners cleanly', async () => {
    const root = document.createElement('div')
    root.innerHTML = `
      <div class="mermaid-container">
        <div class="mermaid-controls">
          <button class="mermaid-zoom-in" title="Zoom In"></button>
          <button class="mermaid-zoom-out" title="Zoom Out"></button>
          <button class="mermaid-reset" title="Reset Zoom"></button>
          <button class="mermaid-modal" title="View in Modal"></button>
        </div>
        <div class="mermaid-viewport">
          <div class="mermaid-diagram" style="transform-origin: top left;">
            <div class="mermaid">flowchart TD; A-->B;</div>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(root)

    const diagram = root.querySelector('.mermaid-diagram') as HTMLElement
    const viewport = root.querySelector('.mermaid-viewport') as HTMLElement
    const zoomInButton = root.querySelector('.mermaid-zoom-in') as HTMLButtonElement
    const modalButton = root.querySelector('.mermaid-modal') as HTMLButtonElement
    const mermaidElement = root.querySelector('.mermaid') as HTMLElement

    mermaidElement.setAttribute('data-content', 'flowchart TD; A-->B;')
    mermaidElement.setAttribute('data-theme-key', 'dark')

    setupMermaidControls(mermaidElement)

    zoomInButton.click()

    viewport.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 40, clientY: 30 }))

    expect(diagram.style.transform).toContain('translate(30px, 20px)')

    cleanupMermaidControls(root)

    const transformAfterCleanup = diagram.style.transform

    viewport.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 20, clientY: 20 }))
    document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 80, clientY: 60 }))

    expect(diagram.style.transform).toBe(transformAfterCleanup)

    setupMermaidControls(mermaidElement)
    modalButton.click()

    expect(document.querySelector('.mermaid-modal-overlay')).not.toBeNull()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(document.querySelector('.mermaid-modal-overlay')).toBeNull()
  })

  it('creates the same mermaid signature when only non-mermaid content changes', () => {
    const original = `# Title

Before

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`
`

    const updated = `# Updated Title

After

\`\`\`mermaid
flowchart TD
  A-->B
\`\`\`
`

    const changedMermaid = `# Updated Title

After

\`\`\`mermaid
flowchart TD
  A-->C
\`\`\`
`

    expect(getMermaidSourceSignature(original)).toBe(getMermaidSourceSignature(updated))
    expect(getMermaidSourceSignature(original)).not.toBe(getMermaidSourceSignature(changedMermaid))
  })

  it('rewrites cached svg style selectors when cloning a mermaid diagram', () => {
    const clonedSvg = cloneCachedMermaidSvg(
      '<svg id="mermaid-source-svg" xmlns="http://www.w3.org/2000/svg"><style>#mermaid-source-svg #edge-path{stroke:#123456;} #edge-path{fill:#abcdef;}</style><g id="edge-path"></g></svg>'
    )

    const wrapper = document.createElement('div')
    wrapper.innerHTML = clonedSvg

    const cachedSvg = wrapper.querySelector('svg')
    const cachedEdge = wrapper.querySelector('g')
    const cachedStyle = wrapper.querySelector('style')

    expect(cachedSvg).not.toBeNull()
    expect(cachedEdge).not.toBeNull()
    expect(cachedStyle).not.toBeNull()
    expect(cachedSvg?.id).not.toBe('mermaid-source-svg')
    expect(cachedEdge?.id).not.toBe('edge-path')
    expect(cachedStyle?.textContent).toContain(`#${cachedSvg?.id} #${cachedEdge?.id}`)
    expect(cachedStyle?.textContent).toContain(`#${cachedEdge?.id}{fill:#abcdef;}`)
    expect(cachedStyle?.textContent).not.toContain('#mermaid-source-svg #edge-path')
  })
})
