import { logError } from '../../utils/logging'
import { sanitizeSvg } from './sanitizer'

interface MermaidThemeVariables {
  primaryColor: string
  primaryTextColor: string
  primaryBorderColor: string
  lineColor: string
  secondaryColor: string
  tertiaryColor: string
  background: string
  mainBkg: string
  secondBkg: string
  tertiaryBkg: string
  edgeLabelBackground?: string
  clusterBkg?: string
  clusterBorder?: string
  nodeBorder?: string
}

interface MermaidCache {
  svg: string
  id: string
  controls?: {
    zoom: number
    panX: number
    panY: number
  }
}

const MERMAID_ZOOM_STEP = 0.2
const MERMAID_ZOOM_MIN = 0.5
const MERMAID_ZOOM_MAX = 3
const MERMAID_CACHE_MAX_SIZE = 50

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// Lazy-loaded Mermaid module
let mermaidModule: typeof import('mermaid').default | null = null
let mermaidInitialized: boolean = false
const mermaidCache = new Map<string, MermaidCache>()

interface MermaidConfig {
  theme?: 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'
  themeVariables?: Partial<MermaidThemeVariables>
  cacheKey?: MermaidRenderTheme
  [key: string]: unknown
}

export type MermaidRenderTheme = 'dark' | 'light'

const mermaidControlCleanups = new WeakMap<Element, () => void>()

export const getMermaidThemeConfig = (theme: MermaidRenderTheme): MermaidConfig => {
  if (theme === 'light') {
    return {
      theme: 'base',
      cacheKey: 'light',
      themeVariables: {
        primaryColor: '#f3f7fb',
        primaryTextColor: '#243b53',
        primaryBorderColor: '#6f8fad',
        lineColor: '#8aa1b8',
        secondaryColor: '#e8eff5',
        tertiaryColor: '#dde6ef',
        background: '#ecf2f7',
        mainBkg: '#f3f7fb',
        secondBkg: '#e8eff5',
        tertiaryBkg: '#dde6ef',
        edgeLabelBackground: '#f6f9fc',
        clusterBkg: '#f1f6fa',
        clusterBorder: '#c1cedb',
        nodeBorder: '#6f8fad',
      },
    }
  }

  return {
    theme: 'dark',
    cacheKey: 'dark',
    themeVariables: {
      primaryColor: '#3b82f6',
      primaryTextColor: '#f3f4f6',
      primaryBorderColor: '#374151',
      lineColor: '#6b7280',
      secondaryColor: '#1f2937',
      tertiaryColor: '#111827',
      background: '#111827',
      mainBkg: '#1f2937',
      secondBkg: '#374151',
      tertiaryBkg: '#4b5563',
    },
  }
}

/**
 * Dynamically loads Mermaid library only when needed.
 * This saves ~500KB on initial load when no diagrams are present.
 */
const loadMermaid = async (): Promise<typeof import('mermaid').default> => {
  if (mermaidModule) return mermaidModule

  const { default: mermaid } = await import('mermaid')
  mermaidModule = mermaid
  return mermaid
}

export const initMermaid = async (config?: MermaidConfig): Promise<void> => {
  // If config is provided, we re-initialize to apply new theme
  if ((!mermaidInitialized || config) && import.meta.client) {
    const mermaid = await loadMermaid()

    const defaultThemeConfig = getMermaidThemeConfig('dark')
    const defaultThemeVariables = defaultThemeConfig.themeVariables as MermaidThemeVariables

    const { theme, themeVariables: configThemeVariables, cacheKey: _cacheKey, ...otherConfig } =
      config || {}

    const themeVariables = configThemeVariables
      ? { ...defaultThemeVariables, ...configThemeVariables }
      : defaultThemeVariables

    mermaid.initialize({
      startOnLoad: false,
      theme: theme || 'dark',
      themeVariables,
      ...otherConfig,
    })
    mermaidInitialized = true
  }
}

export const processMermaidInMarkdown = (html: string): string => {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (match: string, code: string) => {
      const id = `mermaid-${crypto.randomUUID()}`
      const decodedCode = code
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")

      return `<div class="mermaid-container">
        <div class="mermaid-controls">
          <button class="mermaid-zoom-in" title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
          </button>
          <button class="mermaid-zoom-out" title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
          </button>
          <button class="mermaid-reset" title="Reset Zoom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="200 88 224 64 200 40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,128A64,64,0,0,1,96,64H224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="56 168 32 192 56 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M224,128a64,64,0,0,1-64,64H32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
          </button>
          <button class="mermaid-modal" title="View in Modal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="160 48 208 48 208 96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="144" y1="112" x2="208" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="96 208 48 208 48 160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="144" x2="48" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
          </button>
        </div>
        <div class="mermaid-viewport">
          <div class="mermaid-diagram" style="transform-origin: top left;">
            <div class="mermaid" id="${id}">${decodedCode}</div>
          </div>
        </div>
      </div>`
    }
  )
}

