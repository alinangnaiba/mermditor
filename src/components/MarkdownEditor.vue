<template>
  <v-container fluid class="pa-0 markdown-editor-container" style="min-height: 100%">
    <v-row no-gutters class="fill-height">      <!-- Editor Pane -->      <v-col cols="12" md="6" class="fill-height d-flex flex-column">
        <v-sheet class="fill-height pa-2 d-flex flex-column editor-pane" color="surface-variant" rounded="0">          <v-toolbar density="compact" color="surface-variant" class="mb-2">
            <v-tooltip location="bottom" text="New Document">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="clearDocument">
                  <v-icon>mdi-file-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-divider vertical class="mx-2" />
            
            <v-tooltip location="bottom" text="Bold">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('bold', getSelectionData())">
                  <v-icon>mdi-format-bold</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip location="bottom" text="Italic">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('italic', getSelectionData())">
                  <v-icon>mdi-format-italic</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip location="bottom" text="Heading">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('heading', getSelectionData())">
                  <v-icon>mdi-format-header-1</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-divider vertical class="mx-2" />
              <v-tooltip location="bottom" text="Bulleted List">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('bulletList', getSelectionData())">
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip location="bottom" text="Numbered List">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('numberList', getSelectionData())">
                  <v-icon>mdi-format-list-numbered</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-divider vertical class="mx-2" />
            
            <v-tooltip location="bottom" text="Link">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('link', getSelectionData())">
                  <v-icon>mdi-link</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip location="bottom" text="Image">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('image', getSelectionData())">
                  <v-icon>mdi-image</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip location="bottom" text="Code Block">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('codeBlock', getSelectionData())">
                  <v-icon>mdi-code-tags</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
              <v-tooltip location="bottom" text="Mermaid Diagram">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="handleFormat('mermaid', getSelectionData())">
                  <v-icon>mdi-chart-timeline-variant</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            
            <v-spacer></v-spacer>
            
            <v-tooltip location="bottom" :text="fullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
              <template #activator="{ props }">
                <v-btn v-bind="props" icon @click="toggleFullscreen">
                  <v-icon>{{ fullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-toolbar>          <v-textarea
            v-model="markdownText"
            class="markdown-input flex-grow-1"
            hide-details
            variant="outlined"
            color="primary"
            bg-color="surface"
            placeholder="Type your markdown here..."
            no-resize
            auto-grow
            row-height="18"
            :rows="20"
            ref="textareaRef"
            @scroll="handleEditorScroll"
          ></v-textarea>
        </v-sheet>
      </v-col>      <!-- Preview Pane -->
      <v-col cols="12" md="6" class="fill-height d-flex flex-column">
        <v-sheet class="fill-height preview-pane pa-4 overflow-auto" color="background" rounded="0" ref="previewPane" @scroll="handlePreviewScroll">
          <div ref="previewContainer" class="markdown-content"></div>
        </v-sheet>
      </v-col>
    </v-row>
    
    <!-- Responsive button for mobile view -->
    <v-btn
      class="toggle-view-btn d-md-none"
      icon
      fab
      fixed
      bottom
      right
      color="primary"
      @click="toggleMobileView"
    >
      <v-icon>{{ showPreview ? 'mdi-pencil' : 'mdi-eye' }}</v-icon>
    </v-btn>
      <!-- Footer with buttons -->
    <v-footer app absolute class="px-4 py-2" color="surface-variant">
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="showHelp = true"
      >
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
        <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            variant="text"
            color="primary"
            v-bind="props"
          >
            <v-icon>mdi-export-variant</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="exportAsMarkdown">
            <v-list-item-title>Export as Markdown</v-list-item-title>
          </v-list-item>
          <v-list-item @click="exportAsHTML">
            <v-list-item-title>Export as HTML</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <!-- Import button -->
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="importFile"
      >
        <v-icon>mdi-file-import</v-icon>
        <input
          type="file"
          ref="fileInput"
          accept=".md, .markdown, .txt"
          style="display: none"
          @change="handleFileImport"
        />
      </v-btn>
      
      <!-- Print button -->
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="printPreview"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>
      
      <v-btn
        icon
        variant="text"
        color="primary"
        @click="showSettings = true"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      
      <v-spacer></v-spacer>      <div class="d-flex align-center me-4">
        <small class="text-caption">
          {{ wordCount }} words | {{ characterCount }} characters
          <span v-if="editorSettings.autoSave" class="ms-2">(Auto-save on)</span>
        </small>
      </div>
      <v-btn
        variant="elevated"
        color="primary"
        prepend-icon="mdi-content-save"
        @click="saveToLocalStorage"
      >
        Save
      </v-btn>
    </v-footer>
      <!-- Toast notification -->
    <v-snackbar
      v-model="showToast"
      :color="toastColor"
      :timeout="3000"
      location="top"
    >
      {{ toastMessage }}
      <template #actions>
        <v-btn
          variant="text"
          @click="showToast = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
      <!-- Help dialog -->
    <v-dialog v-model="showHelp" max-width="500">
      <v-card>
        <v-card-title class="text-h5 pb-2">
          Keyboard Shortcuts
        </v-card-title>
        <v-card-text>
          <v-list density="compact" bg-color="transparent">
            <v-list-item>
              <v-list-item-title>Bold</v-list-item-title>
              <v-list-item-subtitle>Ctrl+B</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Italic</v-list-item-title>
              <v-list-item-subtitle>Ctrl+I</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Link</v-list-item-title>
              <v-list-item-subtitle>Ctrl+K</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Heading</v-list-item-title>
              <v-list-item-subtitle>Ctrl+Shift+1</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Save</v-list-item-title>
              <v-list-item-subtitle>Ctrl+S</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="showHelp = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    <!-- Settings dialog using the component -->
    <SettingsDialog
      :model-value="showSettings"
      @update:model-value="showSettings = $event"
      :initial-settings="editorSettings"
      @save="handleSettingsSave"
    />
    
    <!-- Confirmation dialog -->
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pb-1">
          {{ confirmDialogTitle }}
        </v-card-title>
        <v-card-text>
          {{ confirmDialogMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cancelConfirmAction">Cancel</v-btn>
          <v-btn color="error" @click="confirmAction">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '@/plugins/markdownItMermaid';
import { markdownItHighlight } from '@/plugins/markdownItHighlight';
import { setupMermaid } from '@/plugins/mermaid';
import MermaidRenderer from '@/components/MermaidRenderer.vue';
import SettingsDialog from '@/components/SettingsDialog.vue';
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
const debouncedRenderMarkdown = debounce(renderMarkdown, 500);

// For notifications
const showToast = ref(false);
const toastMessage = ref('');
const toastColor = ref('success');

// For help dialog
const showHelp = ref(false);

// For mobile view toggle
const showPreview = ref(false);

// For confirmation dialog
const showConfirmDialog = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const confirmCallback = ref<(() => void) | null>(null);

// For fullscreen mode
const fullscreen = ref(false);

// For settings dialog
const showSettings = ref(false);
const editorSettings = ref({
  fontSize: 16,
  theme: 'dark',
  autoSave: false
});

// File input reference
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * Open file picker dialog
 */
const importFile = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * Handle file import when user selects a file
 */
const handleFileImport = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
  
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      markdownText.value = reader.result;
      
      // Show success notification
      toastMessage.value = `Imported "${file.name}" successfully!`;
      toastColor.value = 'success';
      showToast.value = true;
    }
  };
  
  reader.onerror = () => {
    toastMessage.value = 'Error reading file';
    toastColor.value = 'error';
    showToast.value = true;
  };
  
  reader.readAsText(file);
  
  // Reset the input so the same file can be selected again
  input.value = '';
};

/**
 * Print the current markdown preview
 */
const printPreview = () => {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toastMessage.value = 'Popup blocked! Please allow popups and try again.';
    toastColor.value = 'warning';
    showToast.value = true;
    return;
  }
  
  // Get rendered HTML
  const html = md.render(markdownText.value || '');
  
  // Create a full HTML document for printing
  const printContent = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <title>Print Preview</title>',
    '  <meta charset="utf-8">',
    '  <style>',
    '    body {',
    '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
    '      line-height: 1.6;',
    '      margin: 2cm;',
    '      color: #000;',
    '    }',
    '    pre { white-space: pre-wrap; }',
    '    code { font-family: monospace; }',
    '    h1, h2, h3, h4 { margin-top: 1em; }',
    '    img { max-width: 100%; }',
    '    a { color: #0366d6; }',
    '    blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #666; }',
    '    @media print {',
    '      a { text-decoration: none; color: #000; }',
    '      @page { margin: 2cm; }',
    '    }',
    '  </style>',
    '  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script>',
    '  <script>',
    '    document.addEventListener("DOMContentLoaded", function() {',
    '      mermaid.initialize({ theme: "default" });',
    '      mermaid.init(undefined, document.querySelectorAll(".mermaid"));',
    '      setTimeout(() => { window.print(); }, 1000);',
    '    });',
    '  <\/script>',
    '</head>',
    '<body>',
    html,
    '</body>',
    '</html>'
  ].join('\n');
  
  // Write the HTML to the new window and trigger print
  printWindow.document.write(printContent);
  printWindow.document.close();
};

