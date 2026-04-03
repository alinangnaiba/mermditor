<template>
  <!-- App Shell -->
  <div class="relative flex h-screen flex-col overflow-hidden">
    <!-- Loading Overlay (non-blocking DOM) -->
    <LoadingScreen
      :show="isLoading"
      :step="loadingStep"
      class="absolute inset-0 z-50"
      @loading-complete="onLoadingComplete"
    />

    <!-- Header -->
    <header class="editor-header">
      <!-- Logo -->
      <NuxtLink to="/" class="editor-logo">
        <img src="../assets/images/logo.png" alt="merMDitor Logo" />
        merMDitor
      </NuxtLink>

      <!-- Separator -->
      <div class="editor-header-sep" />

      <!-- File chip -->
      <div class="editor-file-chip">
        <span class="editor-file-dot" :class="{ saved: autosave && lastSaved }" />
        {{ currentFilename }}
      </div>

      <!-- Spacer -->
      <div class="editor-header-spacer" />

      <!-- Nav -->
      <nav class="editor-header-nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/guide">Guide</NuxtLink>
        <NuxtLink to="/feedback">Feedback</NuxtLink>
      </nav>
    </header>

    <!-- Toolbar -->
    <EditorToolbar
      :actions="actions"
      :autosave="autosave"
      :show-preview="showPreview"
      :show-editor="showEditor"
      @toggle-preview="togglePreview"
      @toggle-editor="toggleEditor"
      @update:autosave="onAutosaveToggle($event)"
      @clear-storage="onClearStorageClick"
    />

    <!-- Editor Area -->
    <div class="flex flex-1 flex-col overflow-hidden sm:flex-row">
      <!-- Editor Pane -->
      <div
        v-show="showEditor"
        :class="showPreview && !isMobile ? 'sm:w-1/2' : 'w-full'"
        class="editor-pane flex flex-col border-r editor-border"
      >
        <div ref="editorContainer" class="h-full min-h-0 flex-1" />
      </div>

      <!-- Resizer -->
      <div
        v-show="showEditor && showPreview"
        class="editor-resize-handle"
        @mousedown="startResize"
      />

      <!-- Preview Pane -->
      <div
        v-show="showPreview"
        :class="showEditor && !isMobile ? 'sm:w-1/2' : 'w-full'"
        class="preview-pane relative flex flex-col overflow-hidden"
      >
        <!-- Help Button -->
        <button
          class="editor-help-btn"
          title="Quick Reference (shortcuts, syntax, examples)"
          @click="showHelpModal = true"
        >
          ?
        </button>

        <div ref="previewContainer" class="editor-preview-inner flex-1 overflow-auto p-4">
          <div class="prose prose-invert max-w-none" v-html="renderedContent" />
        </div>
      </div>
    </div>

    <!-- Status Bar -->
    <div class="editor-status">
      <div class="editor-status-group">
        <span v-if="autosave && lastSaved" class="editor-status-saved">
          <span class="editor-status-dot" />Saved {{ lastSaved }}
        </span>
        <span v-else class="editor-status-item">
          <strong>{{ wordCount }}</strong> words · <strong>{{ charCount }}</strong> chars
        </span>
      </div>
      <div class="editor-status-group">
        <span class="editor-status-item">{{ cursorInfo }}</span>
        <span class="editor-status-item">UTF-8</span>
      </div>
    </div>

    <!-- Help Modal -->
    <HelpModal :is-open="showHelpModal" @close="showHelpModal = false" />

    <!-- Confirm Modals -->
    <ConfirmModal
      :is-open="confirmAutosaveOn"
      title="Enable autosave?"
      message="Your content will be saved to your browser's local storage only. No data is sent to any server."
      confirm-text="Ok"
      cancel-text="Cancel"
      @confirm="confirmEnableAutosave"
      @cancel="cancelAutosaveChange"
    />
    <ConfirmModal
      :is-open="confirmAutosaveOff"
      title="Disable autosave?"
      message="This will turn off autosave and delete your saved content."
      confirm-text="Ok"
      cancel-text="Cancel"
      @confirm="confirmDisableAutosave"
      @cancel="cancelAutosaveChange"
    />
    <ConfirmModal
      :is-open="confirmClearData"
      title="Clear data?"
      message="This will delete your saved content from this browser and turn autosave off."
      confirm-text="Clear Data"
      cancel-text="Cancel"
      @confirm="confirmClearDataNow"
      @cancel="confirmClearData = false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
  import type { Ref } from 'vue'
  import type { EditorView as EditorViewType } from '@codemirror/view'

  import EditorToolbar from '../components/EditorToolbar.vue'
  import LoadingScreen from '../components/LoadingScreen.vue'
  import { useEditorActions } from '../composables/useEditorActions'
  import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'
  import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'
  import { sanitizeHtml } from '../utils/sanitizer'

  const HelpModal = defineAsyncComponent(() => import('../components/HelpModal.vue'))
  const ConfirmModal = defineAsyncComponent(() => import('../components/ConfirmModal.vue'))

  // Add page-specific styling to prevent scrolling
  useHead({
    bodyAttrs: {
      class: 'overflow-hidden',
    },
  })

  const isLoading: Ref<boolean> = ref(true)
  const loadingStep: Ref<string> = ref('Initializing...')
  const editorContainer: Ref<HTMLElement | null> = ref(null)
  const previewContainer: Ref<HTMLElement | null> = ref(null)
  const content: Ref<string> = ref('')
  const showEditor: Ref<boolean> = ref(true)
  const showPreview: Ref<boolean> = ref(true)
  const autosave: Ref<boolean> = ref(false)
  const lastSaved: Ref<string> = ref('')
  const isMobile: Ref<boolean> = ref(false)
  const showHelpModal: Ref<boolean> = ref(false)
  const pendingAutosaveValue: Ref<boolean | null> = ref(null)
  const confirmAutosaveOn: Ref<boolean> = ref(false)
  const confirmAutosaveOff: Ref<boolean> = ref(false)
  const confirmClearData: Ref<boolean> = ref(false)

  const editorViewRef: Ref<EditorViewType | null> = ref(null)
  const customEditorWidth: Ref<number | null> = ref(null)
  const customPreviewWidth: Ref<number | null> = ref(null)

  const wordCount = computed<number>(() => {
    return content.value.trim() ? content.value.trim().split(/\s+/).length : 0
  })

  const charCount = computed<number>(() => {
    return content.value.length
  })

  const cursorLine = ref(1)
  const cursorCol = ref(1)
  const cursorInfo = computed(() => `Ln ${cursorLine.value}, Col ${cursorCol.value}`)

  const currentFilename = ref('untitled.md')

  const renderedContent: Ref<string> = ref('')

  const { renderMarkdown, renderMermaidDiagrams, highlightSyntax } = useMarkdownRenderer()
  const actions = useEditorActions(editorViewRef, content, autosave, lastSaved)
  useKeyboardShortcuts(actions)

  let mermaidTimeout: ReturnType<typeof setTimeout> | null = null
  const debouncedMermaidRender = async () => {
    if (mermaidTimeout) {
      clearTimeout(mermaidTimeout)
    }

    mermaidTimeout = setTimeout(async () => {
      await renderMermaidDiagrams()
    }, 300)
  }

  // Watch for content changes and re-render (not immediate - initial render happens after editor init)
  watch(content, async (newContent) => {
    renderedContent.value = await renderMarkdown(newContent)
    await nextTick()
    await debouncedMermaidRender()
    await highlightSyntax()
  })

  // Methods
  const onLoadingComplete = (): void => {
    isLoading.value = false
  }

  const initEditor = async (): Promise<void> => {
    if (!editorContainer.value) return

    const [
      { EditorView, keymap },
      { basicSetup },
      { EditorState },
      { indentWithTab },
      { markdown },
      { oneDark }
    ] = await Promise.all([
      import('@codemirror/view'),
      import('codemirror'),
      import('@codemirror/state'),
      import('@codemirror/commands'),
      import('@codemirror/lang-markdown'),
      import('@codemirror/theme-one-dark')
    ])

    const extensions = [
      basicSetup,
      markdown(),
      oneDark,
      EditorView.lineWrapping,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          content.value = update.state.doc.toString()
        }
        // Track cursor position
        const sel = update.state.selection.main
        const line = update.state.doc.lineAt(sel.head)
        cursorLine.value = line.number
        cursorCol.value = sel.head - line.from + 1
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
        },
        '.cm-editor': {
          height: '100%',
        },
        '.cm-scroller': {
          height: '100%',
        },
        '.cm-content': {
          minHeight: '100%',
          padding: '16px',
        },
      }),
    ]

    const state = EditorState.create({
      doc: content.value,
      extensions,
    })

    editorViewRef.value = new EditorView({
      state,
      parent: editorContainer.value,
    })
  }

  const togglePreview = (): void => {
    showPreview.value = !showPreview.value
    if (!showPreview.value && !showEditor.value) {
      showEditor.value = true
    }
    nextTick(() => applyPaneWidths())
  }

  const toggleEditor = (): void => {
    showEditor.value = !showEditor.value
    if (!showEditor.value && !showPreview.value) {
      showPreview.value = true
    }
    nextTick(() => applyPaneWidths())
  }

  const applyPaneWidths = (): void => {
    const editorPane = document.querySelector('.editor-pane') as HTMLElement
    const previewPane = document.querySelector('.preview-pane') as HTMLElement

    if (
      showEditor.value &&
      showPreview.value &&
      customEditorWidth.value !== null &&
      customPreviewWidth.value !== null
    ) {
      if (editorPane) {
        editorPane.style.width = `${customEditorWidth.value}%`
      }
      if (previewPane) {
        previewPane.style.width = `${customPreviewWidth.value}%`
      }
    } else {
      if (editorPane) {
        editorPane.style.width = ''
      }
      if (previewPane) {
        previewPane.style.width = ''
      }
    }
  }

  const startResize = (e: MouseEvent): void => {
    e.preventDefault()

    const startX = e.clientX
    const editorPane = document.querySelector('.editor-pane') as HTMLElement
    const previewPane = document.querySelector('.preview-pane') as HTMLElement

    if (!editorPane || !previewPane) return

    const startEditorWidth = editorPane.offsetWidth
    const containerWidth = editorPane.parentElement!.offsetWidth

    const handleMouseMove = (e: MouseEvent): void => {
      const deltaX = e.clientX - startX
      const newEditorWidth = startEditorWidth + deltaX
      const newEditorPercent = (newEditorWidth / containerWidth) * 100

      if (newEditorPercent >= 20 && newEditorPercent <= 80) {
        editorPane.style.width = `${newEditorPercent}%`
        previewPane.style.width = `${100 - newEditorPercent}%`
      }
    }

    const handleMouseUp = (): void => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      const editorPercent = (editorPane.offsetWidth / containerWidth) * 100
      const previewPercent = 100 - editorPercent

      customEditorWidth.value = editorPercent
      customPreviewWidth.value = previewPercent
      savePaneWidths()
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const setupScrollSync = (): void => {
    if (!editorViewRef.value || !previewContainer.value) return

    let isEditorScrolling = false
    let isPreviewScrolling = false

    const editorScrollHandler = (): void => {
      if (isPreviewScrolling) return

      isEditorScrolling = true

      const editorElement = editorViewRef.value!.scrollDOM
      const scrollPercentage =
        editorElement.scrollTop / (editorElement.scrollHeight - editorElement.clientHeight)

      const previewElement = previewContainer.value!
      const maxScrollTop = previewElement.scrollHeight - previewElement.clientHeight

      previewElement.scrollTop = scrollPercentage * maxScrollTop

      requestAnimationFrame(() => {
        isEditorScrolling = false
      })
    }

    const previewScrollHandler = (): void => {
      if (isEditorScrolling) return

      isPreviewScrolling = true

      const previewElement = previewContainer.value!
      const scrollPercentage =
        previewElement.scrollTop / (previewElement.scrollHeight - previewElement.clientHeight)

      const editorElement = editorViewRef.value!.scrollDOM
      const maxScrollTop = editorElement.scrollHeight - editorElement.clientHeight

      editorElement.scrollTop = scrollPercentage * maxScrollTop

      requestAnimationFrame(() => {
        isPreviewScrolling = false
      })
    }

    editorViewRef.value.scrollDOM.addEventListener('scroll', editorScrollHandler)
    previewContainer.value.addEventListener('scroll', previewScrollHandler)
  }

  const loadSettings = (): void => {
    try {
      const savedAutosave = localStorage.getItem('mermditor-autosave')
      if (savedAutosave !== null) {
        autosave.value = savedAutosave === 'true'
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const loadContent = (): void => {
    const saved = localStorage.getItem('mermditor-content')
    if (saved) {
      content.value = sanitizeHtml(saved)
    }
  }

  const savePaneWidths = (): void => {
    try {
      if (customEditorWidth.value !== null && customPreviewWidth.value !== null) {
        localStorage.setItem('mermditor-editor-width', customEditorWidth.value.toString())
        localStorage.setItem('mermditor-preview-width', customPreviewWidth.value.toString())
      }
    } catch (error) {
      console.error('Error saving pane widths:', error)
    }
  }

  const loadPaneWidths = (): void => {
    try {
      const savedEditorWidth = localStorage.getItem('mermditor-editor-width')
      const savedPreviewWidth = localStorage.getItem('mermditor-preview-width')

      if (savedEditorWidth && savedPreviewWidth) {
        customEditorWidth.value = parseFloat(savedEditorWidth)
        customPreviewWidth.value = parseFloat(savedPreviewWidth)
      }
    } catch (error) {
      console.error('Error loading pane widths:', error)
    }
  }

  // Watchers
  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  watch(content, () => {
    if (autosave.value) {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      saveTimeout = setTimeout(() => {
        actions.saveContent()
      }, 10000)
    }
  })

  watch(autosave, (newValue) => {
    if (newValue) {
      actions.saveContent()
    }
  })

  const onAutosaveToggle = (checked: boolean): void => {
    pendingAutosaveValue.value = checked
    if (checked) {
      confirmAutosaveOn.value = true
    } else {
      confirmAutosaveOff.value = true
    }
  }

  const cancelAutosaveChange = (): void => {
    confirmAutosaveOn.value = false
    confirmAutosaveOff.value = false
    pendingAutosaveValue.value = null
  }

  const confirmEnableAutosave = (): void => {
    autosave.value = true
    confirmAutosaveOn.value = false
    pendingAutosaveValue.value = null
    try {
      localStorage.setItem('mermditor-autosave', 'true')
    } catch {
      /* ignore storage errors */
    }
    actions.saveContent()
  }

  const confirmDisableAutosave = (): void => {
    autosave.value = false
    confirmAutosaveOff.value = false
    pendingAutosaveValue.value = null
    try {
      localStorage.setItem('mermditor-autosave', 'false')
      localStorage.removeItem('mermditor-content')
    } catch {
      /* ignore storage errors */
    }
  }

  const onClearStorageClick = (): void => {
    confirmClearData.value = true
  }

  const confirmClearDataNow = (): void => {
    try {
      localStorage.removeItem('mermditor-content')
      localStorage.removeItem('mermditor-autosave')
      localStorage.removeItem('mermditor-editor-width')
      localStorage.removeItem('mermditor-preview-width')
      localStorage.removeItem('mermditor-recent-emojis')
      autosave.value = false
    } catch {
      /* ignore storage errors */
    }
    confirmClearData.value = false
  }

  // Check for mobile device
  const checkMobile = (): void => {
    isMobile.value = window.innerWidth < 640
  }

  // Lifecycle
  let cleanupCodeBlockInteractions: (() => void) | null = null

  onMounted(async () => {
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Load saved content and settings
    loadingStep.value = 'Loading saved content...'
    loadContent()
    loadSettings()
    loadPaneWidths()

    await nextTick()

    // Initialize editor
    loadingStep.value = 'Initializing editor...'
    await initEditor()

    await nextTick()
    setupScrollSync()
    if (previewContainer.value) {
      cleanupCodeBlockInteractions = attachCodeBlockInteractions(previewContainer.value)
    }
    applyPaneWidths()

    // Trigger initial markdown render after editor is ready
    loadingStep.value = 'Rendering preview...'
    renderedContent.value = await renderMarkdown(content.value)
    await nextTick()
    await debouncedMermaidRender()
    await highlightSyntax()

    // Hide loading screen
    requestAnimationFrame(() => {
      isLoading.value = false
    })
  })

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    cleanupCodeBlockInteractions?.()
  })
</script>

<style scoped>
.editor-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 50px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.editor-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  font-size: 0.9375rem;
  color: var(--text);
  text-decoration: none;
  margin-right: 4px;
}

.editor-logo img { height: 26px; width: auto; display: block; }

.editor-header-sep {
  width: 1px;
  height: 18px;
  background: var(--border);
  flex-shrink: 0;
}

.editor-file-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.8125rem;
  color: var(--dim);
}

