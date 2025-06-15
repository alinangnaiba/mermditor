<template>  <div class="markdown-editor-container relative flex h-full w-full flex-col">
    <!-- Copy Editor Content Button -->
    <button
      v-if="isEditorVisible"
      title="Copy editor content"
      class="absolute top-3 z-20 rounded-md bg-surface-secondary p-1.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary focus:bg-surface-tertiary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
      :style="{ left: `calc(${editorWidthPercent}% - 28px - 12px - 44px)` }"
      aria-label="Copy editor content"
      @click="copyEditorContent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M0 2.75C0 1.784.784 1 1.75 1h7.5a.75.75 0 0 1 0 1.5h-7.5a.25.25 0 0 0-.25.25v7.5a.25.25 0 0 0 .25.25h.01L2 10.76V2.75z M4.75 4h7.5A1.75 1.75 0 0 1 14 5.75v7.5A1.75 1.75 0 0 1 12.25 15h-7.5A1.75 1.75 0 0 1 3 13.25v-7.5A1.75 1.75 0 0 1 4.75 4Zm0 1.5a.25.25 0 0 0-.25.25v7.5a.25.25 0 0 0 .25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25h-7.5Z"
        />
      </svg>
    </button>
    
    <!-- Hide Preview Button -->
    <button
      v-if="isEditorVisible"
      :title="isPreviewVisible ? 'Hide Preview' : 'Show Preview'"
      class="absolute top-3 z-20 rounded-md bg-surface-secondary p-1.5 text-text-tertiary transition-colors hover:bg-surface-tertiary hover:text-text-primary focus:bg-surface-tertiary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
      :style="{ left: `calc(${editorWidthPercent}% - 28px - 12px)` }"
      :aria-label="isPreviewVisible ? 'Hide Preview' : 'Show Preview'"
      @click="togglePreviewVisibility"
    >
      <!-- Hide Preview: Right-pointing arrows -->
      <svg
        v-if="isPreviewVisible"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M13,6 L15,6 L15,1 L10,1 L10,3 L13,3 L13,6 Z M15,10 L13,10 L13,13 L10,13 L10,15 L15,15 L15,10 Z M6,3 L6,1 L1,1 L1,6 L3,6 L3,3 L6,3 Z M1,10 L3,10 L3,13 L6,13 L6,15 L1,15 L1,10 Z"
          fill="currentColor"
        />
      </svg>
      <!-- Show Preview: Left-pointing arrows -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          d="M3,10 L1,10 L1,15 L6,15 L6,13 L3,13 L3,10 Z M1,6 L3,6 L3,3 L6,3 L6,1 L1,1 L1,6 Z M13,13 L10,13 L10,15 L15,15 L15,10 L13,10 L13,13 Z M10,1 L10,3 L13,3 L13,6 L15,6 L15,1 L10,1 Z"
          fill="currentColor"
        />
      </svg>
    </button>    <!-- Moved preview-controls here -->
    <div v-if="isPreviewVisible" class="preview-controls absolute right-3 top-3 z-20">
      <button
        :title="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
        class="rounded-md bg-surface-secondary p-1.5 text-text-tertiary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
        :aria-label="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
        @click="toggleEditorVisibility"
      >
        <!-- Hide Editor: L shapes point inward -->
        <svg
          v-if="isEditorVisible"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            d="M3,10 L1,10 L1,15 L6,15 L6,13 L3,13 L3,10 Z M1,6 L3,6 L3,3 L6,3 L6,1 L1,1 L1,6 Z M13,13 L10,13 L10,15 L15,15 L15,10 L13,10 L13,13 Z M10,1 L10,3 L13,3 L13,6 L15,6 L15,1 L10,1 Z"
            fill="currentColor"
          />
        </svg>
        <!-- Show Editor: L shapes point outward -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            d="M1,12 L4,12 L4,15 L6,15 L6,10 L1,10 L1,12 Z M4,4 L1,4 L1,6 L6,6 L6,1 L4,1 L4,4 Z M10,15 L12,15 L12,12 L15,12 L15,10 L10,10 L10,15 Z M12,4 L12,1 L10,1 L10,6 L15,6 L15,4 L12,4 Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <!-- Main pane container with single scroll -->
    <div class="flex min-h-0 flex-1 flex-col">
      <div ref="mainScrollContainer" class="main-scroll-container w-full flex-1 overflow-y-auto">
        <div class="pane-container flex min-h-full w-full flex-row">          <!-- Editor Pane -->
          <div
            v-if="isEditorVisible"
            class="editor-container transition-width flex flex-col duration-100"
            :style="{ width: isPreviewVisible ? editorWidthPercent + '%' : '100%' }"
          >
            <div class="editor-pane border-r border-border-primary bg-surface-primary">
              <textarea
                ref="textareaRef"
                v-model="markdownText"
                class="no-scrollbar w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-text-primary placeholder-text-tertiary outline-none"
                placeholder="Type your markdown here..."
                @input="autoResizeTextarea"
              />
            </div>
          </div>          <!-- Draggable Divider -->
          <div
            v-if="isEditorVisible && isPreviewVisible"
            class="divider flex w-1.5 cursor-col-resize items-center justify-center bg-surface-tertiary hover:bg-accent-primary"
            title="Drag to resize"
            @mousedown="startDrag"
            @touchstart.prevent="startDrag"
          >
            <div class="divider-handle h-9 w-0.5 rounded bg-text-tertiary"/>
          </div>          <!-- Preview Pane -->
          <div
            v-show="isPreviewVisible"
            class="preview-container transition-width relative flex flex-col duration-100"
            :style="{ width: previewWidthPercent + '%' }"
          >
            <!-- preview-controls div was removed from here -->
            <div ref="previewPane" class="preview-pane-content relative bg-surface-primary">
              <div
                ref="previewContainer"
                class="markdown-content prose prose-invert h-full max-w-none p-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer with word count -->
    <div
      class="flex flex-shrink-0 items-center justify-between border-t border-border-primary bg-surface-primary px-4 py-2"
    >
      <div class="text-sm text-text-tertiary">
        {{ wordCount }} words | {{ characterCount }} characters
      </div>
      <div class="text-sm text-text-tertiary">
        <span v-if="lastSaved">Last saved: {{ lastSaved }}</span>
        <span v-else>Changes saved automatically</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, toRef } from 'vue' // Removed nextTick, added toRef
