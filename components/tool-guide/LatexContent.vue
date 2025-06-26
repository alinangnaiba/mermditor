<template>
  <div class="content-inner">
    <h1>LaTeX Math Rendering</h1>
    <p class="lead">
      merMDitor supports LaTeX math expressions, allowing you to include mathematical formulas
      in both inline and block formats.
    </p>

    <!-- Basic Syntax -->
    <section id="basic-syntax">
      <h2>Basic Syntax</h2>
      <p>Use dollar signs to delimit math expressions:</p>
      
      <div class="example-section">
        <h3>Inline Math</h3>
        <p>For inline math expressions, use single dollar signs:</p>
        <div class="code-example">
          <pre><code>This is inline math: $E = mc^2$ within a sentence.</code></pre>
        </div>
        <div class="result">
          <p>This is inline math: <KatexRenderer code="E = mc^2" :is-block="false" /> within a sentence.</p>
        </div>
      </div>

      <div class="example-section">
        <h3>Block Math</h3>
        <p>For display math (centered on its own line), use double dollar signs:</p>
        <div class="code-example">
          <pre><code>$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" :is-block="true" />
        </div>
      </div>
    </section>

    <!-- Common Mathematical Expressions -->
    <section id="common-expressions">
      <h2>Common Mathematical Expressions</h2>

      <div class="example-section">
        <h3>Fractions</h3>
        <div class="code-example">
          <pre><code>$\frac{numerator}{denominator}$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\frac{numerator}{denominator}" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Square Roots</h3>
        <div class="code-example">
          <pre><code>$\sqrt{x}$ and $\sqrt[n]{x}$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\sqrt{x}" :is-block="false" /> and <KatexRenderer code="\sqrt[n]{x}" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Superscripts and Subscripts</h3>
        <div class="code-example">
          <pre><code>$x^2$, $x_i$, $x^{2y}$, $x_{i,j}$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="x^2" :is-block="false" />, <KatexRenderer code="x_i" :is-block="false" />, <KatexRenderer code="x^{2y}" :is-block="false" />, <KatexRenderer code="x_{i,j}" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Greek Letters</h3>
        <div class="code-example">
          <pre><code>$\alpha$, $\beta$, $\gamma$, $\Delta$, $\pi$, $\sigma$, $\Omega$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\alpha" :is-block="false" />, <KatexRenderer code="\beta" :is-block="false" />, <KatexRenderer code="\gamma" :is-block="false" />, <KatexRenderer code="\Delta" :is-block="false" />, <KatexRenderer code="\pi" :is-block="false" />, <KatexRenderer code="\sigma" :is-block="false" />, <KatexRenderer code="\Omega" :is-block="false" /></p>
        </div>
      </div>
    </section>

    <!-- Advanced Expressions -->
    <section id="advanced-expressions">
      <h2>Advanced Expressions</h2>

      <div class="example-section">
        <h3>Integrals</h3>
        <div class="code-example">
          <pre><code>$$\int_{a}^{b} f(x) \, dx$$

$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="\int_{a}^{b} f(x) \, dx" :is-block="true" />
          <KatexRenderer code="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Summations and Products</h3>
        <div class="code-example">
          <pre><code>$$\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n$$

$$\prod_{i=1}^{n} x_i = x_1 \cdot x_2 \cdot \ldots \cdot x_n$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n" :is-block="true" />
          <KatexRenderer code="\prod_{i=1}^{n} x_i = x_1 \cdot x_2 \cdot \ldots \cdot x_n" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Limits</h3>
        <div class="code-example">
          <pre><code>$$\lim_{x \to \infty} f(x) = L$$

$$\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="\lim_{x \to \infty} f(x) = L" :is-block="true" />
          <KatexRenderer code="\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Matrices</h3>
        <div class="code-example">
          <pre><code>$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$

