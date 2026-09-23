export interface GuideShortcut {
  label: string
  keys: string[]
}

export type GuideExampleKind = 'markdown' | 'mermaid'

export interface GuideExample {
  label?: string
  /** Selects the renderer used for the preview card. Defaults to `markdown`. */
  kind?: GuideExampleKind
  /** Label shown on the syntax card. Defaults to the kind name. */
  lang?: string
  /** Raw text a user would type in the editor. For `mermaid`, omit the code fence. */
  source: string
}

export interface GuideSectionData {
  id: string
  title: string
  description?: string
  examples?: GuideExample[]
  callout?: string
  shortcuts?: GuideShortcut[]
}

export const guideSections: GuideSectionData[] = [
  {
    id: 'headings',
    title: 'Headings',
    description:
      'Use <code>#</code> symbols at the start of a line. One <code>#</code> is H1, up to six <code>######</code> for H6.',
    examples: [
      {
        source: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
      },
    ],
  },
  {
    id: 'formatting',
    title: 'Text Formatting',
    description:
      'Wrap text in markers to emphasise it. Bold and italic can be combined, and the extended markers add highlight, subscript, and superscript.',
    examples: [
      {
        source: `**Bold text** and __also bold__

*Italic text* and _also italic_

***Bold and italic together***

~~Strikethrough~~ and ==highlighted==

H~2~O is a subscript, x^2^ is a superscript

Use \`inline code\` for short snippets`,
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    description:
      'Unordered lists use <code>-</code>, <code>*</code>, or <code>+</code>. Ordered lists use a number followed by a period. Align a nested item with the parent item’s content: typically two spaces for bullets and three for numbered markers such as <code>1.</code>.',
    examples: [
      {
        source: `- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2
   1. Nested ordered item`,
      },
    ],
  },
  {
    id: 'task-lists',
    title: 'Task Lists',
    description: 'Use <code>- [ ]</code> for unchecked and <code>- [x]</code> for checked items.',
    examples: [
      {
        source: `- [x] Design the UI
- [x] Write the parser
- [ ] Add tests
- [ ] Deploy`,
      },
    ],
    callout:
      'Toolbar shortcut: <strong>Task</strong> button, or <kbd class="shortcut-kbd">Ctrl</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">Shift</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">L</kbd>',
  },
  {
    id: 'links',
    title: 'Links & Images',
    description:
      'Links use <code>[text](url)</code>. Images use the same syntax with a leading <code>!</code>. Add a quoted string after the URL for a tooltip.',
    examples: [
      {
        source: `[Link text](https://example.com)

[Hover me](https://example.com "Tooltip text")

![merMDitor icon](/favicon.ico)

[![Linked image](/favicon.ico)](https://example.com)`,
      },
    ],
  },
  {
    id: 'code',
    title: 'Code',
    description:
      'Use backticks for inline code and triple backticks for fenced code blocks. Add a language name after the opening backticks for syntax highlighting.',
    examples: [
      {
        source: `Call \`renderMarkdown()\` to convert text to HTML.

\`\`\`javascript
function hello(name) {
  console.log('Hello, ' + name)
}
\`\`\``,
      },
    ],
  },
  {
    id: 'tables',
    title: 'Tables',
    description:
      'Use pipes <code>|</code> to separate columns and hyphens <code>---</code> for the header separator. Colons set column alignment.',
    examples: [
      {
        source: `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |`,
      },
      {
        label: 'Column alignment',
        source: `| Left  | Center | Right |
|:------|:------:|------:|
| Cell  | Cell   | Cell  |
| Cell  | Cell   | Cell  |`,
      },
    ],
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    description:
      'Use <code>&gt;</code> at the start of a line. Nest with multiple <code>&gt;&gt;</code> symbols.',
    examples: [
      {
        source: `> This is a blockquote
>
> Multiple paragraphs

> Outer quote
>> Nested quote`,
      },
    ],
  },
  {
    id: 'extended',
    title: 'Extended Syntax',
    description:
      'merMDitor supports several extensions to standard CommonMark: highlight (<code>markdown-it-mark</code>), subscript and superscript (<code>markdown-it-sub</code> / <code>markdown-it-sup</code>), definition lists (<code>markdown-it-deflist</code>), emoji shortcodes (<code>markdown-it-emoji</code>), and footnotes (<code>markdown-it-footnote</code>).',
    examples: [
      {
        source: `==Highlighted text== stands out.

Water is H~2~O and the area is r^2^.

Markdown
: A lightweight markup language
Mermaid
: Diagrams written as text

Emoji shortcodes :rocket: :sparkles: :tada:

Footnotes are supported[^1]

[^1]: Footnote text renders at the bottom of the document.`,
      },
    ],
  },
  {
    id: 'mermaid-flowchart',
    title: 'Mermaid — Flowcharts',
    description:
      'Put the diagram inside a <code>mermaid</code> code fence. Use <code>flowchart</code> or <code>graph</code> with a direction: <code>TD</code> (top-down), <code>LR</code> (left-right), <code>BT</code>, <code>RL</code>.',
    examples: [
      {
        kind: 'mermaid',
        source: `flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E`,
      },
    ],
  },
  {
    id: 'mermaid-sequence',
    title: 'Mermaid — Sequence Diagrams',
    description: 'Sequence diagrams show interactions between participants over time.',
    examples: [
      {
        kind: 'mermaid',
        source: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!`,
      },
    ],
  },
  {
    id: 'mermaid-gantt',
    title: 'Mermaid — Gantt Charts',
    description:
      'Gantt charts illustrate project schedules with tasks, sections, and dependencies.',
    examples: [
      {
        kind: 'mermaid',
        source: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Design    :a1, 2024-01-01, 14d
    Build     :after a1, 21d
    section Phase 2
    Testing   :2024-02-15, 10d`,
      },
    ],
  },
  {
    id: 'mermaid-other',
    title: 'Mermaid — Other Types',
    description:
      'The same code fence supports every Mermaid diagram type, including <code>mindmap</code>, <code>timeline</code>, <code>journey</code>, and <code>quadrantChart</code>.',
    examples: [
      {
        label: 'Class diagram',
        kind: 'mermaid',
        source: `classDiagram
    class Document {
      +String title
      +render()
    }
    class Preview {
      +update()
    }
    Document --> Preview : renders`,
      },
      {
        label: 'State diagram',
        kind: 'mermaid',
        source: `stateDiagram-v2
    [*] --> Draft
    Draft --> Review : submit
    Review --> Published : approve
    Review --> Draft : changes
    Published --> [*]`,
      },
      {
        label: 'Entity relationship',
        kind: 'mermaid',
        source: `erDiagram
    USER ||--o{ DOCUMENT : owns
    DOCUMENT ||--|{ SECTION : contains`,
      },
      {
        label: 'Pie chart',
        kind: 'mermaid',
        source: `pie title Time spent
    "Writing" : 45
    "Diagrams" : 30
    "Math" : 25`,
      },
    ],
  },
  {
    id: 'math-inline',
    title: 'Inline Math',
    description:
      'Wrap expressions in single dollar signs <code>$…$</code> to render math inline with text.',
    examples: [
      {
        lang: 'LaTeX',
        source: `Einstein's equation is $E = mc^2$ and $\\pi \\approx 3.14159$.

The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$.

Greek letters inline: $\\alpha, \\beta, \\gamma$.`,
      },
    ],
  },
  {
    id: 'math-block',
    title: 'Block Math',
    description:
      'Use double dollar signs <code>$$…$$</code> on their own lines for centered, displayed equations.',
    examples: [
      {
        lang: 'LaTeX',
        source: `$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$`,
      },
    ],
  },
  {
    id: 'math-examples',
    title: 'Math Examples',
    description: 'Common constructions you can drop into inline or block math.',
    examples: [
      {
        label: 'Fractions and roots',
        lang: 'LaTeX',
        source: `$$
\\frac{a}{b} \\qquad \\sqrt{x} \\qquad \\sqrt[n]{x}
$$`,
      },
      {
        label: 'Sums and integrals',
        lang: 'LaTeX',
        source: `$$
\\sum_{i=1}^{n} x_i \\qquad \\int_a^b f(x)\\,dx
$$`,
      },
      {
        label: 'Matrices',
        lang: 'LaTeX',
        source: `$$
\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}
\\qquad
\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}
$$`,
      },
    ],
  },
]

export const formattingShortcuts: GuideShortcut[] = [
  { label: 'Bold', keys: ['Ctrl', 'B'] },
  { label: 'Italic', keys: ['Ctrl', 'I'] },
  { label: 'Highlight', keys: ['Ctrl', 'Shift', 'H'] },
  { label: 'Insert link', keys: ['Ctrl', 'K'] },
  { label: 'Blockquote', keys: ['Ctrl', 'Q'] },
  { label: 'Task list', keys: ['Ctrl', 'Shift', 'L'] },
  { label: 'Code block', keys: ['Ctrl', 'Shift', '~'] },
  { label: 'Heading 1–6', keys: ['Ctrl', '1–6'] },
  { label: 'Subscript', keys: ['Ctrl', 'Shift', 'Y'] },
  { label: 'Superscript', keys: ['Ctrl', 'Shift', 'U'] },
]

export const fileShortcuts: GuideShortcut[] = [
  { label: 'Import file', keys: ['Ctrl', 'O'] },
  { label: 'Export / Save As', keys: ['Ctrl', 'Shift', 'S'] },
  { label: 'Save (autosave)', keys: ['Ctrl', 'S'] },
  { label: 'Find', keys: ['Ctrl', 'F'] },
]

export const viewShortcuts: GuideShortcut[] = [
  { label: 'Toggle preview', keys: ['Ctrl', 'Shift', 'P'] },
  { label: 'Toggle editor', keys: ['Ctrl', 'Shift', 'E'] },
  { label: 'Image insert', keys: ['Ctrl', 'Shift', 'M'] },
]
