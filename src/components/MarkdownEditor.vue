<template>
  <div class="markdown-editor-container h-full w-full flex flex-col">
    <!-- Main pane container with single scroll -->
    <div class="flex-1 flex flex-col min-h-0">
      <div class="main-scroll-container flex-1 overflow-y-auto w-full" ref="mainScrollContainer">
        <div class="pane-container flex flex-row w-full min-h-full">
          <!-- Editor Pane -->
          <div class="editor-container transition-width duration-100 flex flex-col" :style="{ width: editorWidthPercent + '%' }">
            <div class="editor-pane border-r border-opacity-10 border-white bg-dark-50">
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
            class="divider w-1.5 bg-opacity-5 bg-white hover:bg-blue-800 cursor-col-resize flex items-center justify-center" 
            @mousedown="startDrag" 
            @touchstart.prevent="startDrag"
            title="Drag to resize"
          >
            <div class="divider-handle w-0.5 h-9 bg-white bg-opacity-30 rounded"></div>
          </div>
          
          <!-- Preview Pane -->
          <div class="preview-container transition-width duration-100 flex flex-col" :style="{ width: (100 - editorWidthPercent) + '%' }">
            <div class="preview-pane-content bg-deep-black" ref="previewPane">
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
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '@/plugins/markdownItMermaid';
import { markdownItHighlight } from '@/plugins/markdownItHighlight';
import { setupMermaid } from '@/plugins/mermaid';
import MermaidRenderer from '@/components/MermaidRenderer.vue';
import { createApp } from 'vue';
import debounce from 'lodash/debounce';
import 'highlight.js/styles/atom-one-dark.css';

// Setup markdown parser with plugins
const md = new MarkdownIt({
  highlight: null // Disable built-in highlighting as we'll use our custom plugin
});

// Register the plugins - order matters: highlight first, then mermaid
md.use(markdownItHighlight);
md.use(markdownItMermaid);

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const previewPane = ref<HTMLElement | null>(null);
const mainScrollContainer = ref<HTMLElement | null>(null);
const previewContainer = ref<HTMLElement | null>(null);

const editorWidthPercent = ref(50);
let isDragging = false;

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging = true;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag, { passive: false }); // passive:false for touchmove
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  document.body.style.userSelect = 'none';
};

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging || !mainScrollContainer.value) return;
  
  e.preventDefault(); // Prevent page scroll during drag, especially on touch

  const containerRect = mainScrollContainer.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  
  let clientX: number;
  if (e.type.startsWith('touch')) {
    clientX = (e as TouchEvent).touches[0].clientX;
  } else {
    clientX = (e as MouseEvent).clientX;
  }
  
  const editorWidth = clientX - containerRect.left;
  const percentage = Math.min(Math.max((editorWidth / containerWidth) * 100, 10), 90); // Min 10%, Max 90%
  editorWidthPercent.value = percentage;
};

const stopDrag = () => {
  if (!isDragging) return;
  isDragging = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  document.body.style.userSelect = '';
  localStorage.setItem('mermd-editor-width', editorWidthPercent.value.toString()); // Save width on drag end
};

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

const props = defineProps({
  initialMarkdown: {
    type: String,
    default: ''
  }
});

const markdownText = ref(''); // Initialize empty

let mermaidRenderTimeoutId: ReturnType<typeof setTimeout> | undefined;

const renderMarkdown = async () => {
  if (!previewContainer.value) return;
  
  const html = md.render(markdownText.value || '');
  previewContainer.value.innerHTML = html;
  
  await nextTick(); // Wait for initial HTML to be in DOM
  
  const mermaidPlaceholders = previewContainer.value.querySelectorAll('.mermaid-placeholder');
  
  mermaidPlaceholders.forEach((placeholder, index) => {
    const mermaidCode = decodeURIComponent(placeholder.getAttribute('data-mermaid-code') || '');
    if (!mermaidCode) return;
    
    const container = document.createElement('div');
    placeholder.replaceWith(container);
    
    const app = createApp(MermaidRenderer, {
      code: mermaidCode,
      idSuffix: `${index}-${Date.now()}`
    });
    app.mount(container);
  });

  // After processing and attempting to mount all diagrams, schedule a resize.
  // This gives Mermaid diagrams a bit of time to render before height is calculated.
  if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId);
  mermaidRenderTimeoutId = setTimeout(async () => {
    await autoResizeTextarea();
  }, 200); // Adjust delay if needed (e.g., 200-300ms)
};

const debouncedRenderMarkdown = debounce(renderMarkdown, 150);

const lastSaved = ref<string>('');
const saveToLocalStorage = debounce((content: string) => {
  localStorage.setItem('mermd-content', content);
  const now = new Date();
  lastSaved.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 500);


onMounted(async () => {
  setupMermaid();

  // Prioritize prop, then localStorage, then default content
  if (props.initialMarkdown) {
    markdownText.value = props.initialMarkdown;
  } else {
    const savedMarkdown = localStorage.getItem('mermd-markdown-input');
    if (savedMarkdown) {
      markdownText.value = savedMarkdown;
    } else {
      markdownText.value = defaultContent;
    }
  }

  const savedWidth = localStorage.getItem('mermd-editor-width');
  if (savedWidth) {
    editorWidthPercent.value = parseFloat(savedWidth);
  }
  
  window.addEventListener('resize', autoResizeTextarea);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut);
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  window.removeEventListener('resize', autoResizeTextarea);
  if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId); // Clear timeout on unmount
});

