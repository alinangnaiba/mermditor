<template>  <div class="markdown-editor-container relative flex h-full w-full flex-col">
    <!-- Floating Action Bar - Above all panes -->
    <div class="relative z-30 flex justify-center py-2">
      <div class="flex items-center space-x-1 rounded-lg bg-surface-tertiary/95 shadow-lg backdrop-blur-sm border border-border-primary">
        <!-- Autosave Checkbox -->
        <label class="flex items-center space-x-2 px-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="isAutosaveEnabled"
            class="w-4 h-4 text-accent-primary bg-surface-quaternary border-border-primary rounded focus:ring-accent-primary focus:ring-2"
            @change="handleAutosaveToggle"
          >
          <span class="text-sm text-text-secondary">Autosave</span>
        </label>

        <!-- Clear Data Button -->
        <button
          title="Clear all stored data"
          class="rounded-md p-2 text-text-tertiary transition-colors hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Clear all stored data"
          @click="clearData"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
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
            <div class="editor-pane border-r border-border-primary bg-deep-black flex flex-col">
              <!-- Sticky Header Area (Toolbar Only) -->
              <div class="sticky top-0 z-40 bg-deep-black/95 backdrop-blur-sm border-b border-border-primary/50">
                <!-- Editor Toolbar -->
                <div class="editor-toolbar flex items-center space-x-4 px-4 py-2">
                  <!-- File Menu -->
                  <div class="relative">
                    <button
                      class="text-sm text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1"
                      @click="toggleFileMenu"
                    >
                      File
                    </button>
                    <!-- File Dropdown -->
                    <div
                      v-if="fileMenuOpen"
                      class="absolute top-full left-0 mt-1 w-48 bg-deep-black border border-border-primary rounded-md shadow-lg z-50"
                    >
                      <div class="py-1">
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors"
                          @click="importFile(); closeAllMenus()"
                        >
                          Import
                        </button>
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors flex justify-between items-center"
                          @click="saveFile(); closeAllMenus()"
                        >
                          <span>Save</span>
                          <span class="text-xs text-text-tertiary">Ctrl+S</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Edit Menu -->
                  <div class="relative">
                    <button
                      class="text-sm text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary rounded px-2 py-1"
                      @click="toggleEditMenu"
                    >
                      Edit
                    </button>
                    <!-- Edit Dropdown -->
                    <div
                      v-if="editMenuOpen"
                      class="absolute top-full left-0 mt-1 w-40 bg-deep-black border border-border-primary rounded-md shadow-lg z-50"
                    >
                      <div class="py-1">
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors flex justify-between items-center"
                          @click="openFindPanel(); closeAllMenus()"
                        >
                          <span>Find</span>
                          <span class="text-xs text-text-tertiary">Ctrl+Shift+F</span>
                        </button>
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors flex justify-between items-center"
                          @click="openFindReplacePanel(); closeAllMenus()"
                        >
                          <span>Find & Replace</span>
                          <span class="text-xs text-text-tertiary">Ctrl+H</span>
                        </button>
                        <div class="h-px bg-border-secondary mx-2 my-1"/>
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors"
                          @click="copyEditorContent(); closeAllMenus()"
                        >
                          Copy
                        </button>
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors"
                          @click="clearContent(); closeAllMenus()"
                        >
                          Clear Content
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Find/Replace Panel - Floating over content -->
                <Transition name="slide-down">
                  <div 
                    v-if="findPanelVisible" 
                    class="find-replace-panel absolute top-full right-4 z-50 bg-deep-black/95 backdrop-blur-sm border border-border-primary rounded-b-md shadow-xl find-replace-floating"
                    style="min-width: 320px;"
                  >
                    <FindReplacePanel
                      :markdown-text="markdownText"
                      :textarea-ref="textareaRef"
                      :scroll-container="mainScrollContainer"
                      :initial-replace-mode="findPanelReplaceMode"
                      @close="closeFindPanel"
                      @highlight="handleHighlight"
                      @clear-highlight="clearHighlight"
                      @replace="handleReplace"
                    />
                  </div>
                </Transition>
              </div>

              <!-- Editor Container with Highlighting -->
              <div class="relative flex-1">
                <!-- Highlighting Background -->
                <div
                  v-if="highlightMatches.length > 0"
                  ref="highlightLayerRef"
                  class="absolute inset-0 pointer-events-none z-10 font-mono text-sm leading-relaxed"
                  style="padding: 1rem; white-space: pre-wrap; word-wrap: break-word;"
                >
                  <span
                    v-for="(segment, index) in highlightedSegments"
                    :key="index"
                    :class="segment.isMatch ? (segment.isCurrent ? 'bg-yellow-400 text-black' : 'bg-yellow-200 text-black') : ''"
                    class="whitespace-pre-wrap"
                  >{{ segment.text }}</span>
                </div>

                <!-- Editor Textarea -->
                <textarea
                  ref="textareaRef"
                  v-model="markdownText"
                  class="no-scrollbar w-full h-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-text-primary placeholder-text-tertiary outline-none relative z-20"
                  :class="{ 'text-transparent-with-cursor': highlightMatches.length > 0 }"
                  placeholder="Type your markdown here..."
                  @input="autoResizeTextarea"
                />
              </div>
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
        <span v-if="isAutosaveEnabled">
          <span v-if="lastSaved">Last saved: {{ lastSaved }}</span>
          <span v-else>Autosave enabled</span>
        </span>
        <span v-else>Autosave disabled</span>
      </div>
    </div>

    <!-- Modern Confirmation Dialog -->
    <ConfirmationDialog
      :is-visible="confirmDialog.isVisible.value"
      :title="confirmDialog.currentOptions.value.title"
      :message="confirmDialog.currentOptions.value.message"
      :confirm-text="confirmDialog.currentOptions.value.confirmText"
      :cancel-text="confirmDialog.currentOptions.value.cancelText"
      :type="confirmDialog.currentOptions.value.type"
      @confirm="confirmDialog.handleConfirm"
      @cancel="confirmDialog.handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, toRef } from 'vue';
