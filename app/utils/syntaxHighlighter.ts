// Lazy-loaded Prism module
let prismLoaded = false
let prismLoadPromise: Promise<void> | null = null

/**
 * Dynamically loads Prism.js only when needed.
 * Languages are bundled statically to avoid CSP-violating CDN script fetches.
 */
const loadPrism = async (): Promise<void> => {
  if (prismLoaded || !import.meta.client) return
  if (prismLoadPromise) {
    await prismLoadPromise
    return
  }

  prismLoadPromise = (async () => {
    // Load Prism core before languages.
    await import('prismjs')

    // Load components in dependency order to avoid runtime registration errors.
    await import('prismjs/components/prism-markup')
    await import('prismjs/components/prism-clike')
    await import('prismjs/components/prism-c')
    await import('prismjs/components/prism-cpp')
    await import('prismjs/components/prism-csharp')
    await import('prismjs/components/prism-css')
    await import('prismjs/components/prism-javascript')
    await import('prismjs/components/prism-typescript')
    await import('prismjs/components/prism-jsx')
    await import('prismjs/components/prism-tsx')
    await import('prismjs/components/prism-json')
    await import('prismjs/components/prism-yaml')
    await import('prismjs/components/prism-bash')
    await import('prismjs/components/prism-python')
    await import('prismjs/components/prism-java')
    await import('prismjs/components/prism-go')
    await import('prismjs/components/prism-rust')
    await import('prismjs/components/prism-sql')
    await import('prismjs/components/prism-markdown')
    await import('prismjs/components/prism-diff')
    await import('prismjs/components/prism-docker')
    await import('prismjs/components/prism-toml')

    prismLoaded = true
  })()

  try {
    await prismLoadPromise
  } finally {
    prismLoadPromise = null
  }
}

declare global {
  interface Window {
    Prism: {
      highlightAll: () => void
      highlightElement: (element: Element) => void
    }
  }
}

/**
 * Highlights code blocks using Prism.js.
 * Loads Prism on demand only when code blocks are present.
 */
export const highlightSyntax = async (): Promise<void> => {
  if (!import.meta.client) return

  try {
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
  } catch (error) {
    console.error('Syntax highlighting error:', error)
  }
}
