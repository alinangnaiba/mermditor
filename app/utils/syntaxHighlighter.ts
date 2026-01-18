// Lazy-loaded Prism module
let prismLoaded = false

/**
 * Dynamically loads Prism.js library and CSS only when needed.
 * This eliminates the render-blocking CDN CSS.
 */
const loadPrism = async (): Promise<void> => {
  if (prismLoaded || !import.meta.client) return

  // Load Prism core and theme CSS
  await Promise.all([import('prismjs'), import('prismjs/themes/prism-tomorrow.css')])

  // Load autoloader plugin for automatic language detection
  await import('prismjs/plugins/autoloader/prism-autoloader')

  // Configure autoloader to use CDN for language definitions
  // This allows loading additional languages on-demand
  if (window.Prism?.plugins?.autoloader) {
    window.Prism.plugins.autoloader.languages_path =
      'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/'
  }

  prismLoaded = true
}

declare global {
  interface Window {
    Prism: {
      highlightAll: () => void
      highlightElement: (element: Element) => void
      plugins?: {
        autoloader?: {
          languages_path: string
        }
      }
    }
  }
}

/**
 * Highlights code blocks using Prism.js.
 * Loads Prism on demand only when code blocks are present.
 */
export const highlightSyntax = async (): Promise<void> => {
  if (!import.meta.client) return

  const codeBlocks = document.querySelectorAll('pre code:not(.prism-highlighted)')

  // Early exit if no code blocks to highlight
  if (codeBlocks.length === 0) return

  // Load Prism on demand
  await loadPrism()

  if (!window.Prism) return

  codeBlocks.forEach((block) => {
    block.classList.add('prism-highlighted')
    window.Prism.highlightElement(block)
  })
}