import 'highlight.js/styles/atom-one-dark.css';
import { useFileOperations } from '~/composables/utils/file-operations';
import { useDataManagement } from '~/composables/utils/data-management';
import { useConfirmDialog } from '~/composables/utils/confirm-dialog';
import ConfirmationDialog from './ConfirmationDialog.vue';
import FindReplacePanel from './FindReplacePanel.vue';
// Other composables are auto-imported in Nuxt

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

const confirmDialog = useConfirmDialog();

const { markdownText, isEditorVisible, isPreviewVisible, lastSaved, isAutosaveEnabled, toggleEditorVisibility, togglePreviewVisibility, toggleAutosave } =
  useEditorStateAndPersistence(
    toRef(props, 'initialMarkdown'),
    defaultContent,
    () => autoResizeTextarea(),
    confirmDialog.showConfirmation
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

const { renderMarkdown, cleanupMarkdownRenderer } = useMarkdownRenderer(
  markdownText,
  previewContainer,
  autoResizeTextarea
);

const { success, error } = useToast();

const { clearAllData } = useDataManagement();

const { saveFile, importFile } = useFileOperations({
  markdownText,
  onImportSuccess: async (filename: string) => {
    await autoResizeTextarea();
    if (isPreviewVisible.value) {
      await renderMarkdown();
    }
    success(`File "${filename}" imported successfully!`);
  },
  onSaveSuccess: () => {
    success('File saved successfully!');
  },
  onError: (message: string) => {
    error(message);
  }
});

// Custom toggle function that pre-renders before showing preview
const customTogglePreviewVisibility = async () => {
  if (isPreviewVisible.value) {
    togglePreviewVisibility();
  } else {
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
  } catch {
    error('Failed to copy content');
  }
};

const clearContent = () => {
  markdownText.value = '';
  success('Editor content cleared');
};

const clearData = async () => {
  const confirmed = await confirmDialog.showConfirmation({
    title: 'Clear All Data',
    message: 'This will delete all your saved content and settings. This action cannot be undone.',
    confirmText: 'Clear Data',
    cancelText: 'Cancel'
  });

  if (confirmed) {
    const result = clearAllData();
    if (result) {
      markdownText.value = defaultContent;
      isAutosaveEnabled.value = false;
    }
  }
};

const handleAutosaveToggle = async (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  event.preventDefault();
  
  const success = await toggleAutosave();
  
  if (!success) {
    checkbox.checked = isAutosaveEnabled.value;
  }
};

const fileMenuOpen = ref(false);
const editMenuOpen = ref(false);
const findPanelVisible = ref(false);
const findPanelReplaceMode = ref(false);

const closeAllMenus = () => {
  fileMenuOpen.value = false;
  editMenuOpen.value = false;
};

const openFindPanel = () => {
  findPanelReplaceMode.value = false;
  findPanelVisible.value = true;
};

const openFindReplacePanel = () => {
  findPanelReplaceMode.value = true;
  findPanelVisible.value = true;
};

const closeFindPanel = () => {
  findPanelVisible.value = false;
  findPanelReplaceMode.value = false;
};

const handleReplace = (newText: string) => {
  markdownText.value = newText;
};

const highlightMatches = ref<Array<{ start: number; end: number }>>([]);
const currentHighlightIndex = ref(0);
const highlightLayerRef = ref<HTMLElement | null>(null);

const handleHighlight = (matches: Array<{ start: number; end: number }>, currentIndex: number) => {
  highlightMatches.value = matches;
  currentHighlightIndex.value = currentIndex;
};

const clearHighlight = () => {
  highlightMatches.value = [];
  currentHighlightIndex.value = 0;
};

const highlightedSegments = computed(() => {
  if (highlightMatches.value.length === 0) return [];
  
  const text = markdownText.value;
  const segments: Array<{ text: string; isMatch: boolean; isCurrent: boolean }> = [];
  let lastIndex = 0;
  
  highlightMatches.value.forEach((match, index) => {
    if (match.start > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.start),
        isMatch: false,
        isCurrent: false
      });
    }
    
    segments.push({
      text: text.substring(match.start, match.end),
      isMatch: true,
      isCurrent: index === currentHighlightIndex.value
    });
    
    lastIndex = match.end;
  });
  
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isMatch: false,
      isCurrent: false
    });
  }
  
  return segments;
});