/**
 * Handle settings saved from the SettingsDialog component
 */
const handleSettingsSave = (newSettings: {fontSize: number; theme: string; autoSave: boolean}) => {
  // Update the editor settings
  editorSettings.value = { ...newSettings };
  
  // Apply settings and save them
  applyAndSaveSettings();
};

/**
 * Apply editor settings and save them to localStorage
 */
const applyAndSaveSettings = () => {
  // Apply font size to editor
  if (textareaRef.value) {
    textareaRef.value.style.fontSize = `${editorSettings.value.fontSize}px`;
  }
  
  // Apply to preview container
  if (previewContainer.value) {
    previewContainer.value.style.fontSize = `${editorSettings.value.fontSize * 0.9}px`;
  }
  
  // Save settings to localStorage
  try {
    localStorage.setItem('mdit-settings', JSON.stringify(editorSettings.value));
    
    toastMessage.value = 'Settings saved successfully!';
    toastColor.value = 'success';
    showToast.value = true;
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
  
  // Setup auto-save interval if enabled
  if (editorSettings.value.autoSave && !autoSaveInterval.value) {
    autoSaveInterval.value = window.setInterval(saveToLocalStorage, 30000); // Auto-save every 30 seconds
  } else if (!editorSettings.value.autoSave && autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value);
    autoSaveInterval.value = null;
  }
  
  // Apply theme if it changed
  applyTheme();
};

