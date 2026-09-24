import { describe, expect, it } from 'vitest'
import { parser } from '@lezer/markdown'
import { displayMathSyntax } from '../../app/utils/editorMathSyntax'

const mathParser = parser.configure(displayMathSyntax)

const nodeNames = (doc: string): string[] => {
  const names: string[] = []
  mathParser.parse(doc).iterate({
    enter: (node) => {
      names.push(node.name)
    },
  })
  return names
}

describe('editor display math syntax', () => {
  it('does not treat a setext underline inside $$ as a heading', () => {
    const names = nodeNames('$$\n2\n=\n1\n$$\n\nSome more text')

    expect(names).toContain('DisplayMath')
    expect(names).not.toContain('SetextHeading1')
    expect(names).toContain('Paragraph')
  })

  it('does not treat an ATX marker inside $$ as a heading', () => {
    const names = nodeNames('$$\n2\n###\n1\n$$')

    expect(names).toContain('DisplayMath')
    expect(names.filter((name) => name.startsWith('ATXHeading'))).toEqual([])
  })

  it('keeps blank lines and list markers inside $$', () => {
    const names = nodeNames('$$\na\n\n- b\n$$')

    expect(names).toContain('DisplayMath')
    expect(names).not.toContain('BulletList')
  })

  it('marks both $$ delimiters', () => {
    const names = nodeNames('$$\nx\n$$')

    expect(names.filter((name) => name === 'DisplayMathMark')).toHaveLength(2)
  })

  it('treats single-line $$x$$ as display math', () => {
    expect(nodeNames('$$x$$')).toContain('DisplayMath')
  })

  it('leaves $$ mixed with text on the same line to the paragraph', () => {
    const names = nodeNames('$$x$$ and text')

    expect(names).not.toContain('DisplayMath')
    expect(names).toContain('Paragraph')
  })

  it('stops at the end of its container when $$ is not closed inside it', () => {
    const tree = mathParser.parse('> $$\n> x\n\n# After')
    const heading = tree.topNode.getChild('ATXHeading1')

    expect(tree.topNode.getChild('Blockquote')?.getChild('DisplayMath')).toBeTruthy()
    expect(heading?.parent?.name).toBe('Document')
  })

  it('parses markdown after the closing $$ normally', () => {
    const names = nodeNames('$$\nx\n$$\n# Heading')

    expect(names).toContain('ATXHeading1')
  })
})
