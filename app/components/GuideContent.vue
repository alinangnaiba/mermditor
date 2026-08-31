<template>
  <div class="guide-doc">
    <GuideSection v-for="section in guideSections" :key="section.id" :section="section" />

    <div id="shortcuts-format" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — Formatting</div>
      <p class="block-desc">Select text first, then apply a shortcut to wrap it.</p>
      <div class="shortcut-grid">
        <div v-for="shortcut in formattingShortcuts" :key="shortcut.label" class="shortcut-row">
          <span class="shortcut-label">{{ shortcut.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, index) in shortcut.keys" :key="`${shortcut.label}-${key}`">
              <span v-if="index > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div id="shortcuts-file" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — File Operations</div>
      <div class="shortcut-grid">
        <div v-for="shortcut in fileShortcuts" :key="shortcut.label" class="shortcut-row">
          <span class="shortcut-label">{{ shortcut.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, index) in shortcut.keys" :key="`${shortcut.label}-${key}`">
              <span v-if="index > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div id="shortcuts-view" class="guide-block">
      <div class="block-heading">Keyboard Shortcuts — View</div>
      <div class="shortcut-grid">
        <div v-for="shortcut in viewShortcuts" :key="shortcut.label" class="shortcut-row">
          <span class="shortcut-label">{{ shortcut.label }}</span>
          <div class="shortcut-keys">
            <template v-for="(key, index) in shortcut.keys" :key="`${shortcut.label}-${key}`">
              <span v-if="index > 0" class="shortcut-plus">+</span>
              <kbd class="shortcut-kbd">{{ key }}</kbd>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import GuideSection from './GuideSection.vue'
  import {
    fileShortcuts,
    formattingShortcuts,
    guideSections,
    viewShortcuts,
  } from '../utils/guideSections'

  defineProps<{ activeTab?: string }>()
</script>

<style>
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

.code-lang {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
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