/**
 * Apply theme based on settings
 */
const applyTheme = () => {
  const htmlEl = document.documentElement;
  
  if (editorSettings.value.theme === 'light') {
    htmlEl.classList.add('light-theme');
  } else {
    htmlEl.classList.remove('light-theme');
  }
};

/**
 * Load editor settings from localStorage
 */
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('mdit-settings');
    if (savedSettings) {
      editorSettings.value = { ...editorSettings.value, ...JSON.parse(savedSettings) };
      
      // Apply font size immediately
      if (textareaRef.value) {
        textareaRef.value.style.fontSize = `${editorSettings.value.fontSize}px`;
      }
      
      // Apply to preview container
      if (previewContainer.value) {
        previewContainer.value.style.fontSize = `${editorSettings.value.fontSize * 0.9}px`;
      }
      
      // Setup auto-save if enabled
      if (editorSettings.value.autoSave) {
        autoSaveInterval.value = window.setInterval(saveToLocalStorage, 30000);
      }
      
      // Apply theme
      applyTheme();
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
};

// Auto-save interval reference
const autoSaveInterval = ref<number | null>(null);

/**
 * Save markdown content to localStorage
 */
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('mdit-content', markdownText.value);
    // Show snackbar notification
    toastMessage.value = 'Content saved successfully!';
    toastColor.value = 'success';
    showToast.value = true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    toastMessage.value = 'Failed to save content';
    toastColor.value = 'error';
    showToast.value = true;
  }
};

/**
 * Load markdown content from localStorage
 */
