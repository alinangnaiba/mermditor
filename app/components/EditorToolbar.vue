<template>
  <div class="tb-bar">
    <!-- File group -->
    <div class="tb-group">
      <button class="editor-toolbar-btn" title="Open file (Ctrl+O)" @click="actions.importMarkdownFile()">
        <svg viewBox="0 0 24 24"><path d="M5 4h4l3 3h7a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Save As... (Ctrl+Shift+S)" @click="showFilenameModal = true">
        <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Export Markdown" @click="actions.exportMarkdownFile()">
        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Export to PDF" @click="actions.exportPdf()">
        <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      </button>
    </div>

    <div class="tb-sep" />

    <!-- Format group -->
    <div class="tb-group">
      <button class="editor-toolbar-btn" title="Bold (Ctrl+B)" @click="actions.insertFormat('**', '**')">
        <svg viewBox="0 0 24 24" stroke-width="2.25"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Italic (Ctrl+I)" @click="actions.insertFormat('*', '*')">
        <svg viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Strikethrough" @click="actions.insertFormat('~~', '~~')">
        <svg viewBox="0 0 256 256"><line x1="40" y1="128" x2="216" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M76.33,96a25.71,25.71,0,0,1-1.22-8c0-22.09,22-40,52.89-40,23,0,40.24,9.87,48,24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M72,168c0,22.09,25.07,40,56,40s56-17.91,56-40c0-23.77-21.62-33-45.6-40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Highlight (Ctrl+Shift+H)" @click="actions.insertHighlight()">
        <svg viewBox="0 0 256 256"><polyline points="88 128 24 192 96 216 136 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M184,160l-26.34,26.34a8,8,0,0,1-11.32,0L77.66,117.66a8,8,0,0,1,0-11.32L104,80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M248,112l-50.34,50.34a8,8,0,0,1-11.32,0L101.66,77.66a8,8,0,0,1,0-11.32L152,16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Inline Code (Ctrl+`)" @click="actions.insertFormat('`', '`')">
        <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Link (Ctrl+K)" @click="actions.insertFormat('[](', ')')">
        <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      </button>
    </div>

    <div class="tb-sep" />

    <!-- Structure group -->
    <div class="tb-group">
      <HeadingPicker :actions="{ insertHeading: props.actions.insertHeading }" />
      <button class="editor-toolbar-btn" title="Horizontal rule" @click="actions.insertFormat('\n\n---\n\n', '')">
        <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Bullet list" @click="actions.insertList('-')">
        <svg viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Numbered list" @click="actions.insertList('1.')">
        <svg viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Task list (Ctrl+Shift+L)" @click="actions.insertTaskList()">
        <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Blockquote (Ctrl+Q)" @click="actions.insertBlockquote()">
        <svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Code block (Ctrl+Shift+~)" @click="actions.insertCodeBlock()">
        <svg viewBox="0 0 256 256"><polyline points="64 88 16 128 64 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="192 88 240 128 192 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="160" y1="40" x2="96" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
    </div>

    <div class="tb-sep" />

    <!-- Insert group -->
    <div class="tb-group">
      <button class="editor-toolbar-btn" title="Insert Mermaid diagram" @click="actions.insertFormat('\n```mermaid\n', '\n```\n')">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M17.5 14v7M14 17.5h7"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Insert LaTeX math" @click="actions.insertFormat('\n$$\n', '\n$$\n')">
        <svg viewBox="0 0 24 24"><text x="3" y="17" font-size="14" font-style="italic" stroke="none" fill="currentColor" font-family="serif">∑</text></svg>
      </button>
      <EmojiPicker :actions="{ insertEmoji: actions.insertEmoji }" />
      <button class="editor-toolbar-btn" title="Insert table" @click="actions.insertFormat('\n| Column 1 | Column 2 |\n| --- | --- |\n| ', ' |')">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Image (Ctrl+Shift+M)" @click="actions.insertFormat('![](', ')')">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Footnote" @click="actions.insertFootnote()">
        <svg viewBox="0 0 256 256"><line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="48" y1="80" x2="208" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="48" y1="176" x2="208" y2="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
    </div>

    <div class="tb-sep" />

    <!-- Extra group -->
    <div class="tb-group">
      <button class="editor-toolbar-btn" title="Subscript (Ctrl+Shift+Y)" @click="actions.insertSubscript()">
        <svg viewBox="0 0 256 256"><path d="M240,208H192l43.17-57.56A24,24,0,1,0,193.37,128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="40" y1="56" x2="144" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="144" y1="56" x2="40" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
      <button class="editor-toolbar-btn" title="Superscript (Ctrl+Shift+U)" @click="actions.insertSuperscript()">
        <svg viewBox="0 0 256 256"><path d="M240,144H192l43.17-57.56A24,24,0,1,0,193.37,64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="40" y1="80" x2="144" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="144" y1="80" x2="40" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
      </button>
    </div>

    <!-- Pane toggles (far right) -->
    <div class="tb-pane-toggles">
      <button class="editor-toolbar-btn tb-clear-btn" title="Clear data" @click="$emit('clear-storage')">
        <svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
      <div class="tb-sep" />
      <label class="tb-autosave-label">
        <input
          :checked="autosave"
          type="checkbox"
          class="tb-autosave-check"
          @click.prevent="$emit('update:autosave', !autosave)"
        />
        Autosave
      </label>
      <button
        class="tb-toggle tb-icon-toggle"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="$emit('toggle-theme')"
      >
        <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 19.07l1.41-1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0A7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <button
        class="tb-toggle tb-icon-toggle"
        :class="{ on: showEditor }"
        :title="showEditor ? 'Hide editor pane' : 'Show editor pane'"
        :aria-label="showEditor ? 'Hide editor pane' : 'Show editor pane'"
        :aria-pressed="showEditor"
        @click="$emit('toggle-editor')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16v14H4z" />
          <path d="M8 5v14" />
          <path d="M11.5 10.5l2-2" />
          <path d="M10.5 13.5l3-3" />
          <path d="M11.5 13.5h2" />
        </svg>
      </button>
      <button
        class="tb-toggle tb-icon-toggle"
        :class="{ on: showPreview }"
        :title="showPreview ? 'Hide preview pane' : 'Show preview pane'"
        :aria-label="showPreview ? 'Hide preview pane' : 'Show preview pane'"
        :aria-pressed="showPreview"
        @click="$emit('toggle-preview')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 6h18v12H3z" />
          <path d="M7 10h10" />
          <path d="M7 14h6" />
        </svg>
      </button>
    </div>

    <!-- Filename Modal -->
    <FilenameModal
      :is-open="showFilenameModal"
      :default-filename="defaultFilename"
      @save="handleSaveAs"
      @cancel="showFilenameModal = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { EditorActions } from '../composables/useEditorActions'
  import EmojiPicker from './EmojiPicker.vue'
  import FilenameModal from './FilenameModal.vue'
  import HeadingPicker from './HeadingPicker.vue'

  interface Props {
    actions: EditorActions
    autosave: boolean
    theme: 'dark' | 'light'
    showPreview: boolean
    showEditor: boolean
  }

  const props = defineProps<Props>()

  defineEmits<{
    'toggle-preview': []
    'toggle-editor': []
    'toggle-theme': []
    'update:autosave': [value: boolean]
    'clear-storage': []
  }>()

  const showFilenameModal = ref(false)

  const defaultFilename = computed(() => {
    return `document-${new Date().toISOString().split('T')[0]}`
  })

  const handleSaveAs = (filename: string) => {
    props.actions.saveAsMarkdownFile(filename)
    showFilenameModal.value = false
  }
