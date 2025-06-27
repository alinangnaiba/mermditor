<template>  <div class="markdown-editor-container relative flex h-full w-full flex-col">
    <!-- Floating Action Bar - Above all panes -->
    <div class="relative z-30 flex justify-center py-2">
      <div class="flex items-center space-x-1 rounded-lg bg-surface-tertiary/95 shadow-lg backdrop-blur-sm border border-border-primary">
        <!-- Copy Content Button -->
        <button
          title="Copy content"
          class="rounded-md p-2 text-text-tertiary transition-colors hover:bg-surface-quaternary hover:text-text-primary focus:bg-surface-quaternary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          aria-label="Copy editor content" 
          @click="copyEditorContent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14H5v-1H3.5a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h7a.5.5 0 01.5.5V4h1V3.5A1.5 1.5 0 0010.5 2h-7z"/>
            <path d="M7.5 5A1.5 1.5 0 006 6.5v9A1.5 1.5 0 007.5 17h7a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 5h-7zM7 6.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-9z"/>
          </svg>
        </button>

        <!-- Divider -->
        <div class="h-6 w-px bg-border-secondary"/>

        <!-- Hide/Show Preview Button -->
        <button
          :title="isPreviewVisible ? 'Hide Preview' : 'Show Preview'"
          class="rounded-md p-2 text-text-tertiary transition-colors hover:bg-surface-quaternary hover:text-text-primary focus:bg-surface-quaternary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          :aria-label="isPreviewVisible ? 'Hide Preview' : 'Show Preview'"
          @click="customTogglePreviewVisibility"
        >
          <!-- Hide Preview: Eye with slash -->
          <svg
            v-if="isPreviewVisible"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
          </svg>
          <!-- Show Preview: Eye -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
          </svg>
        </button>

        <!-- Hide/Show Editor Button -->
        <button
          :title="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
          class="rounded-md p-2 text-text-tertiary transition-colors hover:bg-surface-quaternary hover:text-text-primary focus:bg-surface-quaternary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          :aria-label="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
          @click="toggleEditorVisibility"
        >          <!-- Hide Editor: Code icon with slash -->
          <svg
            v-if="isEditorVisible"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
          <!-- Show Editor: Code icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
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
            <div class="editor-pane border-r border-border-primary bg-deep-black">
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
import { ref, onMounted, onBeforeUnmount, watch, computed, toRef } from 'vue'; // Removed nextTick, added toRef
import 'highlight.js/styles/atom-one-dark.css';
// Composables are auto-imported in Nuxt

const props = defineProps({
  initialMarkdown: {
    type: String,
    default: '',
  },
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const previewPane = ref<HTMLElement | null>(null);
const mainScrollContainer = ref<HTMLElement | null>(null);
const previewContainer = ref<HTMLElement | null>(null);

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

## LaTeX Math Examples

### Inline Math
You can include inline math like $x^2 + y^2 = z^2$ or $E = mc^2$ within sentences.

### Block Math
For more complex equations, use block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$
`;

const { markdownText, isEditorVisible, isPreviewVisible, lastSaved, toggleEditorVisibility, togglePreviewVisibility } =
  useEditorStateAndPersistence(
    toRef(props, 'initialMarkdown'),
    defaultContent,
    () => autoResizeTextarea() // Pass autoResizeTextarea as a callback
  );

const { editorWidthPercent, previewWidthPercent, startDrag } = usePaneResizer(
  mainScrollContainer,
  isEditorVisible,
  isPreviewVisible
);

const { autoResizeTextarea } = useTextareaSizing(
  textareaRef,
  previewPane,
  mainScrollContainer,
  previewContainer,
  isEditorVisible,
  isPreviewVisible
);

const { handleKeyboardShortcut } = useKeyboardShortcuts(
  markdownText,
  textareaRef,
  autoResizeTextarea
);

const { renderMarkdown, cleanupMarkdownRenderer } = useMarkdownRenderer(
  markdownText,
  previewContainer,
  autoResizeTextarea
);

const { success, error } = useToast();

// Custom toggle function that pre-renders before showing preview
const customTogglePreviewVisibility = async () => {
  if (isPreviewVisible.value) {
    // If preview is visible, just hide it (no pre-rendering needed)
    togglePreviewVisibility();
  } else {
    // If preview is hidden, render before showing
    await renderMarkdown();
    togglePreviewVisibility();
  }
};

const copyEditorContent = async () => {
  if (!markdownText.value || markdownText.value.trim() === '') {
    error('Nothing to copy');
    return;
  }
  try {
    await navigator.clipboard.writeText(markdownText.value);
    success('Content copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy editor content:', err);
    error('Failed to copy content');
  }
};

watch(
  markdownText,
  () => {
    // Only render the markdown when the preview pane is visible
    if (isPreviewVisible.value) {
      renderMarkdown();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  document.addEventListener('keydown', handleKeyboardShortcut);
  autoResizeTextarea();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut);
  cleanupMarkdownRenderer();
});

// Word count computation
const wordCount = computed(() => {
  if (!markdownText.value) return 0;
  const cleanText = markdownText.value
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/[#*_~`]/g, '');
  return cleanText.split(/\s+/).filter((word) => word.length > 0).length;
});

// Character count computation
const characterCount = computed(() => {
  return markdownText.value.length;
});
</script>
