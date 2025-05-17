<template>
  <div class="markdown-editor-container h-full w-full flex flex-col">
    <!-- Main pane container with single scroll -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="main-scroll-container flex-1 overflow-y-auto w-full" ref="mainScrollContainer">
        <div class="pane-container flex flex-row w-full min-h-full">
          <!-- Editor Pane -->
          <div 
            v-if="isEditorVisible"
            class="editor-container transition-width duration-100 flex flex-col" 
            :style="{ width: editorWidthPercent + '%' }">
            <div class="editor-pane border-r border-opacity-10 border-white bg-dark-surface">
              <textarea
                v-model="markdownText"
                class="w-full outline-none resize-none bg-transparent p-4 font-mono text-sm leading-relaxed no-scrollbar"
                placeholder="Type your markdown here..."
                ref="textareaRef"
                @input="autoResizeTextarea"
              ></textarea>
            </div>
          </div>
          
          <!-- Draggable Divider -->
          <div 
            v-if="isEditorVisible"
            class="divider w-1.5 bg-opacity-5 bg-white hover:bg-blue-800 cursor-col-resize flex items-center justify-center" 
            @mousedown="startDrag" 
            @touchstart.prevent="startDrag"
            title="Drag to resize"
          >
            <div class="divider-handle w-0.5 h-9 bg-white bg-opacity-30 rounded"></div>
          </div>
          
          <!-- Preview Pane -->
          <div
            class="preview-container transition-width duration-100 flex flex-col relative"
            :style="{ width: previewWidthPercent + '%' }">
            <div class="preview-controls absolute top-2 right-2 z-10" v-if="previewPane">
              <button @click="toggleEditorVisibility" :title="isEditorVisible ? 'Hide Editor' : 'Show Editor'" class="bg-gray-800 p-1 rounded">
                <svg v-if="isEditorVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M2,9 L0,9 L0,14 L5,14 L5,12 L2,12 L2,9 L2,9 Z M0,5 L2,5 L2,2 L5,2 L5,0 L0,0 L0,5 L0,5 Z M12,12 L9,12 L9,14 L14,14 L14,9 L12,9 L12,12 L12,12 Z M9,0 L9,2 L12,2 L12,5 L14,5 L14,0 L9,0 L9,0 Z"></path>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M0,11 L3,11 L3,14 L5,14 L5,9 L0,9 L0,11 L0,11 Z M3,3 L0,3 L0,5 L5,5 L5,0 L3,0 L3,3 L3,3 Z M9,14 L11,14 L11,11 L14,11 L14,9 L9,9 L9,14 L9,14 Z M11,3 L11,0 L9,0 L9,5 L14,5 L14,3 L11,3 L11,3 Z"></path>
                </svg>
              </button>
            </div>
            <div class="preview-pane-content bg-deep-black relative" ref="previewPane">
              <div ref="previewContainer" class="markdown-content prose prose-invert max-w-none p-4 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer with word count -->
    <div class="bg-deep-black py-2 px-4 flex items-center justify-between border-t border-gray-800 flex-shrink-0">
      <div class="text-sm text-gray-400">
        {{ wordCount }} words | {{ characterCount }} characters
      </div>
      <div class="text-sm text-gray-400">
        <span v-if="lastSaved">Last saved: {{ lastSaved }}</span>
        <span v-else>Changes saved automatically</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, toRef } from 'vue'; // Removed nextTick, added toRef
import { setupMermaid } from '@/plugins/mermaid';
import 'highlight.js/styles/atom-one-dark.css';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import { useMarkdownRenderer } from '@/composables/useMarkdownRenderer';
import { usePaneResizer } from '@/composables/usePaneResizer';
import { useTextareaSizing } from '@/composables/useTextareaSizing';
import { useEditorStateAndPersistence } from '@/composables/useEditorStateAndPersistence'; // Added import

const props = defineProps({
  initialMarkdown: {
    type: String,
    default: ''
  }
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
`;

// Composable for editor state and persistence
const { 
  markdownText, 
  isEditorVisible, 
  lastSaved, 
  toggleEditorVisibility, 
} = useEditorStateAndPersistence(
  toRef(props, 'initialMarkdown'), 
  defaultContent,
  () => autoResizeTextarea() // Pass autoResizeTextarea as a callback
);

// Initialize the composable for pane resizing
const { editorWidthPercent, previewWidthPercent, startDrag } = usePaneResizer(mainScrollContainer, isEditorVisible);

// Initialize the composable for textarea sizing
const { autoResizeTextarea } = useTextareaSizing(textareaRef, previewPane, mainScrollContainer, previewContainer, isEditorVisible);

// Initialize the composable for keyboard shortcuts
const { handleKeyboardShortcut } = useKeyboardShortcuts(markdownText, textareaRef, autoResizeTextarea);

// Initialize the composable for Markdown rendering
const { debouncedRenderMarkdown, cleanupMarkdownRenderer } = useMarkdownRenderer(markdownText, previewContainer, autoResizeTextarea);

watch(markdownText, () => {
  debouncedRenderMarkdown();
}, { immediate: true });

onMounted(async () => {
  setupMermaid();
  document.addEventListener('keydown', handleKeyboardShortcut);
  autoResizeTextarea(); // Initial call after mount and state is loaded
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
  return cleanText
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
});

// Character count computation
const characterCount = computed(() => {
  return markdownText.value.length;
});
</script>