watch(() => markdownText.value, (newValue) => { // Removed async from watcher callback as it only calls sync + debounced
  debouncedRenderMarkdown();
  saveToLocalStorage(newValue || '');
  // No direct call to autoResizeTextarea here anymore.
}, { immediate: true });


const autoResizeTextarea = async () => {
  if (textareaRef.value && previewPane.value && mainScrollContainer.value && previewContainer.value) {
    // Reset heights to auto to allow scrollHeight to be calculated correctly
    textareaRef.value.style.height = 'auto';
    previewPane.value.style.height = 'auto'; // This is the container for markdown-content

    await nextTick(); // Wait for DOM to update with auto heights

    const scrollContainerHeight = mainScrollContainer.value.clientHeight;
    
    const textareaScrollHeight = textareaRef.value.scrollHeight;
    const previewContentScrollHeight = previewContainer.value.scrollHeight; // scrollHeight of the .markdown-content div
    
    const minPixelHeight = 80; // Minimum height for each pane's content
    
    const requiredTextareaHeight = Math.max(textareaScrollHeight, minPixelHeight);
    const requiredPreviewHeight = Math.max(previewContentScrollHeight, minPixelHeight);
    
    const maxContentHeight = Math.max(requiredTextareaHeight, requiredPreviewHeight);
    
    const finalNewHeight = Math.max(maxContentHeight, scrollContainerHeight);

    textareaRef.value.style.height = `${finalNewHeight}px`;
    previewPane.value.style.height = `${finalNewHeight}px`; // Set height of .preview-pane-content
  }
};

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


const handleKeyboardShortcut = (e: KeyboardEvent) => {
  if (!(e.ctrlKey || e.metaKey) || !textareaRef.value) return;
  const key = e.key.toLowerCase();
  const { selectionStart: start, selectionEnd: end } = textareaRef.value;
  const selectedText = textareaRef.value.value.substring(start, end);
  const selection = { start, end, text: selectedText };

  let formattedText = '';
  let cursorOffsetStart = 0; // Relative to start of formattedText
  let cursorOffsetEnd = 0;   // Relative to end of formattedText (or same as start for no selection)

  switch (key) {
    case 'b': // Bold
      e.preventDefault();
      formattedText = `**${selectedText || 'bold text'}**`;
      cursorOffsetStart = 2;
      cursorOffsetEnd = selectedText ? formattedText.length - 2 : 2;
      break;
    case 'i': // Italic
      e.preventDefault();
      formattedText = `*${selectedText || 'italic text'}*`;
      cursorOffsetStart = 1;
      cursorOffsetEnd = selectedText ? formattedText.length - 1 : 1;
      break;
    // Add other cases for k (link), 1 (heading) etc.
    default:
      return; // Exit if no shortcut matched
  }

  const value = textareaRef.value.value;
  markdownText.value = value.substring(0, start) + formattedText + value.substring(end);

  nextTick(() => {
    if (!textareaRef.value) return;
    textareaRef.value.focus();
    const newCursorPosStart = start + cursorOffsetStart;
    const newCursorPosEnd = start + cursorOffsetEnd;
    textareaRef.value.setSelectionRange(newCursorPosStart, newCursorPosEnd);
  });
};
</script>

<style scoped>
/* Component-specific styles */

.pane-container {
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
}

.editor-container, .preview-container {
  transition: width 0.1s ease;
  display: flex; 
  flex-direction: column; 
}

/* Styles for the direct parent of textarea */
.editor-pane {
  border-right: 1px solid rgba(0, 0, 0, 0.1); /* var(--border-color-translucent) or similar */
  position: relative;
  background-color: var(--background-dark);
  display: flex; 
  flex-direction: column;
}

/* Styles for the direct parent of the rendered markdown output */
.preview-pane-content { 
  border-left: 1px solid var(--border-color);
  background-color: var(--background-darker);
  overflow: hidden; /* This pane should not scroll; main-scroll-container does */
}

/* The actual div where markdown HTML is rendered */
.markdown-content {
  height: 100%; 
}


textarea {
  font-family: 'Courier New', monospace;
  width: 100%; 
  border: none;
  background-color: transparent; 
  resize: none; 
  padding: 16px; 
  font-size: 1rem; /* text-sm class (usually 0.875rem), consider if 1rem is intended */
  line-height: 1.6; 
  outline: none; 
  overflow-y: hidden; /* Textarea itself should not scroll vertically */
  position: relative; 
  z-index: 2; 
}

.markdown-editor-container {
  height: 100%; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; /* Prevent this container itself from showing scrollbars if children are managed */
}

.main-scroll-container {
  scrollbar-width: auto;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  position: relative; 
}

.main-scroll-container::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.main-scroll-container::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.main-scroll-container::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0.2); /* Consider var(--scrollbar-track) for border for better theme integration */
}

/* Divider styles */
.divider {
  width: 6px;
  background: rgba(255, 255, 255, 0.05);
  cursor: col-resize;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.divider:hover, .divider:active {
  background: #041C42; /* Consider using CSS variables if this color needs theming */
}

.divider-handle {
  width: 2px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

.divider:hover .divider-handle {
  background-color: rgba(255, 255, 255, 0.6);
}


/* Media query for mobile view */
@media (max-width: 768px) {
  .preview-pane-content { 
    border-left: none !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  /* If .pane-container changes to flex-col on mobile, ensure editor/preview width is 100% */
}

/* Fullscreen mode styling - unchanged */
.fullscreen-mode {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  height: 100vh !important;
  width: 100vw !important;
  margin: 0;
  padding: 0;
  border-radius: 0 !important;
}

.fullscreen-mode textarea {
  font-size: 1.1rem;
}
</style>
