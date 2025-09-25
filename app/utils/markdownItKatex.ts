declare global {
  interface Window {
    katex: {
      renderToString: (
        tex: string,
        options?: {
          displayMode?: boolean
          throwOnError?: boolean
          strict?: boolean
        }
      ) => string
    }
  }
}

export const waitForKatex = (): Promise<void> => {
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

export const processLatex = async (html: string): Promise<string> => {
  if (!import.meta.client) return html
  await waitForKatex()
  if (window.katex) {
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

    // Process display math ($$...$$)
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        return `<div class="katex-display">${window.katex.renderToString(math.trim(), { displayMode: true, throwOnError: false, strict: false })}</div>`
      } catch (error) {
        console.error('LaTeX display math error:', error)
        return `<div class="text-red-400">LaTeX Error: ${match}</div>`
      }
    })

    // Process inline math ($...$)
    html = html.replace(/\$([^$\n]+?)\$/g, (match, math) => {
      try {
        return window.katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
          strict: false,
        })
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
  }

  return html
}

export const renderLatexExample = (latex: string, isBlock: boolean = false): string => {
  try {
    if (!import.meta.client || !window.katex) return latex

    const renderInlineSegment = (text: string): string => {
      // Replace $...$ inline math (no newline inside)
      return text.replace(/\$([^$\n]+?)\$/g, (_m, expr) => {
        try {
          return window.katex.renderToString(String(expr).trim(), {
            displayMode: false,
            throwOnError: false,
            strict: false,
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
                strict: false,
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
          strict: false,
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
