import type MarkdownIt from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'

export const mathPlugin = (md: MarkdownIt) => {
  // Regex to check if content looks like currency or text start with number/separator
  // Corresponds to (?![\d.,]+[\d\s\-\)]) in regex
  const isCurrencyOrText = /^[\d.,]+[\d\s\-\)]/

  const math_inline = (state: StateInline, silent: boolean) => {
    let start, max, token
    const src = state.src

    if (src[state.pos] !== '$') {
      return false
    }

    start = state.pos
    max = state.posMax

    // Check for $$ (display math)
    if (start + 1 < max && src[start + 1] === '$') {
      let found = false
      let matchEnd = -1
      // Search for closing $$
      for (let i = start + 2; i < max - 1; i++) {
        if (src[i] === '$' && src[i + 1] === '$') {
          found = true
          matchEnd = i
          break
        }
      }

      if (!found) {
        if (!silent) {
          state.pending += '$$'
        }
        state.pos += 2
        return true
      }

      if (!silent) {
        token = state.push('math_display', 'math', 0)
        token.content = src.slice(start + 2, matchEnd)
        token.markup = '$$'
      }
      state.pos = matchEnd + 2
      return true
    }

    // It is $, check for inline math
    let found = false
    let matchEnd = -1

    // Find closing $
    for (let i = start + 1; i < max; i++) {
      if (src[i] === '$') {
        found = true
        matchEnd = i
        break
      }
      if (src[i] === '\n') {
        // No newlines allowed in inline math
        return false
      }
    }

    if (!found) {
      return false
    }

    const content = src.slice(start + 1, matchEnd)

    // Check currency/text pattern
    if (isCurrencyOrText.test(content)) {
      return false
    }

    if (!silent) {
      token = state.push('math_inline', 'math', 0)
      token.content = content
      token.markup = '$'
    }
    state.pos = matchEnd + 1
    return true
  }

  // Display math that starts a line is claimed at the block level, so lines inside it
  // (e.g. `=`, `###`, `- x`, blank lines) are never parsed as headings, lists or paragraphs.
  const math_block = (state: StateBlock, startLine: number, endLine: number, silent: boolean) => {
    const src = state.src
    const start = state.bMarks[startLine]! + state.tShift[startLine]!

    // 4+ spaces of indentation is an indented code block
    if (state.sCount[startLine]! - state.blkIndent >= 4) return false
    if (!src.startsWith('$$', start)) return false

    const firstLine = src.slice(start + 2, state.eMarks[startLine])
    let closeLine = startLine
    let closeIndex = firstLine.indexOf('$$')
    let lastLine = firstLine

    if (closeIndex === -1) {
      for (closeLine = startLine + 1; closeLine < endLine; closeLine++) {
        const lineStart = state.bMarks[closeLine]! + state.tShift[closeLine]!
        const lineEnd = state.eMarks[closeLine]!

        // A non-blank line dedented out of the current container (list, blockquote) ends the search
        if (lineStart < lineEnd && state.sCount[closeLine]! < state.blkIndent) return false

        lastLine = src.slice(lineStart, lineEnd)
        closeIndex = lastLine.indexOf('$$')
        if (closeIndex !== -1) break
      }

      // Unclosed: leave the text to the other rules
      if (closeIndex === -1) return false
    }

    // Text after the closing $$ means this is inline math within a paragraph
    if (lastLine.slice(closeIndex + 2).trim() !== '') return false

    if (silent) return true

    let content: string
    if (closeLine === startLine) {
      content = firstLine.slice(0, closeIndex)
    } else {
      const lines = [firstLine]
      if (closeLine > startLine + 1) {
        lines.push(state.getLines(startLine + 1, closeLine, state.sCount[startLine]!, false))
      }
      lines.push(lastLine.slice(0, closeIndex))
      content = lines.join('\n')
    }

    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = content
    token.markup = '$$'
    token.map = [startLine, closeLine + 1]
    state.line = closeLine + 1
    return true
  }

  md.block.ruler.before('fence', 'math_block', math_block, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.inline.ruler.before('escape', 'math_inline', math_inline)

  md.renderer.rules.math_inline = (tokens, idx) => {
    return '$' + tokens[idx]!.content + '$'
  }

  md.renderer.rules.math_display = (tokens, idx) => {
    return '$$' + tokens[idx]!.content + '$$'
  }

  md.renderer.rules.math_block = (tokens, idx) => {
    return '$$' + tokens[idx]!.content + '$$\n'
  }
}
