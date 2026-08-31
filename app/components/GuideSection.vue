<template>
  <div :id="section.id" class="guide-block">
    <div class="block-heading">{{ section.title }}</div>
    <SafeHtml
      v-if="section.description"
      tag="p"
      class="block-desc"
      :content="section.description"
    />

    <div
      v-for="(example, index) in section.examples ?? []"
      :key="`${section.id}-${index}`"
      class="example-pair"
    >
      <div v-if="example.label" class="example-label">{{ example.label }}</div>
      <div class="example-grid">
        <div class="example-card">
          <div class="example-card-header">
            <span class="code-lang">{{ syntaxLabel(example) }}</span>
          </div>
          <pre class="example-source">{{ syntaxText(example) }}</pre>
        </div>
        <div class="example-card">
          <div class="example-card-header"><span class="code-lang">Preview</span></div>
          <div class="example-preview">
            <MermaidExample v-if="example.kind === 'mermaid'" :mermaid-code="example.source" />
            <MarkdownExample v-else :content="example.source" />
          </div>
        </div>
      </div>
    </div>

    <SafeHtml
      v-if="section.callout"
      class="guide-callout"
      :content="section.callout"
    />
  </div>
</template>

<script setup lang="ts">
  import SafeHtml from './SafeHtml.vue'
  import MarkdownExample from './MarkdownExample.vue'
  import MermaidExample from './MermaidExample.vue'
  import type { GuideExample, GuideSectionData } from '../utils/guideSections'

  defineProps<{
    section: GuideSectionData
  }>()

  const syntaxLabel = (example: GuideExample) =>
    example.lang ?? (example.kind === 'mermaid' ? 'Mermaid' : 'Markdown')

  // Mermaid samples are stored without their fence so they can be rendered directly.
  const syntaxText = (example: GuideExample) =>
    example.kind === 'mermaid' ? `\`\`\`mermaid\n${example.source}\n\`\`\`` : example.source
</script>

<style>
.example-pair {
  margin-bottom: 1.5rem;
}

.example-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dim);
  margin-bottom: 8px;
}

.example-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.example-card {
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  background: var(--surface);
}

.example-card-header {
  display: flex;
  align-items: center;
  padding: 7px 14px;
  background: var(--raised);
  border-bottom: 1px solid var(--border);
}

.example-source {
  padding: 14px 16px;
  margin: 0;
  font-family: 'SF Mono', 'Fira Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--dim);
  background: var(--surface);
  overflow-x: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.example-preview {
  padding: 14px 16px;
  font-size: 0.9375rem;
  overflow-x: auto;
}

.example-preview > * {
  color: var(--text);
}

.example-preview > * > :first-child {
  margin-top: 0;
}

.example-preview .mermaid-example-container {
  background: transparent;
  padding: 0;
}

.example-preview .mermaid-example svg,
.example-preview svg {
  max-width: 100%;
  height: auto;
}

@media (max-width: 900px) {
  .example-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
