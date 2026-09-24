import { describe, expect, it } from 'vitest'
import { renderMarkdown } from '../../app/utils/markdownItRenderer'

describe('markdown math blocks', () => {
  it('does not parse a setext underline inside $$ as a heading', async () => {
    const html = await renderMarkdown('Some text\n\n$$\n2\n=\n1\n$$\n\nSome more text')

    expect(html).not.toMatch(/<h\d/)
    expect(html).toContain('$$\n2\n=\n1\n$$')
    expect(html).toContain('<p>Some more text</p>')
  })

  it('does not parse an ATX marker inside $$ as a heading', async () => {
    const html = await renderMarkdown('Some text\n\n$$\n2\n###\n1\n$$\n\nSome more text')

    expect(html).not.toMatch(/<h\d/)
    expect(html).toContain('$$\n2\n###\n1\n$$')
    expect(html).toContain('<p>Some more text</p>')
  })

  it('keeps blank lines and list markers inside $$ as math', async () => {
    const html = await renderMarkdown('$$\na\n\n- b\n$$\n\nAfter')

    expect(html).not.toMatch(/<ul|<li/)
    expect(html).toContain('$$\na\n\n- b\n$$')
    expect(html).toContain('<p>After</p>')
  })

  it('does not escape math content that KaTeX reads later', async () => {
    const html = await renderMarkdown('$$\na < b & c\n$$')

    expect(html).toContain('$$\na < b & c\n$$')
  })

  it('leaves $$ mixed with text on the same line as inline content', async () => {
    const html = await renderMarkdown('$$x$$ and text')

    expect(html).toBe('<p>$$x$$ and text</p>\n')
  })

  it('falls back to plain text when $$ is never closed', async () => {
    const html = await renderMarkdown('$$\n# Heading')

    expect(html).toContain('<h1>Heading</h1>')
  })
})
