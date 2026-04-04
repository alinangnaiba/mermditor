<template>
  <div>
    <nav class="index-nav">
      <NuxtLink to="/" class="index-logo">
        <img src="../assets/images/logo.png" alt="merMDitor Logo" />
        merMDitor
      </NuxtLink>
      <ul class="index-nav-links">
        <li><NuxtLink to="/guide">Guide</NuxtLink></li>
        <li><NuxtLink to="/feedback">Feedback</NuxtLink></li>
        <li><NuxtLink to="/editor" class="index-nav-cta">Open Editor</NuxtLink></li>
      </ul>
    </nav>

    <MarketingHero />
    <EditorPreviewFrame />
    <FeatureGrid :features="features" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import EditorPreviewFrame from '../components/EditorPreviewFrame.vue'
  import FeatureGrid from '../components/FeatureGrid.vue'
  import MarketingHero from '../components/MarketingHero.vue'

  const features = [
    {
      name: 'Markdown',
      desc: 'Full CommonMark with tables, task lists, footnotes, highlights, subscript, superscript, and emoji.',
    },
    {
      name: 'Mermaid Diagrams',
      desc: 'Flowcharts, sequence, Gantt, class, and state diagrams — rendered live as you type.',
    },
    {
      name: 'LaTeX Math',
      desc: 'Inline $x^2$ and block $$...$$ math via KaTeX.',
    },
    {
      name: 'Live Split Preview',
      desc: 'Side-by-side editing with synchronized scrolling. Toggle either pane independently.',
    },
    {
      name: 'Import & Export',
      desc: 'Open .md files from disk, export as Markdown, or print to PDF with configurable page settings.',
    },
    {
      name: 'Auto-save',
      desc: 'Content is persisted to localStorage automatically. Reopen the browser and your work is there.',
    },
  ]
</script>

<style>
.index-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 54px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 20;
}

.index-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
}

.index-logo img { height: 28px; width: auto; display: block; }

.index-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
}

.index-nav-links a {
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: 0.9rem;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.index-nav-links a:hover { color: var(--text); background: var(--surface); }

.index-nav-cta {
  background: var(--accent) !important;
  color: #fff !important;
  font-weight: 600;
}

.index-nav-cta:hover { background: #5f9fff !important; }

/* Hero */
.index-hero {
  max-width: 680px;
  margin: 0 auto;
  padding: 88px 2rem 64px;
  text-align: center;
}

.index-hero h1 {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  color: var(--text);
}

.index-hero p {
  color: var(--dim);
  font-size: 1.0625rem;
  line-height: 1.7;
  margin-bottom: 2.25rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.index-hero-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.index-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: var(--radius);
  font-size: 0.9375rem;
  font-weight: 600;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  transition: background 0.15s;
}

.index-btn-primary:hover { background: #5f9fff; }

.index-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border-radius: var(--radius);
  font-size: 0.9375rem;
  font-weight: 600;
  background: transparent;
  color: var(--dim);
  border: 1px solid var(--border);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.index-btn-ghost:hover { background: var(--surface); color: var(--text); }

/* Preview frame */
.index-preview-wrap {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 2rem 96px;
}

.index-editor-frame {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
}

.index-frame-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--raised);
}

.index-dots { display: flex; gap: 6px; }
.index-dot { width: 11px; height: 11px; border-radius: 50%; background: var(--border); }

.index-frame-name {
  font-size: 0.8rem;
  color: var(--muted);
  margin-left: 2px;
}

.index-frame-panes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 300px;
}

.index-frame-editor {
  border-right: 1px solid var(--border);
  padding: 18px 20px;
  font-family: 'SF Mono', 'Fira Mono', 'Cascadia Code', monospace;
  font-size: 0.8125rem;
  line-height: 1.8;
  color: var(--dim);
  overflow: hidden;
}

.fe-heading  { color: #79b8ff; }
.fe-bold     { color: var(--text); font-weight: 600; }
.fe-muted    { color: var(--muted); }
.fe-green    { color: #56d364; }
.fe-orange   { color: var(--orange); }
.fe-purple   { color: var(--purple); }

.index-frame-preview {
  padding: 18px 22px;
  overflow: hidden;
}

.fp-h1  { font-size: 1.0625rem; font-weight: 700; margin-bottom: 8px; color: var(--text); }
.fp-p   { font-size: 0.8125rem; color: var(--dim); margin-bottom: 12px; line-height: 1.65; }
.fp-h2  { font-size: 0.875rem; font-weight: 700; margin: 14px 0 7px; color: var(--text); }

.fp-diagram {
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 11px 14px;
  margin-bottom: 12px;
}

.fp-diag-label { font-size: 0.65rem; color: var(--muted); margin-bottom: 7px; }

.fp-nodes { display: flex; align-items: center; gap: 6px; }

.fp-node {
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 0.7rem;
  color: var(--dim);
}

.fp-arrow { color: var(--muted); font-size: 0.8rem; }

.fp-math { font-style: italic; color: var(--purple); font-size: 0.875rem; margin-bottom: 10px; }

.fp-task { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; color: var(--dim); margin-bottom: 4px; }
.fp-chk {
  width: 13px; height: 13px; border-radius: 2px;
  border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.55rem; flex-shrink: 0;
}
.fp-chk.done { background: var(--green); border-color: var(--green); color: #000; }

/* Features */
.index-features-section {
  border-top: 1px solid var(--border);
  padding: 72px 2rem 80px;
}

.index-section-inner {
  max-width: 860px;
  margin: 0 auto;
}

.index-section-eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.625rem;
}

.index-section-inner h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.625rem;
  color: var(--text);
}

.index-section-inner > p {
  color: var(--dim);
  font-size: 1rem;
  margin-bottom: 3rem;
}

.index-features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--border);
}

.index-feature {
  background: var(--surface);
  padding: 1.625rem 1.75rem;
}

.index-feature-name {
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text);
}

.index-feature-desc {
  font-size: 0.875rem;
  color: var(--dim);
  line-height: 1.65;
}

@media (max-width: 768px) {
  .index-nav-cta { display: none; }
  .index-hero { padding: 56px 1.5rem 48px; }
  .index-frame-panes { grid-template-columns: 1fr; height: auto; }
  .index-frame-editor { border-right: none; border-bottom: 1px solid var(--border); height: 200px; }
  .index-frame-preview { height: 220px; }
  .index-features-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .index-nav { padding: 0 1.25rem; }
  .index-preview-wrap, .index-features-section { padding-left: 1.25rem; padding-right: 1.25rem; }
}
</style>