const loadFromLocalStorage = () => {
  try {
    const savedContent = localStorage.getItem('mdit-content');
    if (savedContent) {
      markdownText.value = savedContent;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
};

/**
 * Toggle between edit and preview modes on mobile
 */
const toggleMobileView = () => {
  showPreview.value = !showPreview.value;
  // Apply CSS classes to hide/show panels in mobile view
  const editorPane = document.querySelector('.editor-pane');
  const previewPane = document.querySelector('.preview-pane');
  
  if (editorPane && previewPane) {
    if (showPreview.value) {
      editorPane.classList.add('d-none', 'd-md-flex');
      previewPane.classList.remove('d-none', 'd-md-flex');
    } else {
      previewPane.classList.add('d-none', 'd-md-flex');
      editorPane.classList.remove('d-none', 'd-md-flex');
    }
  }
};

/**
 * Toggle fullscreen mode for the editor
 */
const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
  
  const container = document.querySelector('.markdown-editor-container');
  if (!container) return;
  
  if (fullscreen.value) {
    container.classList.add('fullscreen-mode');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  } else {
    container.classList.remove('fullscreen-mode');
    document.body.style.overflow = ''; // Restore scrolling
  }
};

/**
 * Clear the document after confirmation
 */
const clearDocument = () => {
  if (!markdownText.value || markdownText.value.trim() === '') {
    // If the document is already empty, no need for confirmation
    resetDocument();
    return;
  }
  
  showConfirm(
    'Clear Document',
    'Are you sure you want to clear the current document? This action cannot be undone.',
    resetDocument
  );
};

/**
 * Reset the document to empty or template
 */
const resetDocument = () => {
  markdownText.value = '# New Document\n\n';
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
  
  toastMessage.value = 'Document cleared';
  toastColor.value = 'info';
  showToast.value = true;
};

/**
 * Export the current Markdown content as a .md file
 */
const exportAsMarkdown = () => {
  const fileName = 'document.md';
  const content = markdownText.value;
  
  // Create a blob with the markdown content
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  
  // Create a download link and trigger it
  downloadFile(blob, fileName);
  
  // Show success notification
  toastMessage.value = 'Markdown file exported successfully!';
  toastColor.value = 'success';
  showToast.value = true;
};

/**
 * Export the current content as an HTML file
 */
const exportAsHTML = () => {
  // Get the rendered HTML
  const html = md.render(markdownText.value || '');
    // Create a full HTML document with template literals - need to escape this for Vue's template parser
  const fullHTML = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>Exported Markdown</title>',
    '  <style>',
    '    body {',
    '      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif;',
    '      line-height: 1.6;',
    '      max-width: 800px;',
    '      margin: 0 auto;',
    '      padding: 20px;',
    '    }',
    '    pre {',
    '      background-color: #f5f5f5;',
    '      padding: 15px;',
    '      border-radius: 4px;',
    '      overflow-x: auto;',
    '    }',
    '    code {',
    '      font-family: Menlo, Monaco, Consolas, "Courier New", monospace;',
    '    }',
    '    blockquote {',
    '      border-left: 4px solid #ccc;',
    '      padding-left: 15px;',
    '      margin-left: 0;',
    '      color: #555;',
    '    }',
    '    img {',
    '      max-width: 100%;',
    '    }',
    '    table {',
    '      border-collapse: collapse;',
    '      width: 100%;',
    '    }',
    '    th, td {',
    '      border: 1px solid #ddd;',
    '      padding: 8px;',
    '    }',
    '    th {',
    '      background-color: #f2f2f2;',
    '    }',
    '  </style>',
    '  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script>',
    '  <script>',
    '    document.addEventListener("DOMContentLoaded", function() {',
    '      mermaid.initialize({ theme: "default" });',
    '      mermaid.init(undefined, document.querySelectorAll(".mermaid"));',
    '    });',
    '  <\/script>',
    '</head>',
    '<body>',
    html,
    '</body>',
    '</html>'
  ].join('\n');

  // Create a blob with the HTML content
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  
  // Create a download link and trigger it
  downloadFile(blob, 'document.html');
  
  // Show success notification
  toastMessage.value = 'HTML file exported successfully!';
  toastColor.value = 'success';
  showToast.value = true;
};

/**
 * Helper function to download a file
 */
