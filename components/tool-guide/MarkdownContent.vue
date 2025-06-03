<template>
  <div class="space-y-10">
    <div id="headings">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Headings</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-surface-secondary p-4">
          <pre class="text-text-secondary">
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
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
      <p class="mt-2 text-sm text-text-tertiary">
        Use hash symbols for headings. More hashes mean smaller headings.
      </p>
    </div>
    <div id="text-formatting">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Text Formatting</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-surface-secondary p-4">
          <pre class="text-text-secondary">
**Bold text** or __Bold text__
*Italic text* or _Italic text_
~~Strikethrough text~~
`Inline code`
***Bold and italic text***</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
          <div class="prose prose-invert max-w-none">
            <p><strong>Bold text</strong> or <strong>Bold text</strong></p>
            <p><em>Italic text</em> or <em>Italic text</em></p>
            <p><del>Strikethrough text</del></p>
            <p><code>Inline code</code></p>
            <p>
              <strong><em>Bold and italic text</em></strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="lists">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Lists</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
Unordered List:
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

Ordered List:
1. First item
2. Second item
3. Third item</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
          <div class="prose prose-invert max-w-none">
            <p>Unordered List:</p>
            <ul>
              <li>Item 1</li>
              <li>
                Item 2
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

    <div id="links-images">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Links & Images</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
[Link text](https://example.com)
![Alt text for image](image-url.jpg)

Reference-style link:
[Link text][reference]
[reference]: https://example.com</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
          <div class="prose prose-invert max-w-none">
            <p>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link text</a>
            </p>
            <p><em>An image would appear here</em></p>
            <p>Reference-style link:</p>
            <p>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link text</a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div id="blockquotes">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Blockquotes</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
> This is a blockquote
> It can span multiple lines

> Nested blockquotes
>> Like this</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
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

    <div id="code-blocks">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Code Blocks</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
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
    }</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
          <div class="prose prose-invert max-w-none">
            <pre><code class="language-javascript">// Code block with syntax highlighting
function hello() {
  console.log("Hello world!");
}</code></pre>
            <pre><code>    // Indented code block (4 spaces)
    function hello() {
      console.log("Hello world!");
    }</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div id="tables">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Tables</h3>

      <div class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Basic Table</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |</pre
            >
          </div>
          <div class="rounded-lg bg-surface-tertiary p-4">
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
            <div class="mt-2 text-sm text-gray-500">
              Use pipes and dashes to create tables. Header row is separated by a row of dashes.
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Text Alignment</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
| Left-aligned | Center-aligned | Right-aligned |
|:------------ |:-------------:| -------------:|
| Left         | Center        | Right         |</pre
            >
          </div>
          <div class="rounded-lg bg-surface-tertiary p-4">
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
            <div class="mt-2 text-sm text-gray-500">
              <p>Column alignment using colons:</p>
              <p>- <code>:----</code> for left alignment (default)</p>
              <p>- <code>:----:</code> for center alignment</p>
              <p>- <code>----:</code> for right alignment</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Multi-row & Multi-column</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
| Name  | Category | Quantity |
|-------|----------|----------|
| Apples| Fruit    | 5        |
| Pasta | Grains   | 2        |
| Milk  | Dairy    | 1        |</pre
            >
          </div>
          <div class="rounded-lg bg-surface-tertiary p-4">
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
            <div class="mt-2 text-sm text-gray-500">
              You can add as many columns and rows as needed. Keep the pipes aligned for better
              readability in the source.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="horizontal-rule">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Horizontal Rule</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
---
or
***
or
___</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-surface-tertiary p-4">
          <div class="prose prose-invert max-w-none">
            <hr >
            <p>or</p>
            <hr >
            <p>or</p>
            <hr >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component displays Markdown syntax examples.
// It doesn't require any specific props or logic for now.
</script>