$$\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="\begin{pmatrix} a & b \\ c & d \end{pmatrix}" :is-block="true" />
          <KatexRenderer code="\begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}" :is-block="true" />
        </div>
      </div>
    </section>

    <!-- Functions and Operators -->
    <section id="functions-operators">
      <h2>Functions and Operators</h2>

      <div class="example-section">
        <h3>Trigonometric Functions</h3>
        <div class="code-example">
          <pre><code>$\sin(x)$, $\cos(x)$, $\tan(x)$, $\sec(x)$, $\csc(x)$, $\cot(x)$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\sin(x)" :is-block="false" />, <KatexRenderer code="\cos(x)" :is-block="false" />, <KatexRenderer code="\tan(x)" :is-block="false" />, <KatexRenderer code="\sec(x)" :is-block="false" />, <KatexRenderer code="\csc(x)" :is-block="false" />, <KatexRenderer code="\cot(x)" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Logarithms</h3>
        <div class="code-example">
          <pre><code>$\log(x)$, $\ln(x)$, $\log_2(x)$, $\log_{10}(x)$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\log(x)" :is-block="false" />, <KatexRenderer code="\ln(x)" :is-block="false" />, <KatexRenderer code="\log_2(x)" :is-block="false" />, <KatexRenderer code="\log_{10}(x)" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Set Theory</h3>
        <div class="code-example">
          <pre><code>$\in$, $\notin$, $\subset$, $\subseteq$, $\cup$, $\cap$, $\emptyset$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\in" :is-block="false" />, <KatexRenderer code="\notin" :is-block="false" />, <KatexRenderer code="\subset" :is-block="false" />, <KatexRenderer code="\subseteq" :is-block="false" />, <KatexRenderer code="\cup" :is-block="false" />, <KatexRenderer code="\cap" :is-block="false" />, <KatexRenderer code="\emptyset" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Logic</h3>
        <div class="code-example">
          <pre><code>$\land$, $\lor$, $\neg$, $\implies$, $\iff$, $\forall$, $\exists$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\land" :is-block="false" />, <KatexRenderer code="\lor" :is-block="false" />, <KatexRenderer code="\neg" :is-block="false" />, <KatexRenderer code="\implies" :is-block="false" />, <KatexRenderer code="\iff" :is-block="false" />, <KatexRenderer code="\forall" :is-block="false" />, <KatexRenderer code="\exists" :is-block="false" /></p>
        </div>
      </div>
    </section>

    <!-- Complex Examples -->
    <section id="complex-examples">
      <h2>Complex Examples</h2>

      <div class="example-section">
        <h3>Quadratic Formula</h3>
        <div class="code-example">
          <pre><code>$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Euler's Identity</h3>
        <div class="code-example">
          <pre><code>$$e^{i\pi} + 1 = 0$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="e^{i\pi} + 1 = 0" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Taylor Series</h3>
        <div class="code-example">
          <pre><code>$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Probability Density Function (Normal Distribution)</h3>
        <div class="code-example">
          <pre><code>$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}" :is-block="true" />
        </div>
      </div>
    </section>

    <!-- Tips and Best Practices -->
    <section id="tips">
      <h2>Tips and Best Practices</h2>
      
      <div class="example-section">
        <h3>Spacing</h3>
        <p>Use <code>\,</code> for thin space, <code>\:</code> for medium space, <code>\;</code> for thick space, and <code>\quad</code> for quad space:</p>
        <div class="code-example">
          <pre><code>$a\,b$ vs $a\:b$ vs $a\;b$ vs $a\quad b$</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="a\,b" :is-block="false" /> vs <KatexRenderer code="a\:b" :is-block="false" /> vs <KatexRenderer code="a\;b" :is-block="false" /> vs <KatexRenderer code="a\quad b" :is-block="false" /></p>
        </div>
      </div>

      <div class="example-section">
        <h3>Text in Math Mode</h3>
        <p>Use <code>\text{}</code> for regular text within math expressions:</p>
        <div class="code-example">
          <pre><code>$$\text{if } x > 0 \text{ then } f(x) = x^2$$</code></pre>
        </div>
        <div class="result">
          <KatexRenderer code="\text{if } x > 0 \text{ then } f(x) = x^2" :is-block="true" />
        </div>
      </div>

      <div class="example-section">
        <h3>Escaping Special Characters</h3>
        <p>Use backslashes to escape special characters:</p>
        <div class="code-example">
          <pre><code>$\$100$ (dollar sign), $\%50$ (percent), $\&$ (ampersand)</code></pre>
        </div>
        <div class="result">
          <p><KatexRenderer code="\$100" :is-block="false" /> (dollar sign), <KatexRenderer code="\%50" :is-block="false" /> (percent), <KatexRenderer code="\&" :is-block="false" /> (ampersand)</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here if needed
</script>

<style scoped>
.content-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.87);
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.87);
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.87);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.lead {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

p {
  color: rgba(255, 255, 255, 0.87);
  margin-bottom: 1rem;
  line-height: 1.6;
}

section {
  margin-bottom: 2rem;
}

.example-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.code-example {
  margin-bottom: 1rem;
}

.code-example pre {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 1rem;
  overflow-x: auto;
}

.code-example code {
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.87);
}

.result {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
}

code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  color: #3B82F6;
}
</style>
