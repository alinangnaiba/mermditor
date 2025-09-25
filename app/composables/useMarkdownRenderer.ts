import { marked } from 'marked'
import { markedEmoji } from 'marked-emoji'
import { emojiMapping } from '../utils/emojiMapping'
import mermaid from 'mermaid'

declare global {
  interface Window {
    katex: {
      renderToString: (
        tex: string,
        options?: {
          displayMode?: boolean
          throwOnError?: boolean
        }
      ) => string
    }
    Prism: {
      highlightAll: () => void
      highlightElement: (element: Element) => void
    }
  }
}

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

// Cache for rendered Mermaid diagrams
interface MermaidCache {
  svg: string
  id: string
  controls?: {
    zoom: number
    panX: number
    panY: number
  }
}

export const useMarkdownRenderer = () => {
  let mermaidInitialized: boolean = false
  const mermaidCache = new Map<string, MermaidCache>()

  marked.use(
    markedEmoji({
      emojis: emojiMapping,
      renderer: (token: { emoji: string }) => token.emoji,
    })
  )

  const initMermaid = (): void => {
    if (!mermaidInitialized && import.meta.client) {
      const themeVariables: MermaidThemeVariables = {
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

      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables,
      })
      mermaidInitialized = true
    }
  }

  const renderMarkdown = async (content: string): Promise<string> => {
    if (!content) return ''

    try {
      let html = await marked.parse(String(content))

      html = html.replace(
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

      // First, process LaTeX so caret/tilde transformations don't affect math
      html = await processLatex(html)
      // Process extended markdown syntax after LaTeX has rendered
      html = processExtendedSyntax(html)
      // Then, add language labels to remaining code blocks (excluding mermaid which was already processed)
      html = html.replace(
        /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
        (match: string, lang: string, code: string) => {
          const languageNames: Record<string, string> = {
            js: 'JavaScript',
            ts: 'TypeScript',
            javascript: 'JavaScript',
            typescript: 'TypeScript',
            python: 'Python',
            py: 'Python',
            java: 'Java',
            cpp: 'C++',
            c: 'C',
            cs: 'C#',
            csharp: 'C#',
            css: 'CSS',
            html: 'HTML',
            json: 'JSON',
            xml: 'XML',
            yaml: 'YAML',
            yml: 'YAML',
            bash: 'Bash',
            sh: 'Shell',
            sql: 'SQL',
            php: 'PHP',
            ruby: 'Ruby',
            go: 'Go',
            rust: 'Rust',
          }

          const displayName = languageNames[lang] || lang.toUpperCase()

          return `<div class="code-block-container">
          <div class="code-block-header">
            <span class="code-block-language">${displayName}</span>
          </div>
          <pre><code class="language-${lang}">${code}</code></pre>
        </div>`
        }
      )

      return html
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return '<p class="text-red-400">Error rendering markdown</p>'
    }
  }

  const waitForKatex = (): Promise<void> => {
    return new Promise((resolve) => {
      if (import.meta.client && window.katex) {
        resolve()
        return
      }

      const checkKatex = () => {
        if (window.katex) {
          resolve()
        } else {
          setTimeout(checkKatex, 50)
        }
      }

      if (import.meta.client) {
        checkKatex()
      } else {
        resolve()
      }
    })
  }

  const processLatex = async (html: string): Promise<string> => {
    if (!import.meta.client) return html
    await waitForKatex()
    if (window.katex) {
      const codeBlocks: string[] = []
      let codeBlockIndex = 0

      html = html.replace(/<pre><code[^>]*>[\s\S]*?<\/code><\/pre>/g, (match) => {
        const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`
        codeBlocks[codeBlockIndex] = match
        codeBlockIndex++
        return placeholder
      })

      html = html.replace(/<code[^>]*>[\s\S]*?<\/code>/g, (match) => {
        const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`
        codeBlocks[codeBlockIndex] = match
        codeBlockIndex++
        return placeholder
      })

      html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        try {
          return `<div class="katex-display">${window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`
        } catch (error) {
          console.error('LaTeX display math error:', error)
          return `<div class="text-red-400">LaTeX Error: ${match}</div>`
        }
      })

      html = html.replace(/\$([^$\n]+?)\$/g, (match, math) => {
        try {
          return window.katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          })
        } catch (error) {
          console.error('LaTeX inline math error:', error)
          return `<span class="text-red-400">LaTeX Error: ${match}</span>`
        }
      })

      for (let i = 0; i < codeBlocks.length; i++) {
        const codeBlock = codeBlocks[i]
        if (codeBlock !== undefined) {
          html = html.replace(`__CODE_BLOCK_${i}__`, codeBlock)
        }
      }
    }

    return html
  }

  const processExtendedSyntax = (html: string): string => {
    html = html.replace(/^(\s*)-\s+\[([ x])\]\s+(.+)$/gm, (match, indent, checked, text) => {
      const isChecked = checked === 'x'
      return `${indent}<label class="flex items-center space-x-2 text-gray-200">
        <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="rounded bg-gray-700 border-gray-600">
        <span class="${isChecked ? 'line-through text-gray-400' : ''}">${text}</span>
      </label>`
    })

    // Highlight syntax (==text==)
    html = html.replace(
      /==([^=]+)==/g,
      '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>'
    )

    // Subscript (~text~)
    html = html.replace(/~([^~]+)~/g, '<sub class="text-gray-300">$1</sub>')

    // Superscript (^text^)
    html = html.replace(/\^([^\^]+)\^/g, '<sup class="text-gray-300">$1</sup>')

    // Footnotes - process footnote references first
    html = html.replace(
      /\[\^([^\]]+)\]/g,
      '<sup><a href="#fn:$1" id="fnref:$1" class="text-blue-400 hover:text-blue-300 no-underline">$1</a></sup>'
    )

    // Footnote definitions
    html = html.replace(
      /^\[\^([^\]]+)\]:\s*(.+)$/gm,
      '<div id="fn:$1" class="text-sm text-gray-400 border-l-2 border-gray-600 pl-3 mt-2"><sup>$1</sup> $2 <a href="#fnref:$1" class="text-blue-400 hover:text-blue-300 text-xs ml-2">↩</a></div>'
    )

    // Definition lists
    html = html.replace(
      /^([^:\n]+)\n:\s+(.+)$/gm,
      '<dl class="my-4"><dt class="font-semibold text-gray-100 mb-1">$1</dt><dd class="text-gray-300 ml-4 mb-2">$2</dd></dl>'
    )

    return html
  }

  const renderMermaidDiagrams = async (): Promise<void> => {
    if (!import.meta.client) return

    initMermaid()

    const mermaidElements = document.querySelectorAll('.mermaid')

    for (const element of mermaidElements) {
      const content = element.textContent?.trim() || ''
      const currentContent = element.getAttribute('data-content')
      if (currentContent === content && element.hasAttribute('data-processed')) {
        continue
      }

      try {
        let cached = mermaidCache.get(content)

        if (cached) {
          element.innerHTML = cached.svg
          element.id = cached.id
        } else {
          const id = element.id || 'mermaid-' + Math.random().toString(36).substring(2, 11)
          element.id = id

          const { svg } = await mermaid.render(id + '-svg', content)
          element.innerHTML = svg
          mermaidCache.set(content, { svg, id })
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

  const clearMermaidCache = (): void => {
    mermaidCache.clear()
  }

  const highlightSyntax = (): void => {
    if (!import.meta.client || !window.Prism) return
    const codeBlocks = document.querySelectorAll('pre code:not(.prism-highlighted)')

    codeBlocks.forEach((block) => {
      block.classList.add('prism-highlighted')

      // Apply Prism highlighting
      window.Prism.highlightElement(block)
    })
  }

  // Standalone renderers for tool guide examples
  const renderMarkdownExample = async (content: string): Promise<string> => {
    if (!content) return ''

    try {
      let html = await marked.parse(String(content))
      html = processExtendedSyntax(html)

      return html
    } catch (error) {
      console.error('Example markdown rendering error:', error)
      return '<p class="text-red-400">Error rendering example</p>'
    }
  }

  const renderLatexExample = (latex: string, isBlock: boolean = false): string => {
    try {
      if (!import.meta.client || !window.katex) return latex

      const renderInlineSegment = (text: string): string => {
        // Replace $...$ inline math (no newline inside)
        return text.replace(/\$([^$\n]+?)\$/g, (_m, expr) => {
          try {
            return window.katex.renderToString(String(expr).trim(), {
              displayMode: false,
              throwOnError: false,
            })
          } catch {
            return _m
          }
        })
      }

      if (/\$\$[\s\S]*?\$\$/.test(latex)) {
        const parts = String(latex)
          .split(/(\$\$[\s\S]*?\$\$)/g)
          .filter(Boolean)
        return parts
          .map((part) => {
            const trimmed = part.trim()
            if (/^\$\$[\s\S]*?\$\$$/.test(trimmed)) {
              const content = trimmed.slice(2, -2)
              try {
                return window.katex.renderToString(content.trim(), {
                  displayMode: true,
                  throwOnError: false,
                })
              } catch {
                return trimmed
              }
            }
            return renderInlineSegment(part)
          })
          .join('')
      }

      if (isBlock) {
        try {
          return window.katex.renderToString(String(latex).trim(), {
            displayMode: true,
            throwOnError: false,
          })
        } catch {
          return String(latex)
        }
      }

      return renderInlineSegment(String(latex))
    } catch {
      return latex
    }
  }

  const renderMermaidExample = async (mermaidCode: string): Promise<string> => {
    if (!import.meta.client) return '<div>Mermaid diagram would render here</div>'

    try {
      initMermaid()
      const id = 'mermaid-example-' + Math.random().toString(36).substring(2, 11)
      const { svg } = await mermaid.render(id, mermaidCode)
      return `<div class="mermaid-example">${svg}</div>`
    } catch (error) {
      console.warn('Mermaid example rendering error:', error)
      return '<div class="text-gray-400">Diagram would render here</div>'
    }
  }

  return {
    renderMarkdown,
    renderMermaidDiagrams,
    initMermaid,
    clearMermaidCache,
    highlightSyntax,
    renderMarkdownExample,
    renderLatexExample,
    renderMermaidExample,
  }
}