const cleanupMermaidElementControls = (mermaidElement: Element): void => {
  const cleanup = mermaidControlCleanups.get(mermaidElement)
  if (!cleanup) return

  cleanup()
  mermaidControlCleanups.delete(mermaidElement)
}

export const cleanupMermaidControls = (root: ParentNode = document): void => {
  root.querySelectorAll('.mermaid').forEach((element) => {
    cleanupMermaidElementControls(element)
  })
}

export const renderMermaidDiagrams = async (
  config?: MermaidConfig,
  root: ParentNode = document
): Promise<void> => {
  if (!import.meta.client) return

  const themeKey = config?.cacheKey || 'dark'

  const mermaidElements = root.querySelectorAll('.mermaid:not([data-processed])')

  // Early exit if no diagrams to render - don't load Mermaid at all
  if (mermaidElements.length === 0) return

  // Only load and initialize Mermaid when we have diagrams
  await initMermaid(config)
  const mermaid = await loadMermaid()

  for (const element of mermaidElements) {
    const content = element.textContent?.trim() || ''
    const currentContent = element.getAttribute('data-content')
    if (currentContent === content && element.hasAttribute('data-processed')) {
      continue
    }

    try {
      cleanupMermaidElementControls(element)

      const cacheKey = `${themeKey}:${content}`
      let cached = mermaidCache.get(cacheKey)

      if (cached) {
        element.innerHTML = sanitizeSvg(cached.svg)
        element.id = cached.id
      } else {
        const id = element.id || `mermaid-${crypto.randomUUID()}`
        element.id = id

        const { svg } = await mermaid.render(id + '-svg', content)
        const sanitizedSvg = sanitizeSvg(svg)
        element.innerHTML = sanitizedSvg
        mermaidCache.set(cacheKey, { svg: sanitizedSvg, id })
        if (mermaidCache.size > MERMAID_CACHE_MAX_SIZE) {
          const firstKey = mermaidCache.keys().next().value
          if (firstKey !== undefined) mermaidCache.delete(firstKey)
        }
      }

      element.setAttribute('data-processed', 'true')
      element.setAttribute('data-content', content)
      element.setAttribute('data-theme-key', themeKey)

      setupMermaidControls(element)
    } catch (error) {
      logError('mermaid.render', error, {
        contentPreview: content.slice(0, 160),
        themeKey,
      })
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorHTML = `<div class="render-error p-4 border rounded">Mermaid Error: ${escapeHtml(errorMessage)}</div>`

      element.innerHTML = errorHTML
      element.setAttribute('data-processed', 'true')
      element.setAttribute('data-content', content)
      element.setAttribute('data-theme-key', themeKey)

      mermaidCache.set(`${themeKey}:${content}`, { svg: errorHTML, id: element.id })
      if (mermaidCache.size > MERMAID_CACHE_MAX_SIZE) {
        mermaidCache.delete(mermaidCache.keys().next().value!)
      }
    }
  }
}

const getMermaidCacheKey = (mermaidElement: Element): string => {
  const themeKey = mermaidElement.getAttribute('data-theme-key') || 'dark'
  const content =
    mermaidElement.getAttribute('data-content')?.trim() || mermaidElement.textContent?.trim() || ''

  return `${themeKey}:${content}`
}

