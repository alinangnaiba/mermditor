<template>
  <div :data-theme="editorTheme" class="editor-page relative flex h-screen flex-col overflow-hidden">
    <LoadingScreen
      :show="isLoading"
      :step="loadingStep"
      :theme="editorTheme"
      class="absolute inset-0 z-50"
      @loading-complete="onLoadingComplete"
    />

    <EditorPageHeader :autosave="autosave" :last-saved="lastSaved" />

    <EditorToolbar
      :actions="actions"
      :autosave="autosave"
      :theme="editorTheme"
      :show-preview="showPreview"
      :show-editor="showEditor"
      @toggle-preview="togglePreview"
      @toggle-editor="toggleEditor"
      @toggle-theme="toggleTheme"
      @update:autosave="onAutosaveToggle($event)"
      @clear-storage="onClearStorageClick"
    />

    <div class="editor-workspace-shell flex flex-1 overflow-hidden">
      <WorkspaceSidebar
        :is-mobile="isMobile"
        :custom-workspace-width="customWorkspaceWidth"
        :workspace="workspace"
        :search-query="searchQuery"
        :workspace-search-results="workspaceSearchResults"
        :display-tree-rows="displayTreeRows"
        :expanded-folder-ids="expandedFolderIds"
        :open-file-ids="openFileIds"
        :context-menu="contextMenu"
        :context-menu-actions="contextMenuActions"
        :drag-state="dragState"
        :inline-edit="inlineEdit"
        @update:search-query="setSearchQuery"
        @update:inline-edit-value="updateInlineEditValue"
        @start-inline-new-item="startInlineNewItem($event.type, $event.parentFolderId)"
        @open-file="openFile($event.fileId, $event.lineNumber)"
        @workspace-row-click="handleWorkspaceRowClick"
        @start-inline-rename="startInlineRename"
        @open-context-menu="openContextMenu($event.targetType, $event.targetId, $event.x, $event.y)"
        @root-drag-over="handleRootDragOver"
        @root-drop="handleRootDrop"
        @drag-start="handleDragStart($event.event, $event.item)"
        @item-drag-over="handleItemDragOver($event.event, $event.item)"
        @item-drop="handleItemDrop($event.event, $event.item)"
        @drag-end="handleDragEnd"
        @run-context-menu-action="runContextMenuAction"
        @commit-inline-edit="commitInlineEdit"
        @cancel-inline-edit="cancelInlineEdit"
      />

      <div v-if="!isMobile" class="workspace-resize-handle" @mousedown="startWorkspaceResize" />

      <div class="editor-content-shell flex flex-1 flex-col overflow-hidden">
        <WorkspaceTabs
          :is-mobile="isMobile"
          :open-file-ids="openFileIds"
          :active-file-id="workspace.activeFileId"
          :get-file-name="getFileName"
          :open-file="openFile"
          :close-tab="closeTab"
        />

        <EditorSplitPane
          :is-mobile="isMobile"
          :show-editor="showEditor"
          :show-preview="showPreview"
          :preview-prose-class="previewProseClass"
          :on-start-resize="startResize"
          :on-open-help="openHelp"
          @mount="handleSplitPaneMount"
        />
      </div>
    </div>

    <EditorStatusBar
      :autosave="autosave"
      :last-saved="lastSaved"
      :open-file-count="openFileIds.length"
      :word-count="wordCount"
      :char-count="charCount"
      :active-file-path="activeFilePath"
      :cursor-info="cursorInfo"
    />

    <EditorDialogs
      :show-help-modal="showHelpModal"
      :move-modal="moveModal"
      :move-destination-options="moveDestinationOptions"
      :confirm-autosave-on="confirmAutosaveOn"
      :confirm-autosave-off="confirmAutosaveOff"
      :confirm-clear-data="confirmClearData"
      :delete-item-modal="deleteItemModal"
      :close-help="closeHelp"
      :submit-move-modal="submitMoveModal"
      :close-move-modal="closeMoveModal"
      :confirm-enable-autosave="confirmEnableAutosaveNow"
      :confirm-disable-autosave="confirmDisableAutosave"
      :cancel-autosave-change="cancelAutosaveChange"
      :confirm-clear-data-now="confirmClearDataNow"
      :cancel-clear-data="cancelClearData"
      :confirm-delete-workspace-item="confirmDeleteWorkspaceItem"
      :close-delete-item-modal="closeDeleteItemModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import type { Compartment } from '@codemirror/state'
  import type { EditorView as EditorViewType } from '@codemirror/view'
  import EditorDialogs from '../components/EditorDialogs.vue'
  import EditorPageHeader from '../components/EditorPageHeader.vue'
  import EditorSplitPane from '../components/EditorSplitPane.vue'
  import EditorStatusBar from '../components/EditorStatusBar.vue'
  import EditorToolbar from '../components/EditorToolbar.vue'
  import LoadingScreen from '../components/LoadingScreen.vue'
  import WorkspaceSidebar from '../components/WorkspaceSidebar.vue'
  import WorkspaceTabs from '../components/WorkspaceTabs.vue'
  import { useEditorActions } from '../composables/useEditorActions'
  import { useEditorLayout } from '../composables/useEditorLayout'
  import { useEditorPersistence } from '../composables/useEditorPersistence'
  import { useEditorPreview } from '../composables/useEditorPreview'
  import { useEditorTheme } from '../composables/useEditorTheme'
  import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
  import { useWorkspaceController } from '../composables/useWorkspaceController'

  useHead({
    bodyAttrs: {
      class: 'overflow-hidden',
    },
  })

  const isLoading = ref(true)
  const loadingStep = ref('Initializing...')
  const content = ref('')
  const editorViewRef: Ref<EditorViewType | null> = ref(null)
  const editorContainer = ref<HTMLElement | null>(null)
  const previewContainer = ref<HTMLElement | null>(null)
  const previewContentRoot = ref<HTMLElement | null>(null)
  const showHelpModal = ref(false)
  const cursorLine = ref(1)
  const cursorCol = ref(1)
  const cursorInfo = computed(() => `Ln ${cursorLine.value}, Col ${cursorCol.value}`)
  const trimmedContent = computed(() => content.value.trim())
  const wordCount = computed(() => (trimmedContent.value ? trimmedContent.value.split(/\s+/).length : 0))
  const charCount = computed(() => content.value.length)

  const {
    editorTheme,
    applyDocumentTheme,
    clearDocumentTheme,
    persistEditorTheme,
    setEditorThemeRuntime,
    buildEditorThemeExtension,
    applyThemeToEditor,
    toggleTheme,
  } = useEditorTheme()

  const {
    isMobile,
    showEditor,
    showPreview,
    customWorkspaceWidth,
    checkMobile,
    applyPaneWidths,
    loadPaneWidths,
    loadWorkspaceWidth,
    togglePreview,
    toggleEditor,
    startResize,
    startWorkspaceResize,
    clearStoredLayout,
    resetLayoutState,
    cleanup: cleanupLayout,
  } = useEditorLayout()

  const {
    autosave,
    lastSaved,
    confirmAutosaveOn,
    confirmAutosaveOff,
    confirmClearData,
    loadWorkspaceSnapshot,
    loadSettings,
    persistWorkspace,
    persistWorkspaceIfEnabled,
    scheduleAutosave,
    onAutosaveToggle,
    cancelAutosaveChange,
    confirmEnableAutosave,
    confirmDisableAutosave,
    onClearStorageClick,
    confirmClearDataNow: confirmClearDataNowBase,
    cleanup: cleanupPersistence,
  } = useEditorPersistence()

  const replaceEditorContent = (nextContent: string, lineNumber?: number): void => {
    content.value = nextContent

    if (!editorViewRef.value) return

    const { state } = editorViewRef.value
    const nextLineCount = Math.max(nextContent.split('\n').length, 1)
    const line = lineNumber ? Math.min(lineNumber, nextLineCount) : null

    editorViewRef.value.dispatch({
      changes: { from: 0, to: state.doc.length, insert: nextContent },
    })

    if (line) {
      const targetLine = editorViewRef.value.state.doc.line(line)
      editorViewRef.value.dispatch({
        selection: { anchor: targetLine.from },
        scrollIntoView: true,
      })
    }
  }

  const {
    workspace,
    searchQuery,
    expandedFolderIds,
    activeFile,
    activeFilePath,
    openFileIds,
    displayTreeRows,
    workspaceSearchResults,
    contextMenu,
    contextMenuActions,
    moveModal,
    moveDestinationOptions,
    deleteItemModal,
    dragState,
    inlineEdit,
    hydrateWorkspace,
    syncActiveFileContent,
    setSearchQuery,
    updateInlineEditValue,
    openContextMenu,
    closeContextMenu,
    openFile,
    closeTab,
    getFileName,
    handleWorkspaceRowClick,
    startInlineNewItem,
    startInlineRename,
    runContextMenuAction,
    handleRootDragOver,
    handleRootDrop,
    handleDragStart,
    handleItemDragOver,
    handleItemDrop,
    handleDragEnd,
    commitInlineEdit,
    cancelInlineEdit,
    submitMoveModal,
    closeMoveModal,
    confirmDeleteWorkspaceItem,
    closeDeleteItemModal,
    importMarkdownIntoWorkspace,
    resetWorkspace,
  } = useWorkspaceController({
    content,
    replaceEditorContent,
    persistWorkspaceIfEnabled,
  })

  const {
    previewProseClass,
    refreshPreview,
    schedulePreviewRefresh,
    setupScrollSync,
    attachPreviewInteractions,
    handleThemeChange,
    cleanup: cleanupPreview,
  } = useEditorPreview({
    editorViewRef,
    previewContainer,
    previewContentRoot,
    editorTheme,
  })

  const actions = useEditorActions(editorViewRef, content, autosave, lastSaved, {
    getFilename: () => activeFile.value?.name ?? 'untitled.md',
    onImportMarkdownFile: ({ filename, content: importedContent }) => {
      importMarkdownIntoWorkspace(filename, importedContent)
    },
    onSaveContent: () => {
      persistWorkspace(workspace.value, content.value)
    },
  })
  useKeyboardShortcuts(actions)

  if (import.meta.client) {
    applyDocumentTheme(editorTheme.value)
  }

  watch(
    content,
    (newContent) => {
    syncActiveFileContent(newContent)
    scheduleAutosave(actions.saveContent)
      schedulePreviewRefresh(newContent)
    },
    { flush: 'post' }
  )

  watch(editorTheme, async (theme) => {
    applyDocumentTheme(theme)
    persistEditorTheme(theme)
    applyThemeToEditor(editorViewRef.value, theme)
    await handleThemeChange(content.value)
  })

  watch(autosave, (newValue) => {
    if (newValue) {
      actions.saveContent()
    }
  })

  const handleSplitPaneMount = ({
    editorContainer: nextEditorContainer,
    previewContainer: nextPreviewContainer,
    previewContentRoot: nextPreviewContentRoot,
  }: {
    editorContainer: HTMLElement | null
    previewContainer: HTMLElement | null
    previewContentRoot: HTMLElement | null
  }): void => {
    editorContainer.value = nextEditorContainer
    previewContainer.value = nextPreviewContainer
    previewContentRoot.value = nextPreviewContentRoot
  }

  const initEditor = async (): Promise<void> => {
    if (!editorContainer.value) return

    const [
      { EditorView, keymap },
      { basicSetup },
      { Compartment, EditorState },
      { indentWithTab },
      { markdown },
      { oneDark },
    ] = await Promise.all([
      import('@codemirror/view'),
      import('codemirror'),
      import('@codemirror/state'),
      import('@codemirror/commands'),
      import('@codemirror/lang-markdown'),
      import('@codemirror/theme-one-dark'),
    ])

    const editorThemeCompartment = new Compartment() as Compartment
    setEditorThemeRuntime({ EditorView, oneDark }, editorThemeCompartment)

    const state = EditorState.create({
      doc: content.value,
      extensions: [
        basicSetup,
        markdown(),
        EditorView.lineWrapping,
        editorThemeCompartment.of(buildEditorThemeExtension(editorTheme.value)),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            content.value = update.state.doc.toString()
          }

          const selection = update.state.selection.main
          const line = update.state.doc.lineAt(selection.head)
          cursorLine.value = line.number
          cursorCol.value = selection.head - line.from + 1
        }),
      ],
    })

    editorViewRef.value = new EditorView({
      state,
      parent: editorContainer.value,
    })
  }

  const onLoadingComplete = (): void => {
    isLoading.value = false
  }

  const openHelp = (): void => {
    showHelpModal.value = true
  }

  const closeHelp = (): void => {
    showHelpModal.value = false
  }

  const confirmEnableAutosaveNow = (): void => {
    confirmEnableAutosave(actions.saveContent)
  }

  const cancelClearData = (): void => {
    confirmClearData.value = false
  }

  const confirmClearDataNow = (): void => {
    confirmClearDataNowBase(() => {
      clearStoredLayout()
      resetLayoutState()
      resetWorkspace()
    })
  }

  const handleDocumentClick = (): void => {
    closeContextMenu()
  }

  onMounted(async () => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    document.addEventListener('click', handleDocumentClick)

    loadingStep.value = 'Loading saved content...'
    const snapshot = loadWorkspaceSnapshot()
    hydrateWorkspace(snapshot.workspace, snapshot.legacyContent)
    loadSettings()
    loadPaneWidths()
    loadWorkspaceWidth()
    applyDocumentTheme(editorTheme.value)

    await nextTick()

    loadingStep.value = 'Initializing editor...'
    await initEditor()

    await nextTick()
    setupScrollSync()
    attachPreviewInteractions()
    applyPaneWidths()

    loadingStep.value = 'Rendering preview...'
    await refreshPreview(content.value)

    requestAnimationFrame(() => {
      isLoading.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('click', handleDocumentClick)
    clearDocumentTheme()
    cleanupLayout()
    cleanupPersistence()
    cleanupPreview()
  })
</script>
