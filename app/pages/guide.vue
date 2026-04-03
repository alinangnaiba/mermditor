<template>
  <div class="guide-page">
    <!-- Nav -->
    <nav class="guide-nav">
      <NuxtLink to="/" class="guide-logo">
        <img src="../assets/images/logo.png" alt="merMDitor logo" />
        merMDitor
      </NuxtLink>
      <ul class="guide-nav-links">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/feedback">Feedback</NuxtLink></li>
        <li><NuxtLink to="/editor" class="guide-nav-cta">Open Editor</NuxtLink></li>
      </ul>
    </nav>

    <!-- Layout: sidebar + content -->
    <div class="guide-layout">
      <aside class="guide-sidebar">
        <div v-for="section in sidebarSections" :key="section.heading" class="guide-sidebar-section">
          <div class="guide-sidebar-heading">{{ section.heading }}</div>
          <ul class="guide-sidebar-nav">
            <li v-for="item in section.items" :key="item.id">
              <a
                class="guide-sidebar-link"
                :class="{ active: activeHash === item.id }"
                :href="`#${item.id}`"
                @click="activeHash = item.id"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <main class="guide-content">
        <div class="guide-page-heading">
          <h1>Markdown Reference</h1>
          <p>Syntax supported in merMDitor — standard CommonMark plus extended plugins.</p>
        </div>
        <GuideContent />
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import GuideContent from '../components/GuideContent.vue'

  const activeHash = ref('headings')

  const sidebarSections = [
    {
      heading: 'Markdown',
      items: [
        { id: 'headings', label: 'Headings' },
        { id: 'formatting', label: 'Text Formatting' },
        { id: 'lists', label: 'Lists' },
        { id: 'task-lists', label: 'Task Lists' },
        { id: 'links', label: 'Links & Images' },
        { id: 'code', label: 'Code' },
        { id: 'tables', label: 'Tables' },
        { id: 'blockquotes', label: 'Blockquotes' },
        { id: 'extended', label: 'Extended Syntax' },
      ],
    },
    {
      heading: 'Mermaid',
      items: [
        { id: 'mermaid-flowchart', label: 'Flowcharts' },
        { id: 'mermaid-sequence', label: 'Sequence' },
        { id: 'mermaid-gantt', label: 'Gantt' },
        { id: 'mermaid-other', label: 'Other types' },
      ],
    },
    {
      heading: 'LaTeX / Math',
      items: [
        { id: 'math-inline', label: 'Inline math' },
        { id: 'math-block', label: 'Block math' },
        { id: 'math-examples', label: 'Examples' },
      ],
    },
    {
      heading: 'Shortcuts',
      items: [
        { id: 'shortcuts-format', label: 'Formatting' },
        { id: 'shortcuts-file', label: 'File operations' },
        { id: 'shortcuts-view', label: 'View' },
      ],
    },
  ]
</script>

<style scoped>
.guide-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  display: flex;
  flex-direction: column;
}

.guide-nav {
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
  flex-shrink: 0;
}

.guide-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
}

.guide-logo img { height: 28px; width: auto; display: block; }

.guide-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-nav-links a {
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 0.9rem;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.guide-nav-links a:hover { color: var(--text); background: var(--surface); }
.guide-nav-links a.router-link-active { color: var(--text); }

.guide-nav-cta {
  background: var(--accent) !important;
  color: #fff !important;
  font-weight: 600;
}

.guide-nav-cta:hover { background: #5f9fff !important; }

.guide-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
  gap: 3.5rem;
  align-items: start;
  flex: 1;
  width: 100%;
}

.guide-sidebar {
  position: sticky;
  top: 54px;
  padding-top: 2.5rem;
}

.guide-sidebar-section { margin-bottom: 2rem; }

.guide-sidebar-heading {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  margin-bottom: 6px;
  padding: 0 8px;
}

.guide-sidebar-nav { list-style: none; padding: 0; margin: 0; }

.guide-sidebar-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  font-size: 0.875rem;
  color: var(--dim);
  border-radius: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}

.guide-sidebar-link:hover { background: var(--surface); color: var(--text); }
.guide-sidebar-link.active { color: var(--accent); background: var(--surface); }

.guide-content { padding-top: 2.5rem; }

.guide-page-heading { margin-bottom: 2.5rem; }

.guide-page-heading h1 {
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.guide-page-heading p { color: var(--dim); font-size: 1rem; }

@media (max-width: 768px) {
  .guide-layout {
    grid-template-columns: 1fr;
    gap: 0;
    padding-top: 1.5rem;
  }

  .guide-sidebar {
    position: static;
    padding-top: 0;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .guide-nav,
  .guide-layout { padding-left: 1.25rem; padding-right: 1.25rem; }
}
</style>
