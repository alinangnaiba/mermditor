export interface GuideShortcut {
  label: string
  keys: string[]
}

export interface GuideSectionData {
  id: string
  title: string
  description?: string
  tableHeaders?: string[]
  tableRows?: string[][]
  codeLang?: string
  codeSample?: string
  callout?: string
  shortcuts?: GuideShortcut[]
}

export const guideSections: GuideSectionData[] = [
  {
    id: 'headings',
    title: 'Headings',
    description:
      'Use <code>#</code> symbols at the start of a line. One <code>#</code> is H1, up to six <code>######</code> for H6.',
    tableHeaders: ['Syntax', 'Output'],
    tableRows: [
      ['<code># Heading 1</code>', '<span style="font-size:1.1em;font-weight:700;">Heading 1</span>'],
      ['<code>## Heading 2</code>', '<span style="font-weight:700;">Heading 2</span>'],
      ['<code>### Heading 3</code>', '<span style="font-size:0.95em;font-weight:700;">Heading 3</span>'],
      ['<code>#### Heading 4</code>', '<span style="font-size:0.875em;color:var(--dim);">Heading 4</span>'],
    ],
  },
  {
    id: 'formatting',
    title: 'Text Formatting',
    tableHeaders: ['Syntax', 'Output', 'Notes'],
    tableRows: [
      ['<code>**bold**</code>', '<strong>bold</strong>', 'or <code>__bold__</code>'],
      ['<code>*italic*</code>', '<em>italic</em>', 'or <code>_italic_</code>'],
      ['<code>~~strikethrough~~</code>', '<s>strikethrough</s>', ''],
      ['<code>==highlight==</code>', '<mark class="ref-mark">highlight</mark>', 'Extended'],
      ['<code>H~2~O</code>', 'H<sub>2</sub>O', 'Subscript'],
      ['<code>x^2^</code>', 'x<sup>2</sup>', 'Superscript'],
      ['<code>`inline code`</code>', '<code>inline code</code>', ''],
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    description:
      'Unordered lists use <code>-</code>, <code>*</code>, or <code>+</code>. Ordered lists use a number followed by a period.',
    codeLang: 'Markdown',
    codeSample: `- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2
   1. Nested ordered item`,
  },
  {
    id: 'task-lists',
    title: 'Task Lists',
    description: 'Use <code>- [ ]</code> for unchecked and <code>- [x]</code> for checked items.',
    codeLang: 'Markdown',
    codeSample: `- [x] Design the UI
- [x] Write the parser
- [ ] Add tests
- [ ] Deploy`,
    callout:
      'Toolbar shortcut: <strong>Task</strong> button, or <kbd class="shortcut-kbd">Ctrl</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">Shift</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">L</kbd>',
  },
  {
    id: 'links',
    title: 'Links & Images',
    tableHeaders: ['Syntax', 'Output'],
    tableRows: [
      ['<code>[Link text](https://example.com)</code>', 'Hyperlink'],
      ['<code>[Title](url "tooltip")</code>', 'Link with tooltip'],
      ['<code>![Alt text](image.png)</code>', 'Inline image'],
      ['<code>[![Alt](img.png)](url)</code>', 'Linked image'],
    ],
  },
  {
    id: 'code',
    title: 'Code',
    description:
      'Use backticks for inline code and triple backticks for fenced code blocks. Add a language name after the opening backticks for syntax highlighting.',
    codeLang: 'Markdown',
    codeSample: '`Inline code`\n\n```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```',
  },
  {
    id: 'tables',
    title: 'Tables',
    description:
      'Use pipes <code>|</code> to separate columns and hyphens <code>---</code> for the header separator. Colons set column alignment.',
    codeLang: 'Markdown',
    codeSample: `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |

| Left  | Center | Right |
|:------|:------:|------:|
| Cell  | Cell   | Cell  |`,
  },
  {
    id: 'blockquotes',
    title: 'Blockquotes',
    description:
      'Use <code>&gt;</code> at the start of a line. Nest with multiple <code>&gt;&gt;</code> symbols.',
    codeLang: 'Markdown',
    codeSample: `> This is a blockquote
>
> Multiple paragraphs

> Outer quote
>> Nested quote`,
  },
  {
    id: 'extended',
    title: 'Extended Syntax',
    description:
      'merMDitor supports several extensions to standard CommonMark via markdown-it plugins.',
    tableHeaders: ['Syntax', 'Output', 'Plugin'],
    tableRows: [
      ['<code>==highlight==</code>', '<mark class="ref-mark">highlight</mark>', 'markdown-it-mark'],
      ['<code>H~2~O</code>', 'H<sub>2</sub>O', 'markdown-it-sub'],
      ['<code>x^2^</code>', 'x<sup>2</sup>', 'markdown-it-sup'],
      ['<code>[^1]</code> + <code>[^1]: text</code>', 'Footnote<sup>1</sup>', 'markdown-it-footnote'],
      ['<code>:emoji_name:</code>', '&#x1F600;', 'markdown-it-emoji'],
    ],
  },
  {
    id: 'mermaid-flowchart',
    title: 'Mermaid — Flowcharts',
    description:
      'Use <code>flowchart</code> or <code>graph</code> to create directed diagrams. Direction: <code>TD</code> (top-down), <code>LR</code> (left-right), <code>BT</code>, <code>RL</code>.',
    codeLang: 'Mermaid',
    codeSample: `\`\`\`mermaid
flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E
\`\`\``,
  },
  {
    id: 'mermaid-sequence',
    title: 'Mermaid — Sequence Diagrams',
    description: 'Sequence diagrams show interactions between participants over time.',
    codeLang: 'Mermaid',
    codeSample: `\`\`\`mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!
\`\`\``,
  },
  {
    id: 'mermaid-gantt',
    title: 'Mermaid — Gantt Charts',
    description:
      'Gantt charts illustrate project schedules with tasks, sections, and dependencies.',
    codeLang: 'Mermaid',
    codeSample: `\`\`\`mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Design    :a1, 2024-01-01, 14d
    Build     :after a1, 21d
    section Phase 2
    Testing   :2024-02-15, 10d
\`\`\``,
  },
  {
    id: 'mermaid-other',
    title: 'Mermaid — Other Types',
    tableHeaders: ['Type', 'Keyword'],
    tableRows: [
      ['Class diagram', '<code>classDiagram</code>'],
      ['State diagram', '<code>stateDiagram-v2</code>'],
      ['Entity-Relationship', '<code>erDiagram</code>'],
      ['Pie chart', '<code>pie</code>'],
      ['Mindmap', '<code>mindmap</code>'],
      ['Timeline', '<code>timeline</code>'],
    ],
  },
  {
    id: 'math-inline',
    title: 'Inline Math',
    description:
      'Wrap expressions in single dollar signs <code>$…$</code> to render math inline with text.',
    tableHeaders: ['Syntax', 'Description'],
    tableRows: [
      ['<code>$E = mc^2$</code>', "Einstein's equation"],
      ['<code>$\\pi \\approx 3.14159$</code>', 'Pi approximation'],
      ['<code>$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$</code>', 'Quadratic formula'],
      ['<code>$\\alpha, \\beta, \\gamma$</code>', 'Greek letters inline'],
    ],
  },
  {
    id: 'math-block',
    title: 'Block Math',
    description:
      'Use double dollar signs <code>$$…$$</code> on their own lines for displayed equations.',
    codeLang: 'LaTeX',
    codeSample: `$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$`,
  },
  {
    id: 'math-examples',
    title: 'Math Examples',
    tableHeaders: ['LaTeX', 'Description'],
    tableRows: [
      ['<code>\\frac{a}{b}</code>', 'Fraction'],
      ['<code>\\sqrt{x}</code> / <code>\\sqrt[n]{x}</code>', 'Square root / nth root'],
      ['<code>\\sum_{i=1}^{n} x_i</code>', 'Summation with limits'],
      ['<code>\\int_a^b f(x)\\,dx</code>', 'Definite integral'],
      ['<code>\\begin{pmatrix}…\\end{pmatrix}</code>', 'Matrix (parentheses)'],
      ['<code>\\begin{bmatrix}…\\end{bmatrix}</code>', 'Matrix (brackets)'],
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
