<template>
  <div class="min-h-screen bg-gray-900 text-white overflow-y-auto">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-3" />
          </RouterLink>
          <h1 class="text-xl font-bold">merMDitor</h1>
        </div>
        <nav class="flex items-center gap-4">
          <RouterLink to="/editor" class="text-gray-300 hover:text-white">
            Editor
          </RouterLink>
          <RouterLink to="/cheatsheet" class="text-white font-medium">
            Cheat Sheet
          </RouterLink>
        </nav>
      </div>
    </header>
    
    <!-- Cheat Sheet Content -->
    <div class="container mx-auto py-8 px-4">
      <!-- <h1 class="text-2xl font-bold mb-4">Cheat Sheet</h1> -->
      <!-- Tab Navigation -->
      <div class="mb-8">
        <div class="border-b border-gray-700">
          <nav class="flex space-x-4" aria-label="Tabs">
            <button 
              @click="activeTab = 'markdown'" 
              :class="['py-3 px-4 font-medium hover:text-blue-400 border-b-2 border-transparent transition-colors', 
                      activeTab === 'markdown' ? 'text-blue-400 border-blue-400' : 'text-gray-300']">
              Markdown Basics
            </button>
            <button 
              @click="activeTab = 'mermaid'" 
              :class="['py-3 px-4 font-medium hover:text-blue-400 border-b-2 border-transparent transition-colors', 
                      activeTab === 'mermaid' ? 'text-blue-400 border-blue-400' : 'text-gray-300']">
              Mermaid Diagrams
            </button>
            <button 
              @click="activeTab = 'shortcuts'" 
              :class="['py-3 px-4 font-medium hover:text-blue-400 border-b-2 border-transparent transition-colors', 
                      activeTab === 'shortcuts' ? 'text-blue-400 border-blue-400' : 'text-gray-300']">
              Keyboard Shortcuts
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Markdown Basics Tab -->
        <div v-if="activeTab === 'markdown'" class="space-y-10">
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Headings</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <h1>Heading 1</h1>
                  <h2>Heading 2</h2>
                  <h3>Heading 3</h3>
                  <h4>Heading 4</h4>
                  <h5>Heading 5</h5>
                  <h6>Heading 6</h6>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-400 mt-2">Use hash symbols for headings. More hashes mean smaller headings.</p>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Text Formatting</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough text~~
`Inline code`
***Bold and italic text***</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <p><strong>Bold text</strong> or <strong>Bold text</strong></p>
                  <p><em>Italic text</em> or <em>Italic text</em></p>
                  <p><del>Strikethrough text</del></p>
                  <p><code>Inline code</code></p>
                  <p><strong><em>Bold and italic text</em></strong></p>
                </div>
              </div>
            </div>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Lists</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
Unordered List:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Ordered List:
1. First item
2. Second item
3. Third item</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <p>Unordered List:</p>
                  <ul>
                    <li>Item 1</li>
                    <li>Item 2
                      <ul>
                        <li>Subitem 2.1</li>
                        <li>Subitem 2.2</li>
                      </ul>
                    </li>
                  </ul>
                  <p>Ordered List:</p>
                  <ol>
                    <li>First item</li>
                    <li>Second item</li>
                    <li>Third item</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Links & Images</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
