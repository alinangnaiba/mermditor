<template>
  <div class="markdown-editor-container h-full w-full flex flex-col relative"> <!-- Added 'relative' class -->
    <!-- Moved preview-controls here -->    <div class="preview-controls absolute top-2 right-4 z-10" v-if="previewPane">
      <button @click="toggleEditorVisibility" :title="isEditorVisible ? 'Hide Editor' : 'Show Editor'" class="bg-gray-800 p-1 rounded">
        <!-- Hide Editor: L shapes point inward -->
        <svg v-if="isEditorVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
          <path d="M3,10 L1,10 L1,15 L6,15 L6,13 L3,13 L3,10 Z M1,6 L3,6 L3,3 L6,3 L6,1 L1,1 L1,6 Z M13,13 L10,13 L10,15 L15,15 L15,10 L13,10 L13,13 Z M10,1 L10,3 L13,3 L13,6 L15,6 L15,1 L10,1 Z" fill="currentColor"/>
        </svg>
        <!-- Show Editor: L shapes point outward -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
          <path d="M1,12 L4,12 L4,15 L6,15 L6,10 L1,10 L1,12 Z M4,4 L1,4 L1,6 L6,6 L6,1 L4,1 L4,4 Z M10,15 L12,15 L12,12 L15,12 L15,10 L10,10 L10,15 Z M12,4 L12,1 L10,1 L10,6 L15,6 L15,4 L12,4 Z" fill="currentColor"/>
        </svg>
      </button>
    </div>

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
            <!-- preview-controls div was removed from here -->
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
