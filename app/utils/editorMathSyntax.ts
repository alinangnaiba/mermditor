import { tags } from '@lezer/highlight'
import type { BlockContext, Element, Line, MarkdownConfig } from '@lezer/markdown'

// Internal Line fields that @lezer/markdown's own FencedCode parser relies on:
// `depth` is how many container blocks (lists, blockquotes) still match this line,
// `markers` holds container markup such as `>` that must be kept in the tree.
type LineInternals = Line & { depth: number; markers: Element[] }

/**
 * Whether a line opens a display math block. Mirrors the markdown-it `math_block`
 * rule: `$$` at the start of the line, and if it also closes on this line, nothing
 * may follow the closing `$$` (otherwise it is inline math within a paragraph).
 */
const isDisplayMathStart = (line: Line): boolean => {
  if (line.indent - line.baseIndent >= 4) return false
  if (!line.text.startsWith('$$', line.pos)) return false

  const close = line.text.indexOf('$$', line.pos + 2)
  return close === -1 || line.skipSpace(close + 2) === line.text.length
}

const parseDisplayMath = (cx: BlockContext, line: Line): boolean => {
  if (!isDisplayMathStart(line)) return false

  const from = cx.lineStart + line.pos
  const marks: Element[] = [cx.elt('DisplayMathMark', from, from + 2)]
  const sameLineClose = line.text.indexOf('$$', line.pos + 2)

  if (sameLineClose !== -1) {
    marks.push(cx.elt('DisplayMathMark', cx.lineStart + sameLineClose, cx.lineStart + sameLineClose + 2))
    cx.nextLine()
  } else {
    const current = line as LineInternals
    while (cx.nextLine() && current.depth >= cx.depth) {
      marks.push(...current.markers)

      const close = line.text.indexOf('$$', line.pos)
      if (close !== -1) {
        marks.push(cx.elt('DisplayMathMark', cx.lineStart + close, cx.lineStart + close + 2))
        cx.nextLine()
        break
      }
    }
  }

  cx.addElement(cx.elt('DisplayMath', from, cx.prevLineEnd(), marks))
  return true
}

/**
 * Editor (CodeMirror) counterpart of the markdown-it `math_block` rule: claims
 * `$$ … $$` blocks so their lines are not highlighted as headings, lists, etc.
 */
export const displayMathSyntax: MarkdownConfig = {
  defineNodes: [
    { name: 'DisplayMath', block: true },
    { name: 'DisplayMathMark', style: tags.processingInstruction },
  ],
  parseBlock: [
    {
      name: 'DisplayMath',
      before: 'FencedCode',
      parse: parseDisplayMath,
      endLeaf: (_cx, line) => isDisplayMathStart(line),
    },
  ],
}
