<template>
  <div class="markdown-editor-container h-screen w-full flex flex-col">
    <!-- Main scroll container wrapping both panes -->
    <div class="main-scroll-container flex-1 overflow-y-auto" ref="mainScrollContainer">
      <div class="pane-container flex flex-row h-auto min-h-full">
        <!-- Editor Pane -->
        <div class="editor-container h-auto min-h-full transition-width duration-100" :style="{ width: editorWidthPercent + '%' }">
          <div class="editor-pane h-full bg-dark-50 border-r border-opacity-10 border-white">      <textarea
              v-model="markdownText"
              class="w-full h-full outline-none resize-none bg-transparent p-4 font-mono text-sm leading-relaxed no-scrollbar"
              placeholder="Type your markdown here..."
              ref="textareaRef"
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
        <div class="preview-container h-auto min-h-full transition-width duration-100" :style="{ width: (100 - editorWidthPercent) + '%' }">
          <div class="h-full bg-deep-black p-4" ref="previewPane">
            <div ref="previewContainer" class="markdown-content prose prose-invert max-w-none"></div>
          </div>
        </div>
      </div>
    </div>      <!-- Footer with word count only -->    
    <div class="bg-deep-black py-2 px-4 flex items-center border-t border-gray-800">
      <!-- Word count -->
      <div class="text-sm text-gray-400">
        {{ wordCount }} words | {{ characterCount }} characters
        <span v-if="editorSettings.autoSave" class="ml-2">(Auto-save on)</span>
      </div>
    </div>
      <!-- No dialogs or toast notifications needed anymore -->
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
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
  highlight: null // Disable built-in highlighting as we'll use our custom plugin
});

// Register the plugins - order matters: highlight first, then mermaid
md.use(markdownItHighlight);
md.use(markdownItMermaid);

// References for DOM manipulation
const previewContainer = ref<HTMLElement | null>(null);
const previewPane = ref<HTMLElement | null>(null);
const mainScrollContainer = ref<HTMLElement | null>(null);

// Editor width percentage with default value of 50%
const editorWidthPercent = ref(50);
let isDragging = false;

// Function to handle the start of a drag operation
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging = true;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
  document.body.style.userSelect = 'none'; // Prevent text selection while dragging
};

// Function to handle dragging the divider
const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return;
  
  // Get the container width
  const containerRect = mainScrollContainer.value!.getBoundingClientRect();
  const containerWidth = containerRect.width;
  
  // Get mouse/touch position
  let clientX: number;
  if ('touches' in e) {
    // Touch event
    clientX = e.touches[0].clientX;
  } else {
    // Mouse event
    clientX = e.clientX;
  }
  
  // Calculate editor width as percentage of container
  const editorWidth = clientX - containerRect.left;
  const percentage = Math.min(Math.max((editorWidth / containerWidth) * 100, 10), 90);
  editorWidthPercent.value = percentage;
  
  // Store the width preference in localStorage
  localStorage.setItem('mermd-editor-width', percentage.toString());
};

// Function to stop dragging
const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  document.body.style.userSelect = ''; // Restore text selection
};

// Default markdown text with examples
const markdownText = ref(`# Markdown Editor with Mermaid

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
`);

/**
 * Process markdown content and render it, including handling mermaid diagrams
 */
const renderMarkdown = async () => {
  if (!previewContainer.value) return;
  
  // Render markdown to HTML
  const html = md.render(markdownText.value || '');
  previewContainer.value.innerHTML = html;
  
  // Wait for DOM to update
  await nextTick();
  
  // Find all mermaid placeholders and render them
  const mermaidPlaceholders = previewContainer.value.querySelectorAll('.mermaid-placeholder');
  
  mermaidPlaceholders.forEach((placeholder, index) => {
    const mermaidCode = decodeURIComponent(placeholder.getAttribute('data-mermaid-code') || '');
    
    // Skip if no code is found
    if (!mermaidCode) return;
    
    // Create a container for the mermaid diagram
    const container = document.createElement('div');
    placeholder.replaceWith(container);
    
    // Mount the MermaidRenderer component
    const app = createApp(MermaidRenderer, {
      code: mermaidCode,
      idSuffix: `${index}-${Date.now()}`
    });
    
    app.mount(container);
  });
};

// Debounced version of renderMarkdown to prevent excessive renders during typing
const debouncedRenderMarkdown = debounce(renderMarkdown, 50);

// For mobile view toggle
const showPreview = ref(false);

// For editor settings
const editorSettings = ref({
  fontSize: 16,
  theme: 'dark',
  autoSave: false
});

// Auto-save interval reference
const autoSaveInterval = ref<number | null>(null);

/**
 * Handle keyboard shortcuts
 */