[Link text](https://example.com)
![Alt text for image](image-url.jpg)

Reference-style link:
[Link text][reference]
[reference]: https://example.com</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <p><a href="https://example.com">Link text</a></p>
                  <p><em>An image would appear here</em></p>
                  <p>Reference-style link:</p>
                  <p><a href="https://example.com">Link text</a></p>
                </div>
              </div>
            </div>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Blockquotes</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
> This is a blockquote
> It can span multiple lines

> Nested blockquotes
>> Like this</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <blockquote>
                    <p>This is a blockquote</p>
                    <p>It can span multiple lines</p>
                  </blockquote>
                  <blockquote>
                    <p>Nested blockquotes</p>
                    <blockquote>
                      <p>Like this</p>
                    </blockquote>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Code Blocks</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```javascript
// Code block with syntax highlighting
function hello() {
  console.log("Hello world!");
}
```

    // Indented code block (4 spaces)
    function hello() {
      console.log("Hello world!");
    }</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <pre><code class="language-javascript">// Code block with syntax highlighting
function hello() {
  console.log("Hello world!");
}</code></pre>
                  <pre><code>// Indented code block (4 spaces)
function hello() {
  console.log("Hello world!");
}</code></pre>
                </div>
              </div>
            </div>
          </div>
              <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Tables</h3>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Basic Table</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <div class="prose prose-invert max-w-none">
                    <table>
                      <thead>
                        <tr>
                          <th>Header 1</th>
                          <th>Header 2</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Cell 1</td>
                          <td>Cell 2</td>
                        </tr>
                        <tr>
                          <td>Cell 3</td>
                          <td>Cell 4</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="text-sm text-gray-500 mt-2">Use pipes and dashes to create tables. Header row is separated by a row of dashes.</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Text Alignment</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">| Left-aligned | Center-aligned | Right-aligned |
|:------------ |:-------------:| -------------:|
| Left         | Center        | Right         |</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <div class="prose prose-invert max-w-none">
                    <table>
                      <thead>
                        <tr>
                          <th style="text-align: left">Left-aligned</th>
                          <th style="text-align: center">Center-aligned</th>
                          <th style="text-align: right">Right-aligned</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="text-align: left">Left</td>
                          <td style="text-align: center">Center</td>
                          <td style="text-align: right">Right</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="text-sm text-gray-500 mt-2">
                    <p>Column alignment using colons:</p>
                    <p>- <code>:----</code> for left alignment (default)</p>
                    <p>- <code>:----:</code> for center alignment</p>
                    <p>- <code>----:</code> for right alignment</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Multi-row & Multi-column</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">| Name  | Category | Quantity |
|-------|----------|----------|
| Apples| Fruit    | 5        |
| Pasta | Grains   | 2        |
| Milk  | Dairy    | 1        |</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <div class="prose prose-invert max-w-none">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Apples</td>
                          <td>Fruit</td>
                          <td>5</td>
                        </tr>
                        <tr>
                          <td>Pasta</td>
                          <td>Grains</td>
                          <td>2</td>
                        </tr>
                        <tr>
                          <td>Milk</td>
                          <td>Dairy</td>
                          <td>1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="text-sm text-gray-500 mt-2">You can add as many columns and rows as needed. Keep the pipes aligned for better readability in the source.</div>
                </div>
              </div>
            </div>
          </div>
            
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Horizontal Rule</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
---
or
***
or
___</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <div class="prose prose-invert max-w-none">
                  <hr />
                  <p>or</p>
                  <hr />
                  <p>or</p>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mermaid Diagrams Tab -->
        <div v-if="activeTab === 'mermaid'" class="space-y-10">
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Basic Flowchart</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]" />
              </div>
            </div>
            <p class="text-sm text-gray-400 mt-2">TD = top-down, LR = left-right</p>
          </div>
            <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Node Shapes</h3>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Square Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    A[Square Node]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    A[Square Node]" />
                  <div class="text-sm text-gray-500 mt-2">Square brackets [Text] for square node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Rounded Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    B(Rounded Node)
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    B(Rounded Node)" />
                  <div class="text-sm text-gray-500 mt-2">Parentheses (Text) for rounded node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Stadium Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    C([Stadium Node])
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    C([Stadium Node])" />
                  <div class="text-sm text-gray-500 mt-2">([Text]) for stadium-shaped node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Subroutine Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    D[[Subroutine Node]]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    D[[Subroutine Node]]" />
                  <div class="text-sm text-gray-500 mt-2">[[Text]] for subroutine node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Database Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    E[(Database Node)]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    E[(Database Node)]" />
                  <div class="text-sm text-gray-500 mt-2">[(Text)] for database node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Circle Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    F((Circle Node))
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    F((Circle Node))" />
                  <div class="text-sm text-gray-500 mt-2">((Text)) for circle node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Asymmetric Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    G>Asymmetric Node]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    G>Asymmetric Node]" />
                  <div class="text-sm text-gray-500 mt-2">>Text] for asymmetric node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Rhombus Node</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    H{Rhombus Node}
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    H{Rhombus Node}" />
                  <div class="text-sm text-gray-500 mt-2">{Text} for rhombus/diamond node</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Parallelogram</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    J[/Parallelogram/]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    J[/Parallelogram/]" />
                  <div class="text-sm text-gray-500 mt-2">[/Text/] for parallelogram</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Alternative Parallelogram</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    K[\Parallelogram alt\]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    K[\Parallelogram alt\]" />
                  <div class="text-sm text-gray-500 mt-2">[\Text\] for alternative parallelogram</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Trapezoid</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    L[/Trapezoid\]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    L[/Trapezoid\]" />
                  <div class="text-sm text-gray-500 mt-2">[/Text\] for trapezoid</div>
                </div>
              </div>
            </div>
            
            <div class="mb-5">
              <h4 class="text-lg font-medium mb-3 text-blue-300">Alternative Trapezoid</h4>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-800 rounded-lg p-4">
                  <pre class="text-gray-300">```mermaid
graph TD
    M[\Trapezoid alt/]
```</pre>
                </div>
                <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
                  <MermaidRenderer code="graph TD
    M[\Trapezoid alt/]" />
                  <div class="text-sm text-gray-500 mt-2">[\Text/] for alternative trapezoid</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Sequence Diagram</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Great!
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Great!" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Class Diagram</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">State Diagram</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Gantt Chart</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Design           :a1, 2023-01-01, 30d
    section Development
    Implementation   :a2, after a1, 45d
    Testing          :a3, after a2, 20d
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Design           :a1, 2023-01-01, 30d
    section Development
    Implementation   :a2, after a1, 45d
    Testing          :a3, after a2, 20d" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-medium mb-4 text-blue-400">Entity Relationship</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-gray-800 rounded-lg p-4 mb-2">
                <pre class="text-gray-300">
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```</pre>
              </div>
              <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
                <MermaidRenderer code="erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Keyboard Shortcuts Tab -->
        <div v-if="activeTab === 'shortcuts'" class="space-y-6">
          <h2 class="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Keyboard Shortcuts</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-800">
                  <th class="px-6 py-3">Action</th>
                  <th class="px-6 py-3">Windows/Linux</th>
                  <th class="px-6 py-3">macOS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <tr>
                  <td class="px-6 py-4">Bold</td>
                  <td class="px-6 py-4">Ctrl + B</td>
                  <td class="px-6 py-4">⌘ + B</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Italic</td>
                  <td class="px-6 py-4">Ctrl + I</td>
                  <td class="px-6 py-4">⌘ + I</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Heading</td>
                  <td class="px-6 py-4">Ctrl + Shift + 1</td>
                  <td class="px-6 py-4">⌘ + Shift + 1</td>
                </tr>
                <tr>
                  <td class="px-6 py-4">Link</td>
                  <td class="px-6 py-4">Ctrl + K</td>
                  <td class="px-6 py-4">⌘ + K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="py-8 border-t border-gray-800 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p>© 2025 MerMDitor</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import MermaidRenderer from '@/components/MermaidRenderer.vue';
import { setupMermaid } from '@/plugins/mermaid';

// Active tab state (markdown, mermaid, shortcuts)
const activeTab = ref('markdown');

onMounted(() => {
  setupMermaid();
});
</script>

<style>
pre {
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.router-link-active {
  color: #3B82F6;
  font-weight: 500;
}

/* Override any global overflow hidden styles for this page */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto !important;
}
</style>
