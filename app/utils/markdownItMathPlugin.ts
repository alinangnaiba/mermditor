import type MarkdownIt from 'markdown-it'
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

  md.inline.ruler.before('escape', 'math_inline', math_inline)

  md.renderer.rules.math_inline = (tokens, idx) => {
    return '$' + tokens[idx].content + '$'
  }

  md.renderer.rules.math_display = (tokens, idx) => {
    return '$$' + tokens[idx].content + '$$'
  }
}