const handleKeyboardShortcut = (e: KeyboardEvent) => {
  // Only proceed if Ctrl key (or Command key on Mac) is pressed
  if (!(e.ctrlKey || e.metaKey)) return;
  
  const key = e.key.toLowerCase();
  
  // Get current selection
  if (!textareaRef.value) return;
  const start = textareaRef.value.selectionStart;
  const end = textareaRef.value.selectionEnd;
  const selectedText = textareaRef.value.value.substring(start, end);
  const selection = { start, end, text: selectedText };
  
  switch (key) {
    case 'b': // Bold
      e.preventDefault();
      handleFormat('bold', selection);
      break;
    case 'i': // Italic
      e.preventDefault();
      handleFormat('italic', selection);
      break;
    case 'k': // Link
      e.preventDefault();
      handleFormat('link', selection);
      break;
    case '1': // Heading
      if (e.shiftKey) {
        e.preventDefault();
        handleFormat('heading', selection);
      }
      break;
    //case 's': // Save will revisit this functionality
    //  e.preventDefault();
    //  break;
    default:
      break;
  }
};

// Initialize mermaid and render markdown when component is mounted
onMounted(() => {
  setupMermaid();
  renderMarkdown();
  
  // Load saved editor width if available
  const savedWidth = localStorage.getItem('mermd-editor-width');
  if (savedWidth) {
    editorWidthPercent.value = Number(savedWidth);
  }
    // Prevent mousewheel in textarea from blocking main container scrolling
  if (textareaRef.value) {
    textareaRef.value.addEventListener('wheel', (e: WheelEvent) => {
      // Let the main container handle the scroll
      if (mainScrollContainer.value) {
        mainScrollContainer.value.scrollTop += e.deltaY;
      }
      // Prevent default to avoid textarea scroll
      e.preventDefault();
    });
    
    // Ensure the textarea doesn't scroll independently
    textareaRef.value.addEventListener('scroll', (e: Event) => {
      textareaRef.value!.scrollTop = 0;
    });
  }
  
  // Set up keyboard shortcut listener
  document.addEventListener('keydown', handleKeyboardShortcut);
  
  // Add before unload event to warn user about unsaved changes
  //window.addEventListener('beforeunload', beforeUnloadHandler);
});

// Remove event listeners on component unmount
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut);
  
  // Clean up drag event listeners
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
  
  // Clear auto-save interval if set
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value);
  }
});

