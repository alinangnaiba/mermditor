<template>
  <div class="codemirror-editor-container relative flex h-full w-full flex-col">
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
          <PhTrash :size="18" />
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
          <PhEyeSlash v-if="isPreviewVisible" :size="18" />
          <PhEye v-else :size="18" />
        </button>

        <!-- Hide/Show Editor Button -->
        <button
          :title="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
          class="rounded-md p-2 text-text-tertiary transition-colors hover:bg-surface-quaternary hover:text-text-primary focus:bg-surface-quaternary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          :aria-label="isEditorVisible ? 'Hide Editor' : 'Show Editor'"
          @click="toggleEditorVisibility"
        >
          <PhCode :size="18" />
        </button>
      </div>
    </div>

    <!-- Main pane container with single scroll -->
    <div class="flex min-h-0 flex-1 flex-col">
      <div ref="mainScrollContainer" class="main-scroll-container w-full flex-1 overflow-y-auto">
        <div class="pane-container flex min-h-full w-full flex-row">
          <!-- Editor Pane -->
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
                          @click.stop="openFindPanel(); closeAllMenus();"
                        >
                          <span>Find</span>
                          <span class="text-xs text-text-tertiary">Ctrl+Shift+F</span>
                        </button>
                        <button
                          class="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-quaternary transition-colors flex justify-between items-center"
                          @click.stop="openFindReplacePanel(); closeAllMenus(); "
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
                    class="find-replace-panel absolute top-full left-4 right-4 lg:left-auto lg:right-4 z-50 bg-deep-black/95 backdrop-blur-sm rounded-b-md shadow-xl find-replace-floating"
                    style="max-width: min(90vw, 500px); border-top: none;"
                  >
                    <FindReplacePanel
                      :markdown-text="markdownText"
                      :textarea-ref="codeMirrorRef"
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

              <!-- CodeMirror Editor Container -->
              <div class="relative flex-1">
                <CodeMirror
                  ref="codeMirrorRef"
                  v-model="markdownText"
                  :extensions="editorExtensions"
                  class="w-full h-full"
                  @ready="onEditorReady"
                  @change="onEditorChange"
                />
              </div>
            </div>
          </div>

          <!-- Draggable Divider -->
          <div
            v-if="isEditorVisible && isPreviewVisible"
            class="divider flex w-1.5 cursor-col-resize items-center justify-center bg-surface-tertiary hover:bg-accent-primary"
            title="Drag to resize"
            @mousedown="startDrag"
            @touchstart.prevent="startDrag"
          >
            <div class="divider-handle h-9 w-0.5 rounded bg-text-tertiary"/>
          </div>

          <!-- Preview Pane -->
          <div
            v-show="isPreviewVisible"
            class="preview-container transition-width relative flex flex-col duration-100"
            :style="{ width: previewWidthPercent + '%' }"
          >
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
import { CodeMirror } from 'vue-codemirror6';
import { EditorView } from '@codemirror/view';
import { PhTrash, PhEye, PhEyeSlash, PhCode } from '@phosphor-icons/vue';
import 'highlight.js/styles/atom-one-dark.css';
import { useFileOperations } from '~/composables/utils/file-operations';
import { useDataManagement } from '~/composables/utils/data-management';
import { useConfirmDialog } from '~/composables/utils/confirm-dialog';
import { useCodeMirrorExtensions } from '~/composables/useCodeMirrorExtensions';
import ConfirmationDialog from './ConfirmationDialog.vue';
import FindReplacePanel from './FindReplacePanel.vue';

const props = defineProps({
  initialMarkdown: {
    type: String,
    default: '',
  },
});

const codeMirrorRef = ref<any>(null);
const previewPane = ref<HTMLElement | null>(null);
const mainScrollContainer = ref<HTMLElement | null>(null);
const previewContainer = ref<HTMLElement | null>(null);

const defaultContent = `# Markdown Editor with Mermaid (CodeMirror 6)

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
    () => Promise.resolve(), // CodeMirror handles resizing automatically
    confirmDialog.showConfirmation
  );

const { editorWidthPercent, previewWidthPercent, startDrag } = usePaneResizer(
  mainScrollContainer,
  isEditorVisible,
  isPreviewVisible
);

const { renderMarkdown, cleanupMarkdownRenderer } = useMarkdownRenderer(
  markdownText,
  previewContainer,
  () => Promise.resolve() // CodeMirror handles resizing automatically
);

const { success, error } = useToast();

const { clearAllData } = useDataManagement();

const { saveFile, importFile } = useFileOperations({
  markdownText,
  onImportSuccess: async (filename: string) => {
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

// Setup CodeMirror extensions with our custom composable
const { createExtensions } = useCodeMirrorExtensions(
  markdownText,
  codeMirrorRef,
  () => Promise.resolve(), // CodeMirror handles resizing automatically
  { saveFile, importFile },
  { openFindPanel, openFindReplacePanel }
);

// CodeMirror extensions
const editorExtensions = computed(() => createExtensions());

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

const handleHighlight = (matches: Array<{ start: number; end: number }>, currentIndex: number) => {
  // CodeMirror search will handle highlighting
};

const clearHighlight = () => {
  // CodeMirror search will handle clearing highlights
};

const toggleFileMenu = () => {
  editMenuOpen.value = false;
  fileMenuOpen.value = !fileMenuOpen.value;
};

const toggleEditMenu = () => {
  fileMenuOpen.value = false;
  editMenuOpen.value = !editMenuOpen.value;
};

const onEditorReady = (view: EditorView) => {
  console.log('CodeMirror editor ready:', view);
};

const onEditorChange = (value: string, view: EditorView) => {
  // Handle editor changes if needed
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
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    const editorToolbar = document.querySelector('.editor-toolbar');

    if (editorToolbar && !editorToolbar.contains(target)) {
      closeAllMenus();
    }
  });

  // Signal that the editor component is ready
  try {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.$loading?.setResourceLoaded) {
      nuxtApp.$loading.setResourceLoaded('markdownIt');
    }
  } catch (err) {
    console.error('Error updating loading state:', err);
  }
});

onBeforeUnmount(() => {
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

/* Ensure find panel floats properly */
.find-replace-floating {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 0 0 8px 8px;
}
</style>