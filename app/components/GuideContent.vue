<template>
  <div class="prose prose-invert max-w-none">
    <!-- Markdown Tab -->
    <div v-show="currentActiveTab === 'markdown'">
      <h2 class="mb-6">Markdown Syntax</h2>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Left Side - Navigation -->
        <div class="lg:col-span-1">
          <div class="sticky top-4">
            <h3 class="mb-4 text-lg font-semibold text-white">Sections</h3>
            <nav class="space-y-2">
              <button
                v-for="section in markdownSections"
                :key="section.id"
                :class="[
                  'block w-full rounded px-3 py-2 text-left text-sm transition-colors',
                  activeMarkdownSection === section.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                ]"
                @click="activeMarkdownSection = section.id"
              >
                {{ section.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Right Side - Content -->
        <div class="lg:col-span-3">
          <div class="space-y-8">
            <!-- Headers Section -->
            <section v-show="activeMarkdownSection === 'headers'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Headers</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code># H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Text Formatting Section -->
            <section v-show="activeMarkdownSection === 'formatting'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Text Formatting</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>**Bold text**
*Italic text*
~~Strikethrough text~~
==Highlight text==
`Inline code`</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="**Bold text**
*Italic text*
~~Strikethrough text~~
==Highlight text==
`Inline code`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Lists Section -->
            <section v-show="activeMarkdownSection === 'lists'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Lists</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item

- [x] Task list item (completed)
- [ ] Task list item (incomplete)</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="- Unordered list item 1
- Unordered list item 2
  - Nested item

1. Ordered list item 1
2. Ordered list item 2
   1. Nested ordered item

- [x] Task list item (completed)
- [ ] Task list item (incomplete)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Links & Images Section -->
            <section v-show="activeMarkdownSection === 'links'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Links & Images</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>[Link text](https://example.com)
[Link with title](https://example.com "Optional title")

![Alt text](https://picsum.photos/id/40/200/300)
![Alt text](https://picsum.photos/id/40/200/300 "Here kitty kitty")</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content='[Link text](https://example.com)
[Link with title](https://example.com "Optional title")

![Alt text](https://picsum.photos/id/40/200/300)
![Alt text](https://picsum.photos/id/40/200/300 "Here kitty kitty")'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Code Section -->
            <section v-show="activeMarkdownSection === 'code'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Code</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>`Inline code`

```javascript
function hello() {
    console.log("Hello, World!");
}
```

```python
def greet(name):
    print(f"Hello, {name}!")
```</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        :content="`\`Inline code\`

\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`

\`\`\`python
def greet(name):
    print(f'Hello, {name}!')
\`\`\``"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tables Section -->
            <section v-show="activeMarkdownSection === 'tables'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Tables</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |

| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
| Aligned | Text | Here |</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | More     |
| Row 2    | Data     | More     |

| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
| Aligned | Text | Here |"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Blockquotes Section -->
            <section v-show="activeMarkdownSection === 'blockquotes'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Blockquotes</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>> This is a blockquote
>
> You can have multiple paragraphs

> This is a blockquote
>> This is a nested blockquote</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="> This is a blockquote
>
> You can have multiple paragraphs

> This is a blockquote
>> This is a nested blockquote"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Extended Syntax Section -->
            <section v-show="activeMarkdownSection === 'extended'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Extended Syntax</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>H~2~O (subscript)
X^2^ (superscript)

Footnote reference[^1]

[^1]: This is the footnote.

Term 1
: Definition 1

Term 2
: Definition 2
: Another definition</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MarkdownExample
                        content="H~2~O (subscript)
X^2^ (superscript)

Footnote reference[^1]

[^1]: This is the footnote.

Term 1
: Definition 1

Term 2
: Definition 2
: Another definition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Mermaid Tab -->
    <div v-show="currentActiveTab === 'mermaid'">
      <h2 class="mb-6">Mermaid Diagrams</h2>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Left Side - Navigation -->
        <div class="lg:col-span-1">
          <div class="sticky top-4">
            <h3 class="mb-4 text-lg font-semibold text-white">Sections</h3>
            <nav class="space-y-2">
              <button
                v-for="section in mermaidSections"
                :key="section.id"
                :class="[
                  'block w-full rounded px-3 py-2 text-left text-sm transition-colors',
                  activeMermaidSection === section.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                ]"
                @click="activeMermaidSection = section.id"
              >
                {{ section.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Right Side - Content -->
        <div class="lg:col-span-3">
          <div class="space-y-8">
            <!-- Flowchart Section -->
            <section v-show="activeMermaidSection === 'flowchart'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Flowchart</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>```mermaid
flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E
```</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MermaidExample
                        mermaid-code="flowchart TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Sequence Diagram Section -->
            <section v-show="activeMermaidSection === 'sequence'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Sequence Diagram</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!
```</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MermaidExample
                        mermaid-code="sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Class Diagram Section -->
            <section v-show="activeMermaidSection === 'class'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Class Diagram</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
```</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MermaidExample
                        mermaid-code="classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Gantt Chart Section -->
            <section v-show="activeMermaidSection === 'gantt'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Gantt Chart</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>```mermaid
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d
```</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <MermaidExample
                        mermaid-code="gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- LaTeX Tab -->
    <div v-show="currentActiveTab === 'latex'">
      <h2 class="mb-6">LaTeX Math</h2>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Left Side - Navigation -->
        <div class="lg:col-span-1">
          <div class="sticky top-4">
            <h3 class="mb-4 text-lg font-semibold text-white">Sections</h3>
            <nav class="space-y-2">
              <button
                v-for="section in latexSections"
                :key="section.id"
                :class="[
                  'block w-full rounded px-3 py-2 text-left text-sm transition-colors',
                  activeLatexSection === section.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                ]"
                @click="activeLatexSection = section.id"
              >
                {{ section.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Right Side - Content -->
        <div class="lg:col-span-3">
          <div class="space-y-8">
            <!-- Inline Math Section -->
            <section v-show="activeLatexSection === 'inline'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Inline Math</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Einstein's famous equation: $E = mc^2$

Inline math: $\pi \approx 3.14159$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        latex="The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Einstein's famous equation: $E = mc^2$

Inline math: $\pi \approx 3.14159$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Block Math Section -->
            <section v-show="activeLatexSection === 'block'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Block Math</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        :is-block="true"
                        latex="$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Symbols Section -->
            <section v-show="activeLatexSection === 'symbols'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Symbols</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>Greek letters: $\alpha, \beta, \gamma, \delta, \epsilon$

$\zeta, \eta, \theta, \iota, \kappa, \lambda$

$\mu, \nu, \xi, \omicron, \pi, \rho$

$\sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        latex="Greek letters: $\alpha, \beta, \gamma, \delta, \epsilon$

$\zeta, \eta, \theta, \iota, \kappa, \lambda$

$\mu, \nu, \xi, \omicron, \pi, \rho$

$\sigma, \tau, \upsilon, \phi, \chi, \psi, \omega$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Operators Section -->
            <section v-show="activeLatexSection === 'operators'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Operators</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>$\sum, \prod, \int, \oint$

$\leq, \geq, \neq, \approx$

$\infty, \pm, \mp, \cdot$

$\times, \div, \cap, \cup$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        latex="$\sum, \prod, \int, \oint$

$\leq, \geq, \neq, \approx$

$\infty, \pm, \mp, \cdot$

$\times, \div, \cap, \cup$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Fractions & Roots Section -->
            <section v-show="activeLatexSection === 'fractions'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Fractions & Roots</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre
                      class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"
                    ><code>$\frac{a}{b}$ or $\frac{numerator}{denominator}$

$\sqrt{x}$ or $\sqrt{expression}$

$\sqrt[n]{x}$ for nth root

$x^2, x^{superscript}$

$x_1, x_{subscript}$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        latex="$\frac{a}{b}$ or $\frac{numerator}{denominator}$

$\sqrt{x}$ or $\sqrt{expression}$

$\sqrt[n]{x}$ for nth root

$x^2, x^{superscript}$

$x_1, x_{subscript}$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Matrices Section -->
            <section v-show="activeLatexSection === 'matrices'" class="space-y-6">
              <div>
                <h3 class="mb-4 text-xl font-semibold text-white">Matrices</h3>
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Syntax</h4>
                    <pre class="overflow-x-auto rounded-lg bg-gray-800 p-4 text-sm"><code>$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$

$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}
$$</code></pre>
                  </div>
                  <div>
                    <h4 class="mb-3 font-medium text-gray-300">Preview</h4>
                    <div class="rounded-lg bg-gray-900 p-4">
                      <LatexExample
                        latex="$$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$$

$$\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$$"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Shortcuts Tab -->
    <div v-show="currentActiveTab === 'shortcuts'">
      <h2 class="mb-6">Keyboard Shortcuts</h2>
      <p class="mb-6">Use these keyboard shortcuts to speed up your editing:</p>

      <h3 class="mb-4 text-xl font-semibold text-white">Text Formatting</h3>
      <div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Bold</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + B</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Italic</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + I</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Code</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + `</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Highlight</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + H</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Link</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + K</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Code Block</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + ~</kbd>
          </div>
        </div>
      </div>

      <h3 class="mb-4 text-xl font-semibold text-white">Headers</h3>
      <div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 1</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 1</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 2</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 2</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 3</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 3</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 4</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 4</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 5</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 5</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Heading 6</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + 6</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Blockquote</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Q</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Task List</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + L</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Image</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + M</kbd>
          </div>
        </div>
      </div>

      <h3 class="mb-4 text-xl font-semibold text-white">Extended Features</h3>
      <div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Definition List</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + R</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Subscript</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + Y</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Superscript</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + U</kbd>
          </div>
        </div>
      </div>

      <h3 class="mb-4 text-xl font-semibold text-white">File Operations</h3>
      <div class="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Import File</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + O</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Export File</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + Shift + S</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Save</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + S</kbd>
          </div>
        </div>
        <div class="rounded-lg bg-gray-800 p-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-200">Find</span>
            <kbd class="rounded bg-gray-700 px-2 py-1 text-sm text-gray-200">Ctrl + F</kbd>
          </div>
        </div>
      </div>

      <h3 class="mb-4 text-xl font-semibold text-white">Editor Features</h3>
      <ul class="space-y-3 text-gray-300">
        <li>
          •
          <strong class="text-white">Line Numbers:</strong>
          Automatically displayed for easy navigation
        </li>
        <li>
          •
          <strong class="text-white">Auto-completion:</strong>
          Markdown syntax suggestions as you type
        </li>
        <li>
          •
          <strong class="text-white">Find & Replace:</strong>
          Use Ctrl+F to search within your document
        </li>
        <li>
          •
          <strong class="text-white">Syntax Highlighting:</strong>
          Markdown, Mermaid, and LaTeX syntax are highlighted
        </li>
        <li>
          •
          <strong class="text-white">Live Preview:</strong>
          See your rendered content in real-time
        </li>
        <li>
          •
          <strong class="text-white">Synchronized Scrolling:</strong>
          Editor and preview panes scroll together
        </li>
      </ul>

      <h3 class="mb-4 text-xl font-semibold text-white">Toolbar Buttons</h3>
      <p class="text-gray-300">
        All formatting buttons in the toolbar have corresponding keyboard shortcuts and will insert
        the appropriate markdown syntax at your cursor position.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import MarkdownExample from './MarkdownExample.vue'
  import LatexExample from './LatexExample.vue'
  import MermaidExample from './MermaidExample.vue'

  interface Props {
    activeTab?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    activeTab: 'markdown',
  })

  // Use the activeTab prop to show/hide sections
  const currentActiveTab = computed(() => props.activeTab)

  // Section navigation for each tab
  const activeMarkdownSection: Ref<string> = ref('headers')
  const activeMermaidSection: Ref<string> = ref('flowchart')
  const activeLatexSection: Ref<string> = ref('inline')

  const markdownSections = [
    { id: 'headers', name: 'Headers' },
    { id: 'formatting', name: 'Text Formatting' },
    { id: 'lists', name: 'Lists' },
    { id: 'links', name: 'Links & Images' },
    { id: 'code', name: 'Code' },
    { id: 'tables', name: 'Tables' },
    { id: 'blockquotes', name: 'Blockquotes' },
    { id: 'extended', name: 'Extended Syntax' },
  ]

  const mermaidSections = [
    { id: 'flowchart', name: 'Flowchart' },
    { id: 'sequence', name: 'Sequence Diagram' },
    { id: 'class', name: 'Class Diagram' },
    { id: 'gantt', name: 'Gantt Chart' },
  ]

  const latexSections = [
    { id: 'inline', name: 'Inline Math' },
    { id: 'block', name: 'Block Math' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'operators', name: 'Operators' },
    { id: 'fractions', name: 'Fractions & Roots' },
    { id: 'matrices', name: 'Matrices' },
  ]
</script>
