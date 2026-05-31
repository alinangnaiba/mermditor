<template>
  <div class="share-page">
    <header class="share-header">
      <a href="/" class="share-brand">merMDitor</a>
      <div class="share-header-actions">
        <a v-if="markdown" href="/editor" class="share-open-btn" title="Open in editor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Open in Editor
        </a>
      </div>
    </header>

    <main class="share-main">
      <div v-if="error" class="share-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>{{ error }}</p>
        <a href="/editor" class="share-error-link">Go to Editor</a>
      </div>

      <div v-else-if="loading" class="share-loading">
        <div class="share-spinner" />
        <p>Rendering document…</p>
      </div>

      <article
        v-else
        ref="contentEl"
        class="share-content prose prose-invert max-w-none"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { decompressMarkdown, SHARE_PARAM } from '../utils/shareLink'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'
  import { getMermaidThemeConfig } from '../utils/markdownItMermaid'
  import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'

  definePageMeta({ layout: 'share' })

  const route = useRoute()
  const markdown = ref<string | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  const contentEl = ref<HTMLElement | null>(null)

  const { renderMarkdown, renderMermaidDiagrams, highlightSyntax } = useMarkdownRenderer()

  const extractTitle = (md: string): string => {
    const firstHeading = md.match(/^#{1,6}\s+(.+)/m)
    if (firstHeading) return firstHeading[1].replace(/[*_`~]/g, '').trim()
    const firstLine = md.split('\n').find((l) => l.trim().length > 0)
    return firstLine?.slice(0, 80) ?? 'Shared Document'
  }

  const extractDescription = (md: string): string => {
    const plain = md.replace(/^#{1,6}\s+.+/m, '').replace(/[`*_~#>\-[\]()]/g, '').trim()
    return plain.slice(0, 160).replace(/\s+/g, ' ')
  }

  onMounted(async () => {
    const param = route.query[SHARE_PARAM]
    if (!param || typeof param !== 'string') {
      error.value = 'No shared content found. The link may be invalid or incomplete.'
      loading.value = false
      return
    }

    const decoded = decompressMarkdown(param)
    if (!decoded) {
      error.value = 'Could not decode the shared content. The link may be corrupted.'
      loading.value = false
      return
    }

    markdown.value = decoded

    const title = extractTitle(decoded)
    const description = extractDescription(decoded)

    useSeoMeta({
      title: `${title} — merMDitor`,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: 'article',
      twitterCard: 'summary',
      twitterTitle: title,
      twitterDescription: description,
    })

    const html = await renderMarkdown(decoded)

    await nextTick()
    if (!contentEl.value) return

    contentEl.value.innerHTML = html

    const mermaidConfig = getMermaidThemeConfig('dark')
    await renderMermaidDiagrams(mermaidConfig, contentEl.value)
    await highlightSyntax(contentEl.value)
    attachCodeBlockInteractions(contentEl.value)

    loading.value = false
  })
</script>

<style scoped>
.share-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 48px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.share-brand {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.share-brand:hover {
  color: var(--accent);
}

.share-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-open-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--accent);
  color: #fff;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.12s;
}

.share-open-btn:hover {
  opacity: 0.85;
}

.share-open-btn svg {
  width: 14px;
  height: 14px;
}

.share-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 40px 24px 80px;
}

.share-content {
  width: 100%;
  max-width: 780px;
}

.share-error,
.share-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 24px;
  color: var(--muted);
  text-align: center;
}

.share-error svg {
  width: 40px;
  height: 40px;
  color: var(--danger);
}

.share-error p {
  color: var(--dim);
  max-width: 400px;
}

.share-error-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.share-error-link:hover {
  text-decoration: underline;
}

.share-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