.editor-file-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  flex-shrink: 0;
  transition: background 0.2s;
}

.editor-file-dot.saved {
  background: var(--green);
}

.editor-header-spacer { flex: 1; }

.editor-header-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.editor-header-nav a {
  padding: 5px 10px;
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--dim);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}

.editor-header-nav a:hover {
  background: var(--raised);
  color: var(--text);
}

.editor-border { border-color: var(--border) !important; }

.editor-resize-handle {
  width: 4px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  cursor: col-resize;
  flex-shrink: 0;
  transition: background 0.12s;
}

.editor-resize-handle:hover { background: var(--raised); }

.editor-preview-inner { background: var(--bg); }

.editor-help-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--surface);
  color: var(--muted);
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: color 0.12s, background 0.12s;
}

.editor-help-btn:hover {
  background: var(--raised);
  color: var(--dim);
}

/* Status bar */
.editor-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 24px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.editor-status-group { display: flex; align-items: center; gap: 16px; }

.editor-status-item {
  font-size: 0.72rem;
  color: var(--muted);
}

.editor-status-item strong {
  color: var(--dim);
  font-weight: 600;
}

.editor-status-saved {
  font-size: 0.72rem;
  color: var(--green);
  display: flex;
  align-items: center;
  gap: 4px;
}

.editor-status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--green);
}
</style>
