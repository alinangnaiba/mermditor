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
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '@/plugins/markdownItMermaid';
import { markdownItHighlight } from '@/plugins/markdownItHighlight';
import { setupMermaid } from '@/plugins/mermaid';
import MermaidRenderer from '@/components/MermaidRenderer.vue';
import { createApp } from 'vue';
import debounce from 'lodash/debounce';
import 'highlight.js/styles/atom-one-dark.css';

// Helper function to check for potential URL-like strings
const isPotentiallyUrlLike = (text: string): boolean => {
  if (!text || text.trim() === '') return false;
  if (/\s/.test(text)) return false; // No spaces allowed in simple domain/URL check for this purpose

  // If it already starts with http:// or https://, consider it URL-like
  if (/^https?:\/\//i.test(text)) {
    return true;
  }

  // Check for a common domain structure like domain.tld or sub.domain.tld
  // This is a simplified check.
  const domainStructureRegex = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainStructureRegex.test(text);
};

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
const isEditorVisible = ref(true); // New state for editor visibility
let isDragging = false;

const previewWidthPercent = computed(() => {
  return isEditorVisible.value ? (100 - editorWidthPercent.value) : 100;
});

const toggleEditorVisibility = () => {
  isEditorVisible.value = !isEditorVisible.value;
  // Optionally, save this preference to localStorage
  localStorage.setItem('mermd-editor-visible', isEditorVisible.value.toString());
  // Trigger resize to adjust layout
  nextTick(() => {
    autoResizeTextarea();
  });
};

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
  
  const savedVisibility = localStorage.getItem('mermd-editor-visible');
  if (savedVisibility !== null) {
    isEditorVisible.value = savedVisibility === 'true';
  }
  
  document.addEventListener('keydown', handleKeyboardShortcut); // Add the event listener
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
  const textarea = textareaRef.value;
  const { selectionStart: start, selectionEnd: end } = textarea;
  const value = textarea.value;
  const selectedText = value.substring(start, end);

  let newTextValue: string = value;
  let newSelectionStart: number = start;
  let newSelectionEnd: number = end;
  let textModified: boolean = false;
  let preventDefault = false;

  switch (key) {
    case 'b': // Bold
      {
        preventDefault = true;
        const prefix = '**';
        const suffix = '**';
        const placeholder = 'bold text';
        
        const isExactlyWrapped = selectedText.startsWith(prefix) &&
                                 selectedText.endsWith(suffix) &&
                                 selectedText.length >= prefix.length + suffix.length;
        const textBeforeSelection = value.substring(0, start);
        const textAfterSelection = value.substring(end);
        const isEffectivelyWrapped = textBeforeSelection.endsWith(prefix) &&
                                     textAfterSelection.startsWith(suffix);

        if (isExactlyWrapped) {
          const unwrappedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
          newTextValue = value.substring(0, start) + unwrappedText + value.substring(end);
          newSelectionStart = start;
          newSelectionEnd = start + unwrappedText.length;
        } else if (isEffectivelyWrapped) {
          const textBeforePrefix = textBeforeSelection.substring(0, textBeforeSelection.length - prefix.length);
          const textAfterSuffix = textAfterSelection.substring(suffix.length);
          newTextValue = textBeforePrefix + selectedText + textAfterSuffix;
          newSelectionStart = start - prefix.length;
          newSelectionEnd = end - prefix.length;
        } else {
          const textToWrap = selectedText || placeholder;
          const wrappedText = `${prefix}${textToWrap}${suffix}`;
          newTextValue = value.substring(0, start) + wrappedText + value.substring(end);
          newSelectionStart = start + prefix.length;
          newSelectionEnd = start + prefix.length + textToWrap.length;
        }
        textModified = true;
      }
      break;
    case 'i': // Italic
      {
        preventDefault = true;
        const prefix = '*';
        const suffix = '*';
        const placeholder = 'italic text';

        const isExactlyWrapped = selectedText.startsWith(prefix) &&
                                 selectedText.endsWith(suffix) &&
                                 selectedText.length >= prefix.length + suffix.length;
        const textBeforeSelection = value.substring(0, start);
        const textAfterSelection = value.substring(end);
        const isEffectivelyWrapped = textBeforeSelection.endsWith(prefix) &&
                                     textAfterSelection.startsWith(suffix);

        if (isExactlyWrapped) {
          const unwrappedText = selectedText.substring(prefix.length, selectedText.length - suffix.length);
          newTextValue = value.substring(0, start) + unwrappedText + value.substring(end);
          newSelectionStart = start;
          newSelectionEnd = start + unwrappedText.length;
        } else if (isEffectivelyWrapped) {
          const textBeforePrefix = textBeforeSelection.substring(0, textBeforeSelection.length - prefix.length);
          const textAfterSuffix = textAfterSelection.substring(suffix.length);
          newTextValue = textBeforePrefix + selectedText + textAfterSuffix;
          newSelectionStart = start - prefix.length;
          newSelectionEnd = end - prefix.length;
        } else {
          const textToWrap = selectedText || placeholder;
          const wrappedText = `${prefix}${textToWrap}${suffix}`;
          newTextValue = value.substring(0, start) + wrappedText + value.substring(end);
          newSelectionStart = start + prefix.length;
          newSelectionEnd = start + prefix.length + textToWrap.length;
        }
        textModified = true;
      }
      break;
    case 'k': // Link
      {
        preventDefault = true;
        const linkTextPlaceholder = 'link text';
        const urlPlaceholder = 'url';
        // Regex to match a full markdown link: [text](url)
        const fullLinkRegex = /^\[(.*?)\]\((.*?)\)$/;
        const selectedAsFullLinkMatch = selectedText.match(fullLinkRegex);

        if (selectedAsFullLinkMatch) {
          const actualLinkText = selectedAsFullLinkMatch[1];
          newTextValue = value.substring(0, start) + actualLinkText + value.substring(end);
          newSelectionStart = start;
          newSelectionEnd = start + actualLinkText.length;
        } else {
          let textToWrap = selectedText || linkTextPlaceholder;
          let finalUrl = urlPlaceholder;

          if (selectedText && selectedText.trim() !== '') {
            if (isPotentiallyUrlLike(selectedText)) {
              textToWrap = selectedText;
              if (/^https?:\/\//i.test(selectedText)) {
                finalUrl = selectedText;
              } else {
                finalUrl = 'http://' + selectedText;
              }
            }
          }

          const wrappedText = `[${textToWrap}](${finalUrl})`;
          newTextValue = value.substring(0, start) + wrappedText + value.substring(end);
          
          newSelectionStart = start;
          newSelectionEnd = start + wrappedText.length;
        }
        textModified = true;
      }
      break;    
    case '1': // Heading 1
      if (e.shiftKey) {
        preventDefault = true;
        const lineStartPos = value.lastIndexOf('\n', start - 1) + 1;
        let actualLineEndPos = value.indexOf('\n', lineStartPos);
        if (actualLineEndPos === -1) {
            actualLineEndPos = value.length;
        }
        const currentLineContent = value.substring(lineStartPos, actualLineEndPos);

        if (currentLineContent.startsWith('# ')) {
          newTextValue = value.substring(0, lineStartPos) + currentLineContent.substring(2) + value.substring(actualLineEndPos);
          newSelectionStart = Math.max(lineStartPos, start - 2);
          newSelectionEnd = Math.max(lineStartPos, end - 2);
        } else {
          newTextValue = value.substring(0, lineStartPos) + '# ' + currentLineContent + value.substring(actualLineEndPos);
          if (start === end && start >= lineStartPos && start <= actualLineEndPos) { // Cursor on the line, no selection
            newSelectionStart = lineStartPos + 2; // Place cursor after '# '
            newSelectionEnd = lineStartPos + 2;
          } else { // Selection exists
            newSelectionStart = start + 2;
            newSelectionEnd = end + 2;
          }
        }
        textModified = true;
      } else {
        return; // Not Ctrl+Shift+1
      }
      break;
    default:
      return; // Exit if no shortcut matched
  }

  if (preventDefault) {
    e.preventDefault();
  }

  if (textModified) {
    markdownText.value = newTextValue;
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.selectionStart = newSelectionStart;
        textareaRef.value.selectionEnd = newSelectionEnd;
        textareaRef.value.focus();
        autoResizeTextarea(); 
      }
    });
  }
};
</script>
