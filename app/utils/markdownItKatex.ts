import type { KatexOptions } from 'katex'

// Lazy-loaded KaTeX module
let katexModule: typeof import('katex').default | null = null
let katexCssLoaded = false

/**
 * Dynamically loads KaTeX library and CSS only when needed.
 * This eliminates the render-blocking CDN CSS and replaces polling with proper async loading.
 */
const loadKatex = async (): Promise<typeof import('katex').default> => {
  if (katexModule) return katexModule

  // Load KaTeX module
  const katex = await import('katex')
  katexModule = katex.default

  // Load CSS only once
  if (!katexCssLoaded && import.meta.client) {
    await import('katex/dist/katex.min.css')
    katexCssLoaded = true
  }

  return katexModule
}

/**
 * Check if content contains LaTeX math expressions
 */
const containsMath = (html: string): boolean => {
  return html.includes('$')
}

/**
 * Process LaTeX math expressions in HTML content.
 * Only loads KaTeX if math expressions are detected.
 */
export const processLatex = async (html: string): Promise<string> => {
  if (!import.meta.client) return html

  // Early exit if no math expressions detected
  if (!containsMath(html)) return html

  const katex = await loadKatex()

  const codeBlocks: string[] = []
  let codeBlockIndex = 0

  // Preserve code blocks during LaTeX processing
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

  const renderOptions: KatexOptions = {
    throwOnError: false,
    strict: false,
  }

  // Process display math ($$...$$)
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
    try {
      return `<div class="katex-display">${katex.renderToString(math.trim(), { ...renderOptions, displayMode: true })}</div>`
    } catch (error) {
      console.error('LaTeX display math error:', error)
      return `<div class="text-red-400">LaTeX Error: ${match}</div>`
    }
  })

  // Process inline math ($...$)
  // Skip currency patterns: $10, $10.00, $.99, $1,000 (when $ is followed by digits/decimals)
  html = html.replace(/\$(?![\d.,]+[\d\s\-\)])([^$\n]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math.trim(), { ...renderOptions, displayMode: false })
    } catch (error) {
      console.error('LaTeX inline math error:', error)
      return `<span class="text-red-400">LaTeX Error: ${match}</span>`
    }
  })

  // Restore code blocks
  for (let i = 0; i < codeBlocks.length; i++) {
    const codeBlock = codeBlocks[i]
    if (codeBlock !== undefined) {
      html = html.replace(`__CODE_BLOCK_${i}__`, codeBlock)
    }
  }

  return html
}

/**
 * Render a LaTeX example string (used in guide/help pages).
 * Loads KaTeX on demand.
 */
export const renderLatexExample = async (
  latex: string,
  isBlock: boolean = false
): Promise<string> => {
  try {
    if (!import.meta.client) return latex

    const katex = await loadKatex()

    const renderOptions: KatexOptions = {
      throwOnError: false,
      strict: false,
    }

    const renderInlineSegment = (text: string): string => {
      // Replace $...$ inline math (no newline inside)
      // Skip currency patterns: $10, $10.00, $.99, $1,000
      return text.replace(/\$(?![\d.,]+[\d\s\-\)])([^$\n]+?)\$/g, (_m, expr) => {
        try {
          return katex.renderToString(String(expr).trim(), {
            ...renderOptions,
            displayMode: false,
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
              return katex.renderToString(content.trim(), {
                ...renderOptions,
                displayMode: true,
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
        return katex.renderToString(String(latex).trim(), {
          ...renderOptions,
          displayMode: true,
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