import 'highlight.js/styles/atom-one-dark.css'
// Composables are auto-imported in Nuxt

const props = defineProps({
  initialMarkdown: {
    type: String,
    default: '',
  },
})

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const previewPane = ref<HTMLElement | null>(null)
const mainScrollContainer = ref<HTMLElement | null>(null)
const previewContainer = ref<HTMLElement | null>(null)

const defaultContent = `# Markdown Editor with Mermaid

## Basic Markdown

This is a paragraph with **bold** and *italic* text.

### Lists

- Item 1
- Item 2
  - Nested item
  
1. Ordered item 1
2. Ordered item 2

### Code

Inline \`code\` looks like this.

\`\`\`javascript
// Code block
const hello = "world";
console.log(hello);
\`\`\`

## Mermaid Diagram Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]
\`\`\`

### Flowchart

\`\`\`mermaid
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
\`\`\`
`

// Composable for editor state and persistence
const { markdownText, isEditorVisible, isPreviewVisible, lastSaved, toggleEditorVisibility, togglePreviewVisibility } =
  useEditorStateAndPersistence(
    toRef(props, 'initialMarkdown'),
    defaultContent,
    () => autoResizeTextarea() // Pass autoResizeTextarea as a callback
  )

// Initialize the composable for pane resizing
const { editorWidthPercent, previewWidthPercent, startDrag } = usePaneResizer(
  mainScrollContainer,
  isEditorVisible,
  isPreviewVisible
)

// Initialize the composable for textarea sizing
const { autoResizeTextarea } = useTextareaSizing(
  textareaRef,
  previewPane,
  mainScrollContainer,
  previewContainer,
  isEditorVisible,
  isPreviewVisible
)

// Initialize the composable for keyboard shortcuts
const { handleKeyboardShortcut } = useKeyboardShortcuts(
  markdownText,
  textareaRef,
  autoResizeTextarea
)

// Initialize the composable for Markdown rendering
const { debouncedRenderMarkdown, cleanupMarkdownRenderer } = useMarkdownRenderer(
  markdownText,
  previewContainer,
  autoResizeTextarea
)

const copyEditorContent = async () => {
  if (!markdownText.value || markdownText.value.trim() === '') {
    alert('Nothing to copy.') // Consider a more subtle notification
    return
  }
  try {
    await navigator.clipboard.writeText(markdownText.value)
    alert('Editor content copied to clipboard!') // Consider a more subtle notification
  } catch (err) {
    console.error('Failed to copy editor content:', err)
    alert('Failed to copy content. Check console for details.') // Consider a more subtle notification
  }
}

watch(
  markdownText,
  () => {
    debouncedRenderMarkdown()
  },
  { immediate: true }
)

onMounted(async () => {
  document.addEventListener('keydown', handleKeyboardShortcut)
  autoResizeTextarea() // Initial call after mount and state is loaded
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut)
  cleanupMarkdownRenderer()
})

// Word count computation
const wordCount = computed(() => {
  if (!markdownText.value) return 0
  const cleanText = markdownText.value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*_~`]/g, '')
  return cleanText.split(/\s+/).filter((word) => word.length > 0).length
})

// Character count computation
const characterCount = computed(() => {
  return markdownText.value.length
})
</script>
