<template>
  <div class="guide-doc">

    <!-- ── HEADINGS ── -->
    <div id="headings" class="guide-block">
      <div class="block-heading">Headings</div>
      <p class="block-desc">Use <code>#</code> symbols at the start of a line. One <code>#</code> is H1, up to six <code>######</code> for H6.</p>
      <table class="ref-table">
        <thead><tr><th>Syntax</th><th>Output</th></tr></thead>
        <tbody>
          <tr><td><code># Heading 1</code></td><td class="ref-output" style="font-size:1.1em;font-weight:700;">Heading 1</td></tr>
          <tr><td><code>## Heading 2</code></td><td class="ref-output" style="font-weight:700;">Heading 2</td></tr>
          <tr><td><code>### Heading 3</code></td><td class="ref-output" style="font-size:0.95em;font-weight:700;">Heading 3</td></tr>
          <tr><td><code>#### Heading 4</code></td><td class="ref-output" style="font-size:0.875em;color:var(--dim);">Heading 4</td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── TEXT FORMATTING ── -->
    <div id="formatting" class="guide-block">
      <div class="block-heading">Text Formatting</div>
      <table class="ref-table">
        <thead><tr><th>Syntax</th><th>Output</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>**bold**</code></td><td class="ref-output"><strong>bold</strong></td><td class="ref-note">or <code>__bold__</code></td></tr>
          <tr><td><code>*italic*</code></td><td class="ref-output"><em>italic</em></td><td class="ref-note">or <code>_italic_</code></td></tr>
          <tr><td><code>~~strikethrough~~</code></td><td class="ref-output"><s>strikethrough</s></td><td class="ref-note"></td></tr>
          <tr><td><code>==highlight==</code></td><td class="ref-output"><mark class="ref-mark">highlight</mark></td><td class="ref-note">Extended</td></tr>
          <tr><td><code>H~2~O</code></td><td class="ref-output">H<sub>2</sub>O</td><td class="ref-note">Subscript</td></tr>
          <tr><td><code>x^2^</code></td><td class="ref-output">x<sup>2</sup></td><td class="ref-note">Superscript</td></tr>
          <tr><td><code>`inline code`</code></td><td class="ref-output"><code>inline code</code></td><td class="ref-note"></td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── LISTS ── -->
    <div id="lists" class="guide-block">
      <div class="block-heading">Lists</div>
      <p class="block-desc">Unordered lists use <code>-</code>, <code>*</code>, or <code>+</code>. Ordered lists use a number followed by a period.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Markdown</span></div>
        <pre>- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2
   1. Nested ordered item</pre>
      </div>
    </div>

    <!-- ── TASK LISTS ── -->
    <div id="task-lists" class="guide-block">
      <div class="block-heading">Task Lists</div>
      <p class="block-desc">Use <code>- [ ]</code> for unchecked and <code>- [x]</code> for checked items.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Markdown</span></div>
        <pre>- [x] Design the UI