</script>

<style scoped>
.tb-bar {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 38px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  gap: 1px;
  overflow-x: auto;
}

.tb-group { display: flex; align-items: center; gap: 1px; }

.tb-sep {
  width: 1px;
  height: 15px;
  background: var(--border);
  margin: 0 5px;
  flex-shrink: 0;
}

.editor-toolbar-btn {
  width: 28px !important;
  height: 26px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 4px !important;
  border: none !important;
  background: transparent !important;
  color: var(--icon) !important;
  cursor: pointer !important;
  transition: background 0.12s, color 0.12s !important;
  flex-shrink: 0 !important;
  padding: 0 !important;
}

.editor-toolbar-btn:hover {
  background: var(--raised) !important;
  color: var(--icon-strong) !important;
}

.editor-toolbar-btn svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: block;
  pointer-events: none;
}

.tb-pane-toggles {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tb-autosave-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: var(--muted);
  cursor: pointer;
  padding: 0 6px;
  user-select: none;
}

.tb-autosave-check {
  width: 12px;
  height: 12px;
  accent-color: var(--accent);
  cursor: pointer;
}

.tb-toggle {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.12s;
}

.tb-icon-toggle {
  width: 28px;
  min-width: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tb-icon-toggle svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tb-toggle.on {
  background: var(--toggle-active-bg);
  border-color: var(--toggle-active-border);
  color: var(--toggle-active-text);
}

.tb-toggle:hover {
  color: var(--text);
}

.tb-clear-btn:hover {
  background: var(--danger-soft) !important;
  color: var(--danger) !important;
}
</style>