export const setupMermaidControls = (mermaidElement: Element): (() => void) => {
  cleanupMermaidElementControls(mermaidElement)

  const container = mermaidElement.closest('.mermaid-container')
  if (!container) return () => {}

  const diagram = container.querySelector('.mermaid-diagram')
  const viewport = container.querySelector('.mermaid-viewport')
  const zoomInBtn = container.querySelector('.mermaid-zoom-in')
  const zoomOutBtn = container.querySelector('.mermaid-zoom-out')
  const resetBtn = container.querySelector('.mermaid-reset')
  const modalBtn = container.querySelector('.mermaid-modal')

  const content = getMermaidCacheKey(mermaidElement)
  const cached = mermaidCache.get(content)

  let currentZoom = cached?.controls?.zoom || 1
  let panX = cached?.controls?.panX || 0
  let panY = cached?.controls?.panY || 0

  const updateTransform = () => {
    if (diagram && diagram instanceof HTMLElement) {
      diagram.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`
    }
  }

  const saveControlState = () => {
    const existingCache = mermaidCache.get(content)
    if (existingCache) {
      existingCache.controls = { zoom: currentZoom, panX, panY }
      mermaidCache.set(content, existingCache)
    }
  }

  updateTransform()

  const cleanupCallbacks: Array<() => void> = []

  // Zoom controls
  const handleZoomIn = () => {
    currentZoom = Math.min(currentZoom + MERMAID_ZOOM_STEP, MERMAID_ZOOM_MAX)
    updateTransform()
    saveControlState()
  }
  zoomInBtn?.addEventListener('click', handleZoomIn)
  if (zoomInBtn) {
    cleanupCallbacks.push(() => zoomInBtn.removeEventListener('click', handleZoomIn))
  }

  const handleZoomOut = () => {
    currentZoom = Math.max(currentZoom - MERMAID_ZOOM_STEP, MERMAID_ZOOM_MIN)
    updateTransform()
    saveControlState()
  }
  zoomOutBtn?.addEventListener('click', handleZoomOut)
  if (zoomOutBtn) {
    cleanupCallbacks.push(() => zoomOutBtn.removeEventListener('click', handleZoomOut))
  }

  const handleReset = () => {
    currentZoom = 1
    panX = 0
    panY = 0
    updateTransform()
    saveControlState()
  }
  resetBtn?.addEventListener('click', handleReset)
  if (resetBtn) {
    cleanupCallbacks.push(() => resetBtn.removeEventListener('click', handleReset))
  }

  const handleOpenModal = () => {
    createMermaidModal(container.cloneNode(true))
  }
  modalBtn?.addEventListener('click', handleOpenModal)
  if (modalBtn) {
    cleanupCallbacks.push(() => modalBtn.removeEventListener('click', handleOpenModal))
  }

  // Drag/pan functionality
  let isDragging = false
  let startX = 0
  let startY = 0
  let startPanX = 0
  let startPanY = 0

  const handleMouseDown = (e: Event) => {
    const mouseEvent = e as MouseEvent
    if (currentZoom <= 1) return // Only allow panning when zoomed
    isDragging = true
    startX = mouseEvent.clientX
    startY = mouseEvent.clientY
    startPanX = panX
    startPanY = panY
    if (viewport) {
      viewport.classList.add('dragging')
    }
    e.preventDefault()
  }
  viewport?.addEventListener('mousedown', handleMouseDown)
  if (viewport) {
    cleanupCallbacks.push(() => viewport.removeEventListener('mousedown', handleMouseDown))
  }

  const handleMouseMove = (e: Event) => {
    if (!isDragging) return

    const mouseEvent = e as MouseEvent
    const deltaX = mouseEvent.clientX - startX
    const deltaY = mouseEvent.clientY - startY
    panX = startPanX + deltaX
    panY = startPanY + deltaY
    updateTransform()
  }
  document.addEventListener('mousemove', handleMouseMove)
  cleanupCallbacks.push(() => document.removeEventListener('mousemove', handleMouseMove))

  const handleMouseUp = () => {
    if (isDragging) {
      isDragging = false
      if (viewport) {
        viewport.classList.remove('dragging')
      }
      saveControlState()
    }
  }
  document.addEventListener('mouseup', handleMouseUp)
  cleanupCallbacks.push(() => document.removeEventListener('mouseup', handleMouseUp))

  const cleanup = () => {
    isDragging = false
    if (viewport) {
      viewport.classList.remove('dragging')
    }
    cleanupCallbacks.splice(0).forEach((callback) => callback())
  }

  mermaidControlCleanups.set(mermaidElement, cleanup)
  return cleanup
}

const createMermaidModal = (containerNode: Node): void => {
  if (!(containerNode instanceof HTMLElement)) return

  const overlay = document.createElement('div')
  overlay.className = 'mermaid-modal-overlay'
  const content = document.createElement('div')
  content.className = 'mermaid-modal-content'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'mermaid-modal-close'
  closeBtn.innerHTML = '×'
  const modalContainer = containerNode
  modalContainer.classList.add('mermaid-container--modal')
  modalContainer.querySelector('.mermaid-modal')?.remove()

  content.appendChild(closeBtn)
  content.appendChild(modalContainer)
  overlay.appendChild(content)

  const modalMermaidElement = modalContainer.querySelector('.mermaid')
  let cleanupModalControls: (() => void) | null = null

  const closeModal = (): void => {
    cleanupModalControls?.()
    if (modalMermaidElement) {
      cleanupMermaidElementControls(modalMermaidElement)
    }
    document.removeEventListener('keydown', handleEscape)
    overlay.remove()
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }

  closeBtn.onclick = closeModal
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closeModal()
    }
  }

  if (modalMermaidElement) {
    cleanupModalControls = setupMermaidControls(modalMermaidElement)
  }

  document.addEventListener('keydown', handleEscape)
  document.body.appendChild(overlay)
}

export const renderMermaidExample = async (mermaidCode: string): Promise<string> => {
  if (!import.meta.client) return '<div>Mermaid diagram would render here</div>'

  try {
    await initMermaid()
    const mermaid = await loadMermaid()
    const id = `mermaid-example-${crypto.randomUUID()}`
    const { svg } = await mermaid.render(id, mermaidCode)
    const sanitizedSvg = sanitizeSvg(svg)
    return `<div class="mermaid-example">${sanitizedSvg}</div>`
  } catch (error) {
    logError('mermaid.renderExample', error, {
      contentPreview: mermaidCode.slice(0, 160),
    })
    return '<div class="render-placeholder">Diagram would render here</div>'
  }
}

export const clearMermaidCache = (): void => {
  mermaidCache.clear()
}