const downloadFile = (blob: Blob, fileName: string) => {
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to the document, click and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

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
    case 's': // Save
      e.preventDefault();
      saveToLocalStorage();
      break;
    default:
      break;
  }
};

// Initialize mermaid and render markdown when component is mounted
onMounted(() => {
  setupMermaid();
  loadSettings();  // Load settings first
  loadFromLocalStorage();
  renderMarkdown();
  
  // Add keyboard shortcut listener
  document.addEventListener('keydown', handleKeyboardShortcut);
  
  // Add before unload event to warn user about unsaved changes
  window.addEventListener('beforeunload', beforeUnloadHandler);
});

// Remove event listeners on component unmount
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut);
  window.removeEventListener('beforeunload', beforeUnloadHandler);
  
  // Clear auto-save interval if set
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value);
  }
  
  // Exit fullscreen mode if active
  if (fullscreen.value) {
    document.body.style.overflow = '';
    fullscreen.value = false;
  }
});

// Handle before unload event to warn about unsaved changes
const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
  // Check if there's unsaved content
  const savedContent = localStorage.getItem('mdit-content');
  if (savedContent !== markdownText.value) {
    // Standard way to show confirmation dialog before leaving page
    e.preventDefault();
    e.returnValue = '';
  }
};

// Watch for changes in markdown text and re-render
watch(() => markdownText.value, () => {
  debouncedRenderMarkdown();
});

/**
 * Show a confirmation dialog with the given title, message, and action
 */
const showConfirm = (title: string, message: string, action: () => void) => {
  confirmDialogTitle.value = title;
  confirmDialogMessage.value = message;
  confirmCallback.value = action;
  showConfirmDialog.value = true;
};

/**
 * Cancel the confirmation dialog
 */
const cancelConfirmAction = () => {
  showConfirmDialog.value = false;
  confirmCallback.value = null;
};

/**
 * Confirm and execute the action
 */
const confirmAction = () => {
  showConfirmDialog.value = false;
  if (confirmCallback.value) {
    confirmCallback.value();
  }
  confirmCallback.value = null;
};

// Reference to the textarea element
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Word count computation
const wordCount = computed(() => {
  if (!markdownText.value) return 0;
  // Clean the text by removing special Markdown syntax
  const cleanText = markdownText.value
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with just their text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // Remove images
    .replace(/[#*_~`]/g, ''); // Remove markdown symbols
  
  // Count words by splitting on whitespace and filtering out empty strings
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
 * Get the current selection data from the textarea
 */
const getSelectionData = () => {
  if (!textareaRef.value) return { start: 0, end: 0, text: '' };
  
  const start = textareaRef.value.selectionStart;
  const end = textareaRef.value.selectionEnd;
  const selectedText = textareaRef.value.value.substring(start, end);
  
  return { start, end, text: selectedText };
};

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

/**
 * Handle scroll synchronization between editor and preview panes
 */
const handleEditorScroll = () => {
  if (!textareaRef.value || !previewPane.value) return;
  
  const editorScrollTop = textareaRef.value.scrollTop;
  const editorScrollHeight = textareaRef.value.scrollHeight - textareaRef.value.clientHeight;
  const scrollRatio = editorScrollTop / editorScrollHeight;
  
  previewPane.value.scrollTop = scrollRatio * (previewPane.value.scrollHeight - previewPane.value.clientHeight);
};

const handlePreviewScroll = () => {
  if (!textareaRef.value || !previewPane.value) return;
  
  const previewScrollTop = previewPane.value.scrollTop;
  const previewScrollHeight = previewPane.value.scrollHeight - previewPane.value.clientHeight;
  const scrollRatio = previewScrollTop / previewScrollHeight;
  
  textareaRef.value.scrollTop = scrollRatio * (textareaRef.value.scrollHeight - textareaRef.value.clientHeight);
};
</script>

<style scoped>
.markdown-input {
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.6;
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
  color: var(--accent-color, #41B883);
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
  border-left: 4px solid var(--accent-color, #41B883);
  background-color: var(--blockquote-bg-color, rgba(65, 184, 131, 0.1));
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

/* Mobile toggle button */
.toggle-view-btn {
  margin: 16px;
  z-index: 10;
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
</style>