const { handleKeyboardShortcut } = useKeyboardShortcuts(
  markdownText,
  textareaRef,
  autoResizeTextarea,
  { saveFile, importFile },
  { openFindPanel, openFindReplacePanel }
);

const toggleFileMenu = () => {
  editMenuOpen.value = false;
  fileMenuOpen.value = !fileMenuOpen.value;
};

const toggleEditMenu = () => {
  fileMenuOpen.value = false;
  editMenuOpen.value = !editMenuOpen.value;
};

watch(
  markdownText,
  () => {
    if (isPreviewVisible.value) {
      renderMarkdown();
    }
  },
  { immediate: true }
);

onMounted(async () => {
  document.addEventListener('keydown', handleKeyboardShortcut);
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    const editorToolbar = document.querySelector('.editor-toolbar');
    const findPanel = document.querySelector('.find-replace-panel');
    
    if (editorToolbar && !editorToolbar.contains(target)) {
      closeAllMenus();
    }
    
    // Close find panel when clicking outside
    if (findPanelVisible.value && findPanel && !findPanel.contains(target) && !editorToolbar?.contains(target)) {
      closeFindPanel();
    }
  });
  autoResizeTextarea();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut);
  cleanupMarkdownRenderer();
});

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

const characterCount = computed(() => {
  return markdownText.value.length;
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.text-transparent-with-cursor {
  color: transparent;
  caret-color: #ffffff;
}

.text-transparent-with-cursor:focus {
  color: transparent;
  caret-color: #ffffff;
}

/* Ensure find panel floats properly */
.find-replace-floating {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 0 0 8px 8px;
}
</style>