- [x] Write the parser
- [ ] Add tests
- [ ] Deploy</pre>
      </div>
      <div class="guide-callout">
        Toolbar shortcut: <strong>Task</strong> button, or
        <kbd class="shortcut-kbd">Ctrl</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">Shift</kbd><span class="shortcut-plus">+</span><kbd class="shortcut-kbd">L</kbd>
      </div>
    </div>

    <!-- ── LINKS & IMAGES ── -->
    <div id="links" class="guide-block">
      <div class="block-heading">Links &amp; Images</div>
      <table class="ref-table">
        <thead><tr><th>Syntax</th><th>Output</th></tr></thead>
        <tbody>
          <tr><td><code>[Link text](https://example.com)</code></td><td class="ref-output">Hyperlink</td></tr>
          <tr><td><code>[Title](url "tooltip")</code></td><td class="ref-output">Link with tooltip</td></tr>
          <tr><td><code>![Alt text](image.png)</code></td><td class="ref-output">Inline image</td></tr>
          <tr><td><code>[![Alt](img.png)](url)</code></td><td class="ref-output">Linked image</td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── CODE ── -->
    <div id="code" class="guide-block">
      <div class="block-heading">Code</div>
      <p class="block-desc">Use backticks for inline code and triple backticks for fenced code blocks. Add a language name after the opening backticks for syntax highlighting.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Markdown</span></div>
        <pre>`Inline code`

```javascript
function hello() {
  console.log("Hello, World!");
}
```</pre>
      </div>
    </div>

    <!-- ── TABLES ── -->
    <div id="tables" class="guide-block">
      <div class="block-heading">Tables</div>
      <p class="block-desc">Use pipes <code>|</code> to separate columns and hyphens <code>---</code> for the header separator. Colons set column alignment.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Markdown</span></div>
        <pre>| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |

| Left  | Center | Right |
|:------|:------:|------:|
| Cell  | Cell   | Cell  |</pre>
      </div>
    </div>

    <!-- ── BLOCKQUOTES ── -->
    <div id="blockquotes" class="guide-block">
      <div class="block-heading">Blockquotes</div>
      <p class="block-desc">Use <code>&gt;</code> at the start of a line. Nest with multiple <code>&gt;&gt;</code> symbols.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Markdown</span></div>
        <pre>&gt; This is a blockquote
&gt;
&gt; Multiple paragraphs

&gt; Outer quote
&gt;&gt; Nested quote</pre>
      </div>
    </div>

    <!-- ── EXTENDED SYNTAX ── -->
    <div id="extended" class="guide-block">
      <div class="block-heading">Extended Syntax</div>
      <p class="block-desc">merMDitor supports several extensions to standard CommonMark via markdown-it plugins.</p>
      <table class="ref-table">
        <thead><tr><th>Syntax</th><th>Output</th><th>Plugin</th></tr></thead>
        <tbody>
          <tr><td><code>==highlight==</code></td><td class="ref-output"><mark class="ref-mark">highlight</mark></td><td class="ref-note">markdown-it-mark</td></tr>
          <tr><td><code>H~2~O</code></td><td class="ref-output">H<sub>2</sub>O</td><td class="ref-note">markdown-it-sub</td></tr>
          <tr><td><code>x^2^</code></td><td class="ref-output">x<sup>2</sup></td><td class="ref-note">markdown-it-sup</td></tr>
          <tr><td><code>[^1]</code> + <code>[^1]: text</code></td><td class="ref-output">Footnote<sup>1</sup></td><td class="ref-note">markdown-it-footnote</td></tr>
          <tr><td><code>:emoji_name:</code></td><td class="ref-output">&#x1F600;</td><td class="ref-note">markdown-it-emoji</td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── MERMAID: FLOWCHARTS ── -->
    <div id="mermaid-flowchart" class="guide-block">
      <div class="block-heading">Mermaid — Flowcharts</div>
      <p class="block-desc">Use <code>flowchart</code> or <code>graph</code> to create directed diagrams. Direction: <code>TD</code> (top-down), <code>LR</code> (left-right), <code>BT</code>, <code>RL</code>.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Mermaid</span></div>
        <pre>```mermaid
flowchart TD
    A[Start] --&gt; B{Decision?}
    B --&gt;|Yes| C[Process A]
    B --&gt;|No| D[Process B]
    C --&gt; E[End]
    D --&gt; E
```</pre>
      </div>
    </div>

    <!-- ── MERMAID: SEQUENCE ── -->
    <div id="mermaid-sequence" class="guide-block">
      <div class="block-heading">Mermaid — Sequence Diagrams</div>
      <p class="block-desc">Sequence diagrams show interactions between participants over time.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Mermaid</span></div>
        <pre>```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A-&gt;&gt;B: Hello Bob, how are you?
    B--&gt;&gt;A: Great!
    A-)B: See you later!
```</pre>
      </div>
    </div>

    <!-- ── MERMAID: GANTT ── -->
    <div id="mermaid-gantt" class="guide-block">
      <div class="block-heading">Mermaid — Gantt Charts</div>
      <p class="block-desc">Gantt charts illustrate project schedules with tasks, sections, and dependencies.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">Mermaid</span></div>
        <pre>```mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Phase 1
    Design    :a1, 2024-01-01, 14d
    Build     :after a1, 21d
    section Phase 2
    Testing   :2024-02-15, 10d
```</pre>
      </div>
    </div>

    <!-- ── MERMAID: OTHER ── -->
    <div id="mermaid-other" class="guide-block">
      <div class="block-heading">Mermaid — Other Types</div>
      <table class="ref-table">
        <thead><tr><th>Type</th><th>Keyword</th></tr></thead>
        <tbody>
          <tr><td class="ref-output">Class diagram</td><td><code>classDiagram</code></td></tr>
          <tr><td class="ref-output">State diagram</td><td><code>stateDiagram-v2</code></td></tr>
          <tr><td class="ref-output">Entity-Relationship</td><td><code>erDiagram</code></td></tr>
          <tr><td class="ref-output">Pie chart</td><td><code>pie</code></td></tr>
          <tr><td class="ref-output">Mindmap</td><td><code>mindmap</code></td></tr>
          <tr><td class="ref-output">Timeline</td><td><code>timeline</code></td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── MATH: INLINE ── -->
    <div id="math-inline" class="guide-block">
      <div class="block-heading">Inline Math</div>
      <p class="block-desc">Wrap expressions in single dollar signs <code>$…$</code> to render math inline with text.</p>
      <table class="ref-table">
        <thead><tr><th>Syntax</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>$E = mc^2$</code></td><td class="ref-output">Einstein's equation</td></tr>
          <tr><td><code>$\pi \approx 3.14159$</code></td><td class="ref-output">Pi approximation</td></tr>
          <tr><td><code>$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$</code></td><td class="ref-output">Quadratic formula</td></tr>
          <tr><td><code>$\alpha, \beta, \gamma$</code></td><td class="ref-output">Greek letters inline</td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── MATH: BLOCK ── -->
    <div id="math-block" class="guide-block">
      <div class="block-heading">Block Math</div>
      <p class="block-desc">Use double dollar signs <code>$$…$$</code> on their own lines for displayed equations.</p>
      <div class="code-example">
        <div class="code-example-header"><span class="code-lang">LaTeX</span></div>
        <pre>$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$</pre>
      </div>
    </div>

    <!-- ── MATH: EXAMPLES ── -->
    <div id="math-examples" class="guide-block">
      <div class="block-heading">Math Examples</div>
      <table class="ref-table">
        <thead><tr><th>LaTeX</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>\frac{a}{b}</code></td><td class="ref-output">Fraction</td></tr>
          <tr><td><code>\sqrt{x}</code> / <code>\sqrt[n]{x}</code></td><td class="ref-output">Square root / nth root</td></tr>
          <tr><td><code>\sum_{i=1}^{n} x_i</code></td><td class="ref-output">Summation with limits</td></tr>
          <tr><td><code>\int_a^b f(x)\,dx</code></td><td class="ref-output">Definite integral</td></tr>
          <tr><td><code>\begin{pmatrix}…\end{pmatrix}</code></td><td class="ref-output">Matrix (parentheses)</td></tr>
          <tr><td><code>\begin{bmatrix}…\end{bmatrix}</code></td><td class="ref-output">Matrix (brackets)</td></tr>
        </tbody>
      </table>
    </div>

    <!-- ── SHORTCUTS: FORMATTING ── -->
    <div id="shortcuts-format" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — Formatting</div>
      <p class="block-desc">Select text first, then apply a shortcut to wrap it.</p>
      <div class="shortcut-grid">
        <div v-for="s in formattingShortcuts" :key="s.label" class="shortcut-row">
          <span class="shortcut-label">{{ s.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, i) in s.keys" :key="i">
              <span v-if="i > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SHORTCUTS: FILE ── -->
    <div id="shortcuts-file" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — File Operations</div>
      <div class="shortcut-grid">
        <div v-for="s in fileShortcuts" :key="s.label" class="shortcut-row">
          <span class="shortcut-label">{{ s.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, i) in s.keys" :key="i">
              <span v-if="i > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ── SHORTCUTS: VIEW ── -->
    <div id="shortcuts-view" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — View</div>
      <div class="shortcut-grid">
        <div v-for="s in viewShortcuts" :key="s.label" class="shortcut-row">
          <span class="shortcut-label">{{ s.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, i) in s.keys" :key="i">
              <span v-if="i > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
  // activeTab prop kept for compatibility; all sections now render continuously
  defineProps<{ activeTab?: string }>()

  const formattingShortcuts = [
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

  const fileShortcuts = [
    { label: 'Import file', keys: ['Ctrl', 'O'] },
    { label: 'Export / Save As', keys: ['Ctrl', 'Shift', 'S'] },
    { label: 'Save (autosave)', keys: ['Ctrl', 'S'] },
    { label: 'Find', keys: ['Ctrl', 'F'] },
  ]

  const viewShortcuts = [
    { label: 'Toggle preview', keys: ['Ctrl', 'Shift', 'P'] },
    { label: 'Toggle editor', keys: ['Ctrl', 'Shift', 'E'] },
    { label: 'Image insert', keys: ['Ctrl', 'Shift', 'M'] },
  ]
</script>

<style scoped>
.guide-block {
  margin-bottom: 2.75rem;
  scroll-margin-top: 72px;
}

.block-heading {
  font-size: 1.0625rem;
  font-weight: 700;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border);
}

.block-desc {
  color: var(--dim);
  font-size: 0.9375rem;
  margin-bottom: 1.25rem;
  line-height: 1.65;
}

.block-desc code {
  font-family: 'SF Mono', 'Fira Mono', monospace;
  background: var(--raised);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.82em;
  color: var(--orange);
}

.ref-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.ref-table th {
  text-align: left;
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--border);
}

.ref-table td {
  padding: 9px 14px;
  border: 1px solid var(--border);
  color: var(--dim);
  vertical-align: middle;
}

.ref-table tr:hover td { background: var(--surface); }

.ref-table code {
  font-family: 'SF Mono', 'Fira Mono', monospace;
  background: var(--raised);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.82em;
  color: var(--orange);
}

.ref-output { color: var(--text); }

.ref-mark {
  background: rgba(255, 230, 0, 0.15);
  color: var(--text);
  padding: 1px 4px;
  border-radius: 2px;
}

.ref-note {
  font-size: 0.8125rem;
  color: var(--muted);
}

.ref-note code {
  font-family: 'SF Mono', 'Fira Mono', monospace;
  background: var(--raised);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.82em;
  color: var(--orange);
}

.code-example {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.code-example-header {
  display: flex;
  align-items: center;
  padding: 7px 14px;
  background: var(--raised);
  border-bottom: 1px solid var(--border);
}

.code-lang {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.code-example pre {
  padding: 14px 16px;
  font-family: 'SF Mono', 'Fira Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--dim);
  overflow-x: auto;
  background: var(--surface);
  margin: 0;
  white-space: pre;
}

.guide-callout {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-radius: 5px;
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: 0.875rem;
  color: var(--dim);
  margin-bottom: 1.25rem;
  line-height: 1.65;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 1.5rem;
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 5px;
}

.shortcut-label {
  font-size: 0.875rem;
  color: var(--dim);
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 2px;
}

.shortcut-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 22px;
  padding: 0 6px;
  background: var(--raised);
  border: 1px solid var(--border);
  border-bottom-width: 2px;
  border-radius: 3px;
  font-family: 'SF Mono', monospace;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--dim);
}

.shortcut-plus {
  color: var(--muted);
  font-size: 0.65rem;
  margin: 0 1px;
}

@media (max-width: 600px) {
  .shortcut-grid { grid-template-columns: 1fr; }
}
</style>
