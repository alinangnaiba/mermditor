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

// Lazy-loaded Mermaid module
let mermaidModule: typeof import('mermaid').default | null = null
let mermaidInitialized: boolean = false
const mermaidCache = new Map<string, MermaidCache>()

interface MermaidConfig {
  theme?: 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'
  themeVariables?: Partial<MermaidThemeVariables>
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

    const defaultThemeVariables: MermaidThemeVariables = {
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
    }

    const themeVariables = config?.themeVariables
      ? { ...defaultThemeVariables, ...config.themeVariables }
      : defaultThemeVariables

    mermaid.initialize({
      startOnLoad: false,
      theme: config?.theme || 'dark',
      themeVariables,
    })
    mermaidInitialized = true
  }
}

export const processMermaidInMarkdown = (html: string): string => {
  return html.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (match: string, code: string) => {
      const id = 'mermaid-' + Math.random().toString(36).substring(2, 11)
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

export const renderMermaidDiagrams = async (config?: MermaidConfig): Promise<void> => {
  if (!import.meta.client) return

  const mermaidElements = document.querySelectorAll('.mermaid:not([data-processed])')

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
      let cached = mermaidCache.get(content)

      if (cached) {
        element.innerHTML = sanitizeSvg(cached.svg)
        element.id = cached.id
      } else {
        const id = element.id || 'mermaid-' + Math.random().toString(36).substring(2, 11)
        element.id = id

        const { svg } = await mermaid.render(id + '-svg', content)
        const sanitizedSvg = sanitizeSvg(svg)
        element.innerHTML = sanitizedSvg
        mermaidCache.set(content, { svg: sanitizedSvg, id })
      }

      element.setAttribute('data-processed', 'true')
      element.setAttribute('data-content', content)

      setupMermaidControls(element)
    } catch (error) {
      console.error('Mermaid rendering error:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorHTML = `<div class="text-red-400 p-4 border border-red-600 rounded">Mermaid Error: ${errorMessage}</div>`

      element.innerHTML = errorHTML
      element.setAttribute('data-processed', 'true')
      element.setAttribute('data-content', content)

      mermaidCache.set(content, { svg: errorHTML, id: element.id })
    }
  }
}

const setupMermaidControls = (mermaidElement: Element): void => {
  const container = mermaidElement.closest('.mermaid-container')
  if (!container) return

  const diagram = container.querySelector('.mermaid-diagram')
  const viewport = container.querySelector('.mermaid-viewport')
  const zoomInBtn = container.querySelector('.mermaid-zoom-in')
  const zoomOutBtn = container.querySelector('.mermaid-zoom-out')
  const resetBtn = container.querySelector('.mermaid-reset')
  const modalBtn = container.querySelector('.mermaid-modal')

  const content = mermaidElement.textContent?.trim() || ''
  const cached = mermaidCache.get(content)

  let currentZoom = cached?.controls?.zoom || 1
  let panX = cached?.controls?.panX || 0
  let panY = cached?.controls?.panY || 0
  const zoomStep = 0.2
  const minZoom = 0.5
  const maxZoom = 3

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

  // Zoom controls
  zoomInBtn?.addEventListener('click', () => {
    currentZoom = Math.min(currentZoom + zoomStep, maxZoom)
    updateTransform()
    saveControlState()
  })

  zoomOutBtn?.addEventListener('click', () => {
    currentZoom = Math.max(currentZoom - zoomStep, minZoom)
    updateTransform()
    saveControlState()
  })

  resetBtn?.addEventListener('click', () => {
    currentZoom = 1
    panX = 0
    panY = 0
    updateTransform()
    saveControlState()
  })

  modalBtn?.addEventListener('click', () => {
    createMermaidModal(mermaidElement.outerHTML)
  })

  // Drag/pan functionality
  let isDragging = false
  let startX = 0
  let startY = 0
  let startPanX = 0
  let startPanY = 0

  viewport?.addEventListener('mousedown', (e: Event) => {
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
  })

  document.addEventListener('mousemove', (e: Event) => {
    if (!isDragging) return

    const mouseEvent = e as MouseEvent
    const deltaX = mouseEvent.clientX - startX
    const deltaY = mouseEvent.clientY - startY
    panX = startPanX + deltaX
    panY = startPanY + deltaY
    updateTransform()
  })

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false
      if (viewport) {
        viewport.classList.remove('dragging')
      }
      saveControlState()
    }
  })
}

const createMermaidModal = (diagramHTML: string): void => {
  const overlay = document.createElement('div')
  overlay.className = 'mermaid-modal-overlay'
  const content = document.createElement('div')
  content.className = 'mermaid-modal-content'
  const closeBtn = document.createElement('button')
  closeBtn.className = 'mermaid-modal-close'
  closeBtn.innerHTML = '×'
  closeBtn.onclick = () => overlay.remove()
  const diagramContainer = document.createElement('div')
  diagramContainer.innerHTML = diagramHTML

  content.appendChild(closeBtn)
  content.appendChild(diagramContainer)
  overlay.appendChild(content)

  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove()
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.remove()
      document.removeEventListener('keydown', handleEscape)
    }
  }
  document.addEventListener('keydown', handleEscape)

  document.body.appendChild(overlay)
}

export const renderMermaidExample = async (mermaidCode: string): Promise<string> => {
  if (!import.meta.client) return '<div>Mermaid diagram would render here</div>'

  try {
    await initMermaid()
    const mermaid = await loadMermaid()
    const id = 'mermaid-example-' + Math.random().toString(36).substring(2, 11)
    const { svg } = await mermaid.render(id, mermaidCode)
    const sanitizedSvg = sanitizeSvg(svg)
    return `<div class="mermaid-example">${sanitizedSvg}</div>`
  } catch (error) {
    console.warn('Mermaid example rendering error:', error)
    return '<div class="text-gray-400">Diagram would render here</div>'
  }
}

export const clearMermaidCache = (): void => {
  mermaidCache.clear()
}