// Watch for changes in markdown text and re-render
watch(() => markdownText.value, () => {
  debouncedRenderMarkdown();
});

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Word count computation
const wordCount = computed(() => {
  if (!markdownText.value) return 0;
  const cleanText = markdownText.value
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with just their text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove images
    .replace(/[#*_~`]/g, ''); // Remove markdown symbols
  
  return cleanText
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
});

// Character count computation
const characterCount = computed(() => {
  if (!markdownText.value) return 0;
  return markdownText.value.length;
});

/**
 * Format text based on the selected format type
 */
const handleFormat = (formatType: string, selection: { start: number; end: number; text: string }) => {
  if (!textareaRef.value) return;
  
  const { start, end, text } = selection;
  let formattedText = '';
  let cursorOffset = 0;
  
  switch (formatType) {
    case 'bold':
      formattedText = `**${text || 'bold text'}**`;
      cursorOffset = text ? 0 : -2;
      break;
    case 'italic':
      formattedText = `*${text || 'italic text'}*`;
      cursorOffset = text ? 0 : -1;
      break;
    case 'heading':
      formattedText = `\n# ${text || 'Heading'}\n`;
      cursorOffset = text ? 0 : -1;
      break;
    case 'bulletList':
      formattedText = text ? text.split('\n').map(line => `- ${line}`).join('\n') : '- List item';
      cursorOffset = text ? 0 : 0;
      break;
    case 'numberList':
      formattedText = text ? text.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n') : '1. List item';
      cursorOffset = text ? 0 : 0;
      break;
    case 'link':
      formattedText = text ? `[${text}](url)` : '[link text](url)';
      cursorOffset = text ? -1 : -6;
      break;
    case 'image':
      formattedText = `![${text || 'alt text'}](image-url)`;
      cursorOffset = text ? -1 : -11;
      break;
    case 'codeBlock':
      formattedText = `\n\`\`\`\n${text || '// code block'}\n\`\`\`\n`;
      cursorOffset = text ? 0 : -5;
      break;
    case 'mermaid':
      formattedText = `\n\`\`\`mermaid\n${text || 'graph TD\n    A[Start] --> B[End]'}\n\`\`\`\n`;
      cursorOffset = text ? 0 : -5;
      break;
    default:
      return;
  }
  
  // Get current text and insert the formatted text
  const value = textareaRef.value.value;
  const newText = value.substring(0, start) + formattedText + value.substring(end);
  
  // Update the model
  markdownText.value = newText;
  
  // Focus back to textarea and set cursor position after update
  nextTick(() => {
    if (!textareaRef.value) return;
    
    textareaRef.value.focus();
    const newCursorPosition = start + formattedText.length + cursorOffset;
    textareaRef.value.setSelectionRange(newCursorPosition, newCursorPosition);
  });
};
</script>

<style scoped>
.markdown-input {
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.6;
}

/* Pane container and divider styles */
.pane-container {
  display: flex;
  flex-direction: row;
  height: auto; /* Changed from 100% to auto to allow content to define height */
  min-height: 100%;
  position: relative;
}

.editor-container, .preview-container {
  height: auto; /* Changed from 100% to auto to allow content to define height */
  min-height: 100%;
  overflow: visible; /* Changed from hidden to visible to allow content to flow */
  transition: width 0.1s ease;
}

/* Specifically hide scrollbars in the editor container */
.editor-container {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.editor-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}

.divider {
  width: 6px;
  background: rgba(255, 255, 255, 0.05);
  cursor: col-resize;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider:hover, .divider:active {
  background: #041C42; /* Dark blue matching the app bar */
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

.editor-pane,
.preview-pane {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-pane {
  border-left: none;
}

.preview-pane {
  border-left: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

.markdown-content {
  /* Base styling for markdown content */
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
  color: var(--text-color, rgba(255, 255, 255, 0.87));
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  line-height: 1.2;
}

.markdown-content :deep(h1) { font-size: 2.25rem; }
.markdown-content :deep(h2) { font-size: 1.75rem; }
.markdown-content :deep(h3) { font-size: 1.5rem; }
.markdown-content :deep(h4) { font-size: 1.25rem; }
.markdown-content :deep(h5) { font-size: 1.1rem; }
.markdown-content :deep(h6) { font-size: 1rem; }

.markdown-content :deep(p) {
  margin-bottom: 1rem;
}

.markdown-content :deep(a) {
  color: var(--accent-color, #3B82F6);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(blockquote) {
  padding: 0.5rem 1rem;
  border-left: 4px solid var(--accent-color, #3B82F6);
  background-color: var(--blockquote-bg-color, rgba(59, 130, 246, 0.1));
  margin-bottom: 1rem;
}

.markdown-content :deep(pre) {
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: 'Courier New', monospace;
  padding: 0.2rem 0.4rem;
  background-color: var(--code-bg-color, rgba(255, 255, 255, 0.1));
  border-radius: 3px;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.markdown-content :deep(thead) {
  background-color: rgba(255, 255, 255, 0.1);
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  text-align: left;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-content :deep(hr) {
  border: 0;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 1.5rem 0;
}

/* Responsive adjustments */
@media (max-width: 959px) {
  .preview-pane {
    border-left: none !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Fullscreen mode styling */
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

.fullscreen-mode .v-textarea textarea {
  font-size: 1.1rem;
}

.editor-pane {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
}

.markdown-input {
  font-family: 'Courier New', monospace;
  resize: none !important;
  overflow-y: hidden !important; /* Hidden to prevent individual scrollbar */
  padding: 16px !important;
  line-height: 1.6 !important;
  height: 100% !important;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.preview-pane {
  padding: 16px !important;
  height: 100%;
}

.markdown-editor-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Main scroll container styling */
.main-scroll-container {
  height: 100%;
  overflow-y: auto;
  flex: 1;
  position: relative;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Editor and Preview styles */
.editor-pane, .preview-pane {
  height: 100%;
  padding: 16px;
  overflow: hidden;
}

/* Editor pane specific styling - lighter shade of black */
.editor-pane {
  background-color: #1e1e1e !important; /* Lighter black */
}

/* Preview pane specific styling - deep black */
.preview-pane {
  background-color: #0a0a0a !important; /* Deep black */
}

/* Textarea styling */
.markdown-input {
  font-family: 'Courier New', monospace;
  width: 100%;
  height: 100% !important;
  border: none;
  background-color: transparent;
  resize: none;
  padding: 0;
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  overflow: hidden !important;
}

/* Hide scrollbar in the textarea */
.markdown-input::-webkit-scrollbar {
  display: none;
}

textarea.markdown-input {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/* Markdown content area */
.markdown-content {
  padding-bottom: 30vh; /* Add some padding to ensure content can be scrolled fully */
  max-width: 100%; /* Ensure content doesn't overflow horizontally */
  overflow-wrap: break-word; /* Break long words to prevent horizontal overflow */
  word-break: break-word;
}

/* Ensure consistent scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Hide scrollbar for textarea while preserving functionality */
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer and Edge */
}

.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
