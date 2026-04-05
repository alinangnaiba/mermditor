<template>
  <div class="index-preview-wrap">
    <div class="index-editor-frame">
      <div class="index-frame-bar">
        <div class="index-dots">
          <div class="index-dot" />
          <div class="index-dot" />
          <div class="index-dot" />
        </div>
        <span class="index-frame-name">untitled.md — merMDitor</span>
      </div>
      <div class="index-frame-panes">
        <div class="index-frame-editor">
          <div class="fe-heading"># System Design</div>
          <div>&nbsp;</div>
          <div>This is <span class="fe-bold">**merMDitor**</span>, a markdown editor.</div>
          <div>&nbsp;</div>
          <div class="fe-heading">## Architecture</div>
          <div>&nbsp;</div>
          <div class="fe-muted">```mermaid</div>
          <div class="fe-green">graph LR</div>
          <div class="fe-green">&nbsp;&nbsp;A[Editor] --&gt; B[Renderer]</div>
          <div class="fe-green">&nbsp;&nbsp;B --&gt; C[Preview]</div>
          <div class="fe-muted">```</div>
          <div>&nbsp;</div>
          <div class="fe-purple">$$E = mc^2$$</div>
          <div>&nbsp;</div>
          <div><span class="fe-orange">- [x]</span> Set up project</div>
          <div><span class="fe-orange">- [ ]</span> Write docs</div>
        </div>
        <div class="index-frame-preview">
          <div class="fp-h1">System Design</div>
          <div class="fp-p">This is <strong>merMDitor</strong>, a markdown editor.</div>
          <div class="fp-h2">Architecture</div>
          <div class="fp-diagram">
            <div class="fp-diag-label">mermaid</div>
            <div class="fp-nodes">
              <div class="fp-node">Editor</div>
              <div class="fp-arrow">→</div>
              <div class="fp-node">Renderer</div>
              <div class="fp-arrow">→</div>
              <div class="fp-node">Preview</div>
            </div>
          </div>
          <div class="fp-math">E = mc²</div>
          <div class="fp-task"><span class="fp-chk done">✓</span> Set up project</div>
          <div class="fp-task"><span class="fp-chk">&#8203;</span> Write docs</div>
        </div>
      </div>
    </div>
  </div>
</template>
