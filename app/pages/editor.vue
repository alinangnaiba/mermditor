<template>
  <!-- App Shell -->
  <div class="editor-page relative flex h-screen flex-col overflow-hidden">
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
        Workspace
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
    <div class="editor-workspace-shell flex flex-1 overflow-hidden">
      <aside
        v-if="!isMobile"
        ref="workspacePaneRef"
        class="workspace-pane"
      >
        <div
          class="workspace-pane-header"
          :class="{ 'drop-target': dragState.targetFolderId === workspace.root.id }"
          @contextmenu.prevent="openRootContextMenu"
          @dragover.prevent="handleRootDragOver"
          @drop.prevent="handleRootDrop"
        >
          <span class="workspace-pane-title">Workspace</span>
          <div class="workspace-pane-actions">
            <button
              class="workspace-pane-action-btn"
              title="New File"
              @click.stop="startInlineNewItem('new-file', workspace.root.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
            <button
              class="workspace-pane-action-btn"
              title="New Folder"
              @click.stop="startInlineNewItem('new-folder', workspace.root.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </button>
          </div>
        </div>

        <div class="workspace-search-wrap">
          <input
            v-model="searchQuery"
            type="text"
            class="workspace-search-input"
            placeholder="Search files and headings"
          />
          <div class="workspace-search-meta">Search is limited to this workspace.</div>
        </div>

        <div
          class="workspace-scroll"
          @contextmenu.prevent.self="openRootContextMenu"
          @dragover.prevent.self="handleRootDragOver"
          @drop.prevent.self="handleRootDrop"
        >
          <template v-if="searchQuery.trim()">
            <div class="workspace-section-title">Search Results</div>

            <div v-if="workspaceSearchResults.files.length > 0" class="workspace-result-group">
              <div class="workspace-result-heading">Files</div>
              <button
                v-for="file in workspaceSearchResults.files"
                :key="`file-result-${file.id}`"
                class="workspace-result-item"
                @click="openFile(file.id)"
              >
                <span class="workspace-item-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z" />
                    <path d="M14 3.5v4h4" />
                  </svg>
                </span>
                <span class="workspace-result-text">{{ file.name }}</span>
              </button>
            </div>

            <div v-if="workspaceSearchResults.headings.length > 0" class="workspace-result-group">
              <div class="workspace-result-heading">Headings</div>
              <button
                v-for="heading in workspaceSearchResults.headings"
                :key="`heading-result-${heading.fileId}-${heading.line}`"
                class="workspace-result-item heading-result"
                @click="openHeadingResult(heading.fileId, heading.line)"
              >
                <span class="workspace-heading-badge">#</span>
                <span class="workspace-result-body">
                  <span class="workspace-result-text">{{ heading.heading }}</span>
                  <span class="workspace-result-meta">{{ heading.fileName }}</span>
                </span>
              </button>
            </div>

            <div
              v-if="
                workspaceSearchResults.files.length === 0 &&
                workspaceSearchResults.headings.length === 0
              "
              class="workspace-empty-state"
            >
              No files or headings match "{{ searchQuery }}".
            </div>
          </template>

          <template v-else>
            <div class="workspace-section-title">Explorer</div>

            <template v-for="row in displayTreeRows" :key="row.item.id">
              <!-- Inline editing row (new item or rename) -->
              <div
                v-if="inlineEdit.itemId === row.item.id"
                class="workspace-tree-row"
                :class="{ folder: row.item.type === 'folder' }"
                :style="{ paddingLeft: `${12 + row.depth * 18}px` }"
              >
                <span class="workspace-tree-caret">
                  {{ row.item.type === 'folder' ? '▸' : '' }}
                </span>
                <span class="workspace-item-icon">
                  <svg v-if="row.item.type === 'folder'" viewBox="0 0 24 24">
                    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z" />
                    <path d="M14 3.5v4h4" />
                  </svg>
                </span>
                <input
                  ref="inlineInputRefs"
                  v-model="inlineEdit.value"
                  class="workspace-inline-input"
                  @keydown.enter.prevent="commitInlineEdit"
                  @keydown.escape.prevent="cancelInlineEdit"
                  @blur="commitInlineEdit"
                  @click.stop
                  @mousedown.stop
                  @dblclick.stop
                />
              </div>

              <!-- Normal row -->
              <button
                v-else
                class="workspace-tree-row"
                :class="{
                  folder: row.item.type === 'folder',
                  active: row.item.type === 'file' && row.item.id === workspace.activeFileId,
                  selected: contextMenu.visible && contextMenu.targetId === row.item.id,
                  'drop-target': row.item.type === 'folder' && dragState.targetFolderId === row.item.id,
                  dragging: dragState.draggedItemId === row.item.id,
                }"
                :style="{ paddingLeft: `${12 + row.depth * 18}px` }"
                draggable="true"
                @click="handleWorkspaceRowClick(row.item)"
                @dblclick.stop="startInlineRename(row.item)"
                @contextmenu.prevent.stop="openItemContextMenu($event, row.item)"
                @dragstart="handleDragStart($event, row.item)"
                @dragover.prevent="handleItemDragOver($event, row.item)"
                @drop.prevent="handleItemDrop($event, row.item)"
                @dragend="handleDragEnd"
              >
                <span class="workspace-tree-caret">
                  {{
                    row.item.type === 'folder'
                      ? expandedFolderIds.includes(row.item.id)
                        ? '▾'
                        : '▸'
                      : ''
                  }}
                </span>
                <span class="workspace-item-icon">
                  <svg v-if="row.item.type === 'folder'" viewBox="0 0 24 24">
                    <path
                      d="M3 7.5A1.5 1.5 0 0 1 4.5 6H10l2 2h7.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"
                    />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M7 3.5h7l4 4v13H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2z" />
                    <path d="M14 3.5v4h4" />
                  </svg>
                </span>
                <span class="workspace-tree-name">{{ row.item.name }}</span>
                <span
                  v-if="row.item.type === 'file' && openFileIds.includes(row.item.id)"
                  class="workspace-tree-badge"
                >
                  open
                </span>
              </button>
            </template>
          </template>
        </div>

        <div
          v-if="contextMenu.visible"
          class="workspace-context-menu"
          :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        >
          <button
            v-for="action in contextMenuActions"
            :key="action.id"
            class="workspace-context-item"
            @click="runContextMenuAction(action.id)"
          >
            <span class="workspace-item-icon">
              <svg v-if="action.id === 'new-file'" viewBox="0 0 24 24">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              <svg v-else-if="action.id === 'new-folder'" viewBox="0 0 24 24">
                <path d="M4 8h6l2 2h8" />
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              <svg v-else-if="action.id === 'rename'" viewBox="0 0 24 24">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <svg v-else-if="action.id === 'move'" viewBox="0 0 24 24">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
              <svg v-else-if="action.id === 'duplicate'" viewBox="0 0 24 24">
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else viewBox="0 0 24 24">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 10v6" />
                <path d="M14 10v6" />
              </svg>
            </span>
            <span>{{ action.label }}</span>
          </button>
        </div>
      </aside>

      <div class="editor-content-shell flex flex-1 flex-col overflow-hidden">
        <div v-if="!isMobile" class="workspace-tabs">
          <button
            v-for="fileId in openFileIds"
            :key="fileId"
            class="workspace-tab"
            :class="{ active: fileId === workspace.activeFileId }"
            @click="openFile(fileId)"
          >
            <span class="workspace-tab-dot" />
            <span class="workspace-tab-name">{{ getFileName(fileId) }}</span>
            <span
              v-if="openFileIds.length > 1"
              class="workspace-tab-close"
              @click.stop="closeTab(fileId)"
            >
              ×
            </span>
          </button>
        </div>

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
      </div>
    </div>

    <!-- Status Bar -->
    <div class="editor-status">
      <div class="editor-status-group">
        <span v-if="autosave && lastSaved" class="editor-status-saved">
          <span class="editor-status-dot" />Saved {{ lastSaved }}
        </span>
        <span v-else class="editor-status-item">
          <strong>{{ openFileIds.length }}</strong> open files · <strong>{{ wordCount }}</strong>
          words · <strong>{{ charCount }}</strong> chars
        </span>
      </div>
      <div class="editor-status-group">
        <span class="editor-status-item">{{ activeFilePath }}</span>
        <span class="editor-status-item">{{ cursorInfo }}</span>
        <span class="editor-status-item">UTF-8</span>
      </div>
    </div>

    <!-- Help Modal -->
    <HelpModal :is-open="showHelpModal" @close="showHelpModal = false" />

    <WorkspaceMoveModal
      :is-open="moveModal.visible"
      :item-name="moveModal.itemName"
      :options="moveDestinationOptions"
      :initial-folder-id="moveModal.initialFolderId"
      :error-text="moveModal.errorText"
      @confirm="submitMoveModal"
      @cancel="closeMoveModal"
    />

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
    <ConfirmModal
      :is-open="deleteItemModal.visible"
      :title="deleteItemModal.title"
      :message="deleteItemModal.message"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteWorkspaceItem"
      @cancel="closeDeleteItemModal"
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
  import {
    createDefaultWorkspace,
    createWorkspaceFile,
    createWorkspaceFolder,
    findFirstWorkspaceFile,
    findWorkspaceFile,
    findWorkspaceItem,
    flattenWorkspaceTree,
    getWorkspaceItemPath,
    normalizeFileName,
    normalizeFolderName,
    searchWorkspace,
  } from '../utils/workspace'
  import type { WorkspaceData, WorkspaceFile, WorkspaceFolder, WorkspaceItem } from '../utils/workspace'

  type ContextMenuTargetType = 'root' | 'folder' | 'file' | null
  type ContextMenuActionId =
    | 'new-file'
    | 'new-folder'
    | 'rename'
    | 'duplicate'
    | 'move'
    | 'delete'
  const WORKSPACE_STORAGE_KEY = 'mermditor-workspace'
  const LEGACY_CONTENT_STORAGE_KEY = 'mermditor-content'

  const HelpModal = defineAsyncComponent(() => import('../components/HelpModal.vue'))
  const ConfirmModal = defineAsyncComponent(() => import('../components/ConfirmModal.vue'))
  const WorkspaceMoveModal = defineAsyncComponent(
    () => import('../components/WorkspaceMoveModal.vue')
  )

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
  const workspacePaneRef: Ref<HTMLElement | null> = ref(null)
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
  const searchQuery: Ref<string> = ref('')
  const expandedFolderIds: Ref<string[]> = ref([])

  const editorViewRef: Ref<EditorViewType | null> = ref(null)
  const customEditorWidth: Ref<number | null> = ref(null)
  const customPreviewWidth: Ref<number | null> = ref(null)
  const workspace = ref<WorkspaceData>(createDefaultWorkspace())
  const openFileIds = computed(() => workspace.value.openFileIds)
  const activeFile = computed<WorkspaceFile | null>(() => {
    return findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)
  })
  const activeFilePath = computed(() => {
    return getWorkspaceItemPath(workspace.value.root, workspace.value.activeFileId).join(' / ')
  })
  const workspaceTreeRows = computed(() => {
    return flattenWorkspaceTree(workspace.value.root, new Set(expandedFolderIds.value))
  })
  const displayTreeRows = computed((): WorkspaceTreeRow[] => {
    const rows = workspaceTreeRows.value
    const { type, parentFolderId, depth } = inlineEdit.value

    if (type !== 'new-file' && type !== 'new-folder') return rows
    if (!parentFolderId) return rows

    const pendingItem: WorkspaceTreeRow =
      type === 'new-folder'
        ? { item: { id: '__pending__', type: 'folder', name: '', children: [] }, depth, parentFolderId }
        : { item: { id: '__pending__', type: 'file', name: '', content: '' }, depth, parentFolderId }

    if (parentFolderId === workspace.value.root.id) {
      return [pendingItem, ...rows]
    }

    const parentIndex = rows.findIndex((r) => r.item.id === parentFolderId)
    if (parentIndex === -1) return [pendingItem, ...rows]

    const result = [...rows]
    result.splice(parentIndex + 1, 0, pendingItem)
    return result
  })
  const workspaceSearchResults = computed(() => {
    return searchWorkspace(workspace.value.root, searchQuery.value)
  })
  const contextMenu = ref<{
    visible: boolean
    x: number
    y: number
    targetId: string | null
    targetType: ContextMenuTargetType
  }>({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
    targetType: null,
  })
  const moveModal = ref<{
    visible: boolean
    targetId: string | null
    itemName: string
    initialFolderId: string
    errorText: string
  }>({
    visible: false,
    targetId: null,
    itemName: '',
    initialFolderId: '',
    errorText: '',
  })
  const deleteItemModal = ref<{
    visible: boolean
    targetId: string | null
    title: string
    message: string
  }>({
    visible: false,
    targetId: null,
    title: '',
    message: '',
  })
  const dragState = ref<{
    draggedItemId: string | null
    targetFolderId: string | null
  }>({
    draggedItemId: null,
    targetFolderId: null,
  })
  const inlineEdit = ref<{
    type: 'rename' | 'new-file' | 'new-folder' | null
    itemId: string | null
    parentFolderId: string | null
    depth: number
    value: string
  }>({
    type: null,
    itemId: null,
    parentFolderId: null,
    depth: 0,
    value: '',
  })
  const inlineInputRefs = ref<HTMLInputElement[]>([])

  const wordCount = computed<number>(() => {
    return content.value.trim() ? content.value.trim().split(/\s+/).length : 0
  })

  const charCount = computed<number>(() => {
    return content.value.length
  })

  const cursorLine = ref(1)
  const cursorCol = ref(1)
  const cursorInfo = computed(() => `Ln ${cursorLine.value}, Col ${cursorCol.value}`)

  const renderedContent: Ref<string> = ref('')

  const { renderMarkdown, renderMermaidDiagrams, highlightSyntax } = useMarkdownRenderer()
  const contextMenuActions = computed<Array<{ id: ContextMenuActionId; label: string }>>(() => {
    if (contextMenu.value.targetType === 'root') {
      return [
        { id: 'new-file', label: 'New file' },
        { id: 'new-folder', label: 'New folder' },
      ]
    }

    if (contextMenu.value.targetType === 'folder') {
      const folder = findWorkspaceItem(workspace.value.root, contextMenu.value.targetId ?? '')?.item
      const targetName = folder?.type === 'folder' ? folder.name : 'folder'

      return [
        { id: 'new-file', label: `New file in ${targetName}` },
        { id: 'new-folder', label: `New folder in ${targetName}` },
        { id: 'rename', label: 'Rename' },
        { id: 'move', label: 'Move' },
        { id: 'delete', label: 'Delete' },
      ]
    }

    if (contextMenu.value.targetType === 'file') {
      return [
        { id: 'rename', label: 'Rename' },
        { id: 'duplicate', label: 'Duplicate' },
        { id: 'move', label: 'Move' },
        { id: 'delete', label: 'Delete' },
      ]
    }

    return []
  })
  const moveDestinationOptions = computed<Array<{ id: string; label: string; disabled?: boolean }>>(() => {
    const targetId = moveModal.value.targetId
    const target = targetId ? findWorkspaceItem(workspace.value.root, targetId) : null

    if (!target) {
      return []
    }

    const currentParentId = target.parentFolder?.id ?? workspace.value.root.id
    const blockedFolderIds =
      target.item.type === 'folder'
        ? new Set([target.item.id, ...collectExpandedFolders(target.item)])
        : new Set<string>()

    const buildOptions = (
      folder: WorkspaceFolder,
      path: string[] = []
    ): Array<{ id: string; label: string; disabled?: boolean }> => {
      const label = path.length === 0 ? folder.name : `${path.join(' / ')} / ${folder.name}`

      const options: Array<{ id: string; label: string; disabled?: boolean }> = [
        {
          id: folder.id,
          label,
          disabled: folder.id === currentParentId || blockedFolderIds.has(folder.id),
        },
      ]

      for (const child of folder.children) {
        if (child.type === 'folder') {
          options.push(...buildOptions(child, [...path, folder.name]))
        }
      }

      return options
    }

    return buildOptions(workspace.value.root, [])
  })

  const actions = useEditorActions(editorViewRef, content, autosave, lastSaved, {
    getFilename: () => activeFile.value?.name ?? 'untitled.md',
    onImportMarkdownFile: ({ filename, content: importedContent }) => {
      importMarkdownIntoWorkspace(filename, importedContent)
    },
    onSaveContent: () => {
      persistWorkspace()
    },
  })
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

  const collectExpandedFolders = (folder: WorkspaceFolder): string[] => {
    const folderIds: string[] = []

    for (const child of folder.children) {
      if (child.type === 'folder') {
        folderIds.push(child.id)
        folderIds.push(...collectExpandedFolders(child))
      }
    }

    return folderIds
  }

  const collectFileIds = (folder: WorkspaceFolder): string[] => {
    const fileIds: string[] = []

    for (const child of folder.children) {
      if (child.type === 'file') {
        fileIds.push(child.id)
        continue
      }

      fileIds.push(...collectFileIds(child))
    }

    return fileIds
  }

  const hasSiblingWithName = (
    folder: WorkspaceFolder,
    itemName: string,
    excludeItemId?: string
  ): boolean => {
    return folder.children.some((child) => {
      if (excludeItemId && child.id === excludeItemId) {
        return false
      }

      return child.name.toLowerCase() === itemName.toLowerCase()
    })
  }

  const buildUniqueItemName = (
    folder: WorkspaceFolder,
    desiredName: string,
    excludeItemId?: string
  ): string => {
    if (!hasSiblingWithName(folder, desiredName, excludeItemId)) {
      return desiredName
    }

    const fileMatch = desiredName.match(/^(.*?)(\.[^.]+)$/)
    const baseName = fileMatch?.[1] ?? desiredName
    const extension = fileMatch?.[2] ?? ''
    let counter = 2

    while (hasSiblingWithName(folder, `${baseName}-${counter}${extension}`, excludeItemId)) {
      counter += 1
    }

    return `${baseName}-${counter}${extension}`
  }

  const syncWorkspaceAfterTreeChange = (preferredActiveFileId?: string): void => {
    let firstFile = findFirstWorkspaceFile(workspace.value.root)

    if (!firstFile) {
      const fallbackFile = createWorkspaceFile('untitled.md')
      workspace.value.root.children.push(fallbackFile)
      firstFile = fallbackFile
    }

    const availableFileIds = new Set(collectFileIds(workspace.value.root))

    workspace.value.openFileIds = workspace.value.openFileIds.filter((fileId) =>
      availableFileIds.has(fileId)
    )

    const candidateIds = [
      preferredActiveFileId,
      workspace.value.activeFileId,
      workspace.value.openFileIds[0],
      firstFile.id,
    ].filter((value): value is string => Boolean(value))

    const nextActiveFileId =
      candidateIds.find((fileId) => availableFileIds.has(fileId)) ?? firstFile.id

    workspace.value.activeFileId = nextActiveFileId

    if (!workspace.value.openFileIds.includes(nextActiveFileId)) {
      workspace.value.openFileIds = [...workspace.value.openFileIds, nextActiveFileId]
    }

    const nextActiveFile = findWorkspaceFile(workspace.value.root, nextActiveFileId)
    if (nextActiveFile && nextActiveFile.content !== content.value) {
      replaceEditorContent(nextActiveFile.content)
    }
  }

  const canMoveItemToFolder = (itemId: string, folderId: string): boolean => {
    const target = findWorkspaceItem(workspace.value.root, itemId)
    const destination =
      folderId === workspace.value.root.id
        ? workspace.value.root
        : findWorkspaceItem(workspace.value.root, folderId)?.item

    if (!target || !target.parentFolder || !destination || destination.type !== 'folder') {
      return false
    }

    if (target.parentFolder.id === destination.id) {
      return false
    }

    if (target.item.type === 'folder') {
      const blockedFolderIds = new Set([target.item.id, ...collectExpandedFolders(target.item)])
      if (blockedFolderIds.has(destination.id)) {
        return false
      }
    }

    return true
  }

  const moveWorkspaceItem = (itemId: string, folderId: string): boolean => {
    if (!canMoveItemToFolder(itemId, folderId)) {
      return false
    }

    const target = findWorkspaceItem(workspace.value.root, itemId)
    const destination =
      folderId === workspace.value.root.id
        ? workspace.value.root
        : findWorkspaceItem(workspace.value.root, folderId)?.item

    if (!target || !target.parentFolder || !destination || destination.type !== 'folder') {
      return false
    }

    target.parentFolder.children = target.parentFolder.children.filter((child) => child.id !== itemId)
    target.item.name = buildUniqueItemName(destination, target.item.name, target.item.id)
    destination.children.push(target.item)

    if (!expandedFolderIds.value.includes(destination.id) && destination.id !== workspace.value.root.id) {
      expandedFolderIds.value = [...expandedFolderIds.value, destination.id]
    }

    syncWorkspaceAfterTreeChange(target.item.type === 'file' ? target.item.id : undefined)
    persistWorkspaceIfEnabled()
    return true
  }

  const getFileName = (fileId: string): string => {
    return findWorkspaceFile(workspace.value.root, fileId)?.name ?? 'untitled.md'
  }

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

  const closeContextMenu = (): void => {
    contextMenu.value.visible = false
    contextMenu.value.targetId = null
    contextMenu.value.targetType = null
  }

  const persistWorkspace = (): void => {
    try {
      if (!autosave.value) return

      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace.value))
      localStorage.setItem(LEGACY_CONTENT_STORAGE_KEY, content.value)
      localStorage.setItem('mermditor-autosave', autosave.value.toString())
      lastSaved.value = new Date().toLocaleTimeString()
    } catch (error) {
      console.error('Error saving workspace:', error)
    }
  }

  const persistWorkspaceIfEnabled = (): void => {
    if (autosave.value) {
      persistWorkspace()
    }
  }

  const loadWorkspace = (): void => {
    try {
      const savedWorkspace = localStorage.getItem(WORKSPACE_STORAGE_KEY)

      if (savedWorkspace) {
        workspace.value = JSON.parse(savedWorkspace) as WorkspaceData
      } else {
        const legacyContent = localStorage.getItem(LEGACY_CONTENT_STORAGE_KEY) ?? ''
        workspace.value = createDefaultWorkspace(legacyContent)
      }

      const availableFileIds = new Set(collectFileIds(workspace.value.root))

      workspace.value.openFileIds = workspace.value.openFileIds.filter((fileId) =>
        availableFileIds.has(fileId)
      )

      if (!findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)) {
        const firstFile = findFirstWorkspaceFile(workspace.value.root)
        if (firstFile) {
          workspace.value.activeFileId = firstFile.id
          workspace.value.openFileIds = [firstFile.id]
        }
      }

      if (!findFirstWorkspaceFile(workspace.value.root)) {
        workspace.value = createDefaultWorkspace()
      }

      if (workspace.value.openFileIds.length === 0 && workspace.value.activeFileId) {
        workspace.value.openFileIds = [workspace.value.activeFileId]
      }

      expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
      content.value = activeFile.value?.content ?? ''
    } catch (error) {
      console.error('Error loading workspace:', error)
      workspace.value = createDefaultWorkspace()
      expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
      content.value = activeFile.value?.content ?? ''
    }
  }

  const openFile = (fileId: string, lineNumber?: number): void => {
    const file = findWorkspaceFile(workspace.value.root, fileId)
    if (!file) return

    if (!workspace.value.openFileIds.includes(fileId)) {
      workspace.value.openFileIds = [...workspace.value.openFileIds, fileId]
    }

    workspace.value.activeFileId = fileId
    replaceEditorContent(file.content, lineNumber)
    persistWorkspaceIfEnabled()
    closeContextMenu()
  }

  const openHeadingResult = (fileId: string, lineNumber: number): void => {
    openFile(fileId, lineNumber)
  }

  const closeTab = (fileId: string): void => {
    if (workspace.value.openFileIds.length <= 1) return

    const currentIndex = workspace.value.openFileIds.indexOf(fileId)
    workspace.value.openFileIds = workspace.value.openFileIds.filter((id) => id !== fileId)

    if (workspace.value.activeFileId === fileId) {
      const fallbackId =
        workspace.value.openFileIds[Math.max(currentIndex - 1, 0)] ?? workspace.value.openFileIds[0]

      if (fallbackId) {
        openFile(fallbackId)
        return
      }
    }

    persistWorkspaceIfEnabled()
  }

  const toggleFolder = (folderId: string): void => {
    expandedFolderIds.value = expandedFolderIds.value.includes(folderId)
      ? expandedFolderIds.value.filter((id) => id !== folderId)
      : [...expandedFolderIds.value, folderId]
  }

  const handleWorkspaceRowClick = (item: WorkspaceItem): void => {
    if (item.type === 'folder') {
      toggleFolder(item.id)
      return
    }

    openFile(item.id)
  }

  const openContextMenu = (
    event: MouseEvent,
    targetType: ContextMenuTargetType,
    targetId: string
  ): void => {
    const pane = workspacePaneRef.value
    if (!pane) return

    const bounds = pane.getBoundingClientRect()

    // Estimate menu height (30px per item + 2px borders) to decide open direction
    const itemCounts: Record<string, number> = { root: 2, folder: 5, file: 4 }
    const estimatedMenuHeight = (targetType ? (itemCounts[targetType] ?? 2) : 2) * 30 + 2
    const clickY = event.clientY - bounds.top
    const y =
      bounds.height - clickY < estimatedMenuHeight + 8
        ? Math.max(8, clickY - estimatedMenuHeight)
        : Math.max(8, clickY)

    contextMenu.value.visible = true
    contextMenu.value.targetType = targetType
    contextMenu.value.targetId = targetId
    contextMenu.value.x = Math.max(8, Math.min(event.clientX - bounds.left, bounds.width - 190))
    contextMenu.value.y = y
  }

  const openRootContextMenu = (event: MouseEvent): void => {
    openContextMenu(event, 'root', workspace.value.root.id)
  }

  const openItemContextMenu = (event: MouseEvent, item: WorkspaceItem): void => {
    openContextMenu(event, item.type, item.id)
  }

  const createFileInFolder = (
    folderId: string,
    fileName: string,
    initialContent: string = '',
    ensureUniqueName: boolean = false
  ): WorkspaceFile | null => {
    const folder =
      folderId === workspace.value.root.id
        ? workspace.value.root
        : findWorkspaceItem(workspace.value.root, folderId)?.item

    if (!folder || folder.type !== 'folder') return null

    const normalizedName = normalizeFileName(fileName)
    const nextName = ensureUniqueName
      ? buildUniqueItemName(folder, normalizedName)
      : normalizedName

    const file = createWorkspaceFile(nextName, initialContent)
    folder.children.push(file)

    if (!expandedFolderIds.value.includes(folder.id) && folder.id !== workspace.value.root.id) {
      expandedFolderIds.value = [...expandedFolderIds.value, folder.id]
    }

    openFile(file.id)
    persistWorkspaceIfEnabled()
    return file
  }

  const createFolderInFolder = (
    folderId: string,
    folderName: string,
    ensureUniqueName: boolean = false
  ): WorkspaceFolder | null => {
    const folder =
      folderId === workspace.value.root.id
        ? workspace.value.root
        : findWorkspaceItem(workspace.value.root, folderId)?.item

    if (!folder || folder.type !== 'folder') return null

    const normalizedName = normalizeFolderName(folderName)
    const nextName = ensureUniqueName
      ? buildUniqueItemName(folder, normalizedName)
      : normalizedName

    const newFolder = createWorkspaceFolder(nextName)
    folder.children.push(newFolder)

    if (!expandedFolderIds.value.includes(folder.id) && folder.id !== workspace.value.root.id) {
      expandedFolderIds.value = [...expandedFolderIds.value, folder.id]
    }

    expandedFolderIds.value = [...expandedFolderIds.value, newFolder.id]
    closeContextMenu()
    persistWorkspaceIfEnabled()
    return newFolder
  }

  const renameWorkspaceItem = (itemId: string, nextName: string): boolean => {
    const target = findWorkspaceItem(workspace.value.root, itemId)
    if (!target || target.item.id === workspace.value.root.id || !target.parentFolder) {
      return false
    }

    target.item.name =
      target.item.type === 'file' ? normalizeFileName(nextName) : normalizeFolderName(nextName)

    closeContextMenu()
    persistWorkspaceIfEnabled()
    return true
  }

  const duplicateWorkspaceFile = (fileId: string): void => {
    const target = findWorkspaceItem(workspace.value.root, fileId)
    if (!target || target.item.type !== 'file' || !target.parentFolder) return

    const duplicateName = buildUniqueItemName(
      target.parentFolder,
      target.item.name.replace(/\.md$/i, '-copy.md')
    )
    const duplicate = createWorkspaceFile(duplicateName, target.item.content)
    target.parentFolder.children.push(duplicate)
    openFile(duplicate.id)
    persistWorkspaceIfEnabled()
  }

  const openMoveModal = (itemId: string): void => {
    const target = findWorkspaceItem(workspace.value.root, itemId)
    if (!target || !target.parentFolder) return

    moveModal.value = {
      visible: true,
      targetId: itemId,
      itemName: target.item.name,
      initialFolderId: target.parentFolder.id,
      errorText: '',
    }

    closeContextMenu()
  }

  const closeMoveModal = (): void => {
    moveModal.value = {
      visible: false,
      targetId: null,
      itemName: '',
      initialFolderId: '',
      errorText: '',
    }
  }

  const submitMoveModal = (destinationFolderId: string): void => {
    const targetId = moveModal.value.targetId
    if (!targetId) {
      return
    }

    if (!moveWorkspaceItem(targetId, destinationFolderId)) {
      moveModal.value.errorText = 'Choose a different destination folder.'
      return
    }

    closeMoveModal()
  }

  const openDeleteItemModal = (itemId: string): void => {
    const target = findWorkspaceItem(workspace.value.root, itemId)
    if (!target || target.item.id === workspace.value.root.id) return

    deleteItemModal.value = {
      visible: true,
      targetId: itemId,
      title: target.item.type === 'file' ? 'Delete file?' : 'Delete folder?',
      message:
        target.item.type === 'file'
          ? `Delete "${target.item.name}" from this workspace?`
          : `Delete "${target.item.name}" and everything inside it from this workspace?`,
    }

    closeContextMenu()
  }

  const closeDeleteItemModal = (): void => {
    deleteItemModal.value = {
      visible: false,
      targetId: null,
      title: '',
      message: '',
    }
  }

  const confirmDeleteWorkspaceItem = (): void => {
    const targetId = deleteItemModal.value.targetId
    if (!targetId) return

    const target = findWorkspaceItem(workspace.value.root, targetId)
    if (!target || !target.parentFolder) {
      closeDeleteItemModal()
      return
    }

    const removedFileIds = new Set(
      target.item.type === 'file' ? [target.item.id] : collectFileIds(target.item)
    )
    const removedFolderIds =
      target.item.type === 'folder'
        ? new Set([target.item.id, ...collectExpandedFolders(target.item)])
        : new Set<string>()

    target.parentFolder.children = target.parentFolder.children.filter((child) => child.id !== targetId)
    workspace.value.openFileIds = workspace.value.openFileIds.filter((fileId) => !removedFileIds.has(fileId))
    expandedFolderIds.value = expandedFolderIds.value.filter((folderId) => !removedFolderIds.has(folderId))

    syncWorkspaceAfterTreeChange(workspace.value.openFileIds[0])
    persistWorkspaceIfEnabled()
    closeDeleteItemModal()
  }

  const handleDragStart = (event: DragEvent, item: WorkspaceItem): void => {
    dragState.value.draggedItemId = item.id
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', item.id)
    }
  }

  const handleItemDragOver = (event: DragEvent, item: WorkspaceItem): void => {
    if (item.type !== 'folder' || !dragState.value.draggedItemId) {
      return
    }

    if (canMoveItemToFolder(dragState.value.draggedItemId, item.id)) {
      dragState.value.targetFolderId = item.id
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  const handleItemDrop = (_event: DragEvent, item: WorkspaceItem): void => {
    if (item.type !== 'folder' || !dragState.value.draggedItemId) {
      handleDragEnd()
      return
    }

    moveWorkspaceItem(dragState.value.draggedItemId, item.id)
    handleDragEnd()
  }

  const handleRootDragOver = (event: DragEvent): void => {
    if (!dragState.value.draggedItemId) {
      return
    }

    if (canMoveItemToFolder(dragState.value.draggedItemId, workspace.value.root.id)) {
      dragState.value.targetFolderId = workspace.value.root.id
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  const handleRootDrop = (): void => {
    if (!dragState.value.draggedItemId) {
      handleDragEnd()
      return
    }

    moveWorkspaceItem(dragState.value.draggedItemId, workspace.value.root.id)
    handleDragEnd()
  }

  const handleDragEnd = (): void => {
    dragState.value.draggedItemId = null
    dragState.value.targetFolderId = null
  }

  const runContextMenuAction = (actionId: ContextMenuActionId): void => {
    const targetId = contextMenu.value.targetId
    const targetType = contextMenu.value.targetType

    if (!targetId || !targetType) return

    if (actionId === 'new-file') {
      startInlineNewItem('new-file', targetType === 'file' ? workspace.value.root.id : targetId)
      return
    }

    if (actionId === 'new-folder') {
      startInlineNewItem('new-folder', targetType === 'file' ? workspace.value.root.id : targetId)
      return
    }

    if (actionId === 'rename') {
      const target = findWorkspaceItem(workspace.value.root, targetId)?.item
      if (target) startInlineRename(target)
      return
    }

    if (actionId === 'move') {
      openMoveModal(targetId)
      return
    }

    if (actionId === 'delete') {
      openDeleteItemModal(targetId)
      return
    }

    duplicateWorkspaceFile(targetId)
    closeContextMenu()
  }

  const cancelInlineEdit = (): void => {
    inlineEdit.value = { type: null, itemId: null, parentFolderId: null, depth: 0, value: '' }
  }

  const commitInlineEdit = (): void => {
    const { type, itemId, parentFolderId, value } = inlineEdit.value
    if (!type) return

    // Clear first to prevent double-commit on blur after Enter
    cancelInlineEdit()

    if (!value.trim()) return

    if (type === 'rename' && itemId) {
      const target = findWorkspaceItem(workspace.value.root, itemId)
      if (!target || !target.parentFolder) return

      const normalizedName =
        target.item.type === 'file' ? normalizeFileName(value) : normalizeFolderName(value)

      if (!hasSiblingWithName(target.parentFolder, normalizedName, itemId)) {
        renameWorkspaceItem(itemId, normalizedName)
      }
      return
    }

    if (!parentFolderId) return

    const folder =
      parentFolderId === workspace.value.root.id
        ? workspace.value.root
        : (findWorkspaceItem(workspace.value.root, parentFolderId)?.item as WorkspaceFolder | undefined)

    if (!folder || folder.type !== 'folder') return

    if (type === 'new-file') {
      const normalizedName = normalizeFileName(value)
      if (!hasSiblingWithName(folder, normalizedName)) {
        createFileInFolder(folder.id, normalizedName)
      }
    } else {
      const normalizedName = normalizeFolderName(value)
      if (!hasSiblingWithName(folder, normalizedName)) {
        createFolderInFolder(folder.id, normalizedName)
      }
    }
  }

  const startInlineRename = async (item: WorkspaceItem): Promise<void> => {
    inlineEdit.value = {
      type: 'rename',
      itemId: item.id,
      parentFolderId: null,
      depth: 0,
      value: item.name,
    }
    await nextTick()
    const input = inlineInputRefs.value[0]
    if (input) {
      input.focus()
      input.select()
    }
  }

  const startInlineNewItem = async (
    type: 'new-file' | 'new-folder',
    parentFolderId: string
  ): Promise<void> => {
    if (parentFolderId !== workspace.value.root.id && !expandedFolderIds.value.includes(parentFolderId)) {
      expandedFolderIds.value = [...expandedFolderIds.value, parentFolderId]
    }

    const parentRow = workspaceTreeRows.value.find((r) => r.item.id === parentFolderId)
    const depth = parentFolderId === workspace.value.root.id ? 0 : (parentRow ? parentRow.depth + 1 : 0)

    inlineEdit.value = { type, itemId: '__pending__', parentFolderId, depth, value: '' }
    closeContextMenu()

    await nextTick()
    const input = inlineInputRefs.value[0]
    if (input) input.focus()
  }

  const importMarkdownIntoWorkspace = (filename: string, importedContent: string): void => {
    createFileInFolder(workspace.value.root.id, filename, importedContent, true)
  }

  // Watch for content changes and re-render (not immediate - initial render happens after editor init)
  watch(content, async (newContent) => {
    if (activeFile.value && activeFile.value.content !== newContent) {
      activeFile.value.content = newContent
    }

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
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY)
    } catch {
      /* ignore storage errors */
    }
  }

  const onClearStorageClick = (): void => {
    confirmClearData.value = true
  }

  const confirmClearDataNow = (): void => {
    try {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY)
      localStorage.removeItem('mermditor-autosave')
      localStorage.removeItem('mermditor-editor-width')
      localStorage.removeItem('mermditor-preview-width')
      localStorage.removeItem('mermditor-recent-emojis')
      autosave.value = false
      workspace.value = createDefaultWorkspace()
      expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
      searchQuery.value = ''
      replaceEditorContent(activeFile.value?.content ?? '')
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
  const handleDocumentClick = (): void => {
    closeContextMenu()
  }

  onMounted(async () => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    document.addEventListener('click', handleDocumentClick)

    // Load saved content and settings
    loadingStep.value = 'Loading saved content...'
    loadWorkspace()
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
    document.removeEventListener('click', handleDocumentClick)
    cleanupCodeBlockInteractions?.()
  })
</script>

<style scoped>
.editor-page {
  --bg: #080b10;
  --surface: #10141b;
  --raised: #161b23;
  --border: #202634;
  background: var(--bg);
}

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

.editor-workspace-shell {
  min-width: 0;
}

.workspace-pane {
  position: relative;
  width: 258px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace-pane-header {
  padding: 10px 12px 8px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workspace-pane-header.drop-target {
  background: rgba(74, 142, 255, 0.08);
  box-shadow: inset 0 0 0 1px rgba(74, 142, 255, 0.28);
}

.workspace-pane-title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--muted);
}

.workspace-pane-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.workspace-pane-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--muted);
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.workspace-pane-action-btn svg {
  width: 14px;
  height: 14px;
}

.workspace-pane-action-btn:hover {
  color: var(--fg);
  background: var(--hover);
}

.workspace-search-wrap {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}

.workspace-search-input {
  width: 100%;
  height: 28px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--dim);
  padding: 0 9px;
  font-size: 0.76rem;
  outline: none;
}

.workspace-search-input:focus {
  border-color: rgba(74, 142, 255, 0.45);
}

.workspace-search-meta {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.68rem;
}

.workspace-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0 12px;
}

.workspace-section-title,
.workspace-result-heading {
  padding: 6px 12px;
  color: var(--muted);
  font-size: 0.69rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.workspace-tree-row,
.workspace-result-item,
.workspace-context-item,
.workspace-tab {
  border: 0;
  background: transparent;
  text-align: left;
}

.workspace-tree-row {
  width: calc(100% - 8px);
  margin: 0 4px 2px;
  min-height: 28px;
  padding-right: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dim);
  font-size: 0.78rem;
  cursor: pointer;
  user-select: none;
}

.workspace-tree-row.folder {
  color: var(--text);
  font-weight: 600;
}

.workspace-tree-row.active {
  color: #dbe7ff;
  background: rgba(74, 142, 255, 0.16);
}

.workspace-tree-row.selected {
  background: rgba(255, 255, 255, 0.03);
}

.workspace-tree-row.drop-target {
  background: rgba(74, 142, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(74, 142, 255, 0.26);
}

.workspace-tree-row.dragging {
  opacity: 0.45;
}

.workspace-tree-caret {
  width: 12px;
  color: var(--muted);
  text-align: center;
  flex-shrink: 0;
}

.workspace-item-icon {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  flex-shrink: 0;
}

.workspace-item-icon svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.workspace-tree-name,
.workspace-result-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.workspace-inline-input {
  flex: 1;
  min-width: 0;
  background: var(--raised);
  border: 1px solid var(--accent);
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 0.78rem;
  font-family: inherit;
  color: var(--text);
  outline: none;
  height: 22px;
}

.workspace-tree-badge {
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--muted);
  font-size: 0.64rem;
  flex-shrink: 0;
}

.workspace-result-group {
  margin-bottom: 8px;
}

.workspace-result-item {
  width: calc(100% - 8px);
  margin: 0 4px 2px;
  min-height: 28px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px;
  color: var(--dim);
  font-size: 0.76rem;
  cursor: pointer;
}

.workspace-result-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.workspace-result-item.heading-result {
  align-items: flex-start;
  padding-top: 6px;
  padding-bottom: 6px;
}

.workspace-result-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.workspace-result-meta {
  color: var(--muted);
  font-size: 0.68rem;
}

.workspace-heading-badge {
  width: 14px;
  color: var(--muted);
  font-size: 0.74rem;
  font-weight: 700;
  flex-shrink: 0;
}

.workspace-empty-state {
  padding: 8px 12px;
  color: var(--muted);
  font-size: 0.76rem;
}

.workspace-context-menu {
  position: absolute;
  width: 188px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #121821;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
  overflow: hidden;
  z-index: 20;
}

.workspace-context-item {
  width: 100%;
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--dim);
  font-size: 0.76rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(35, 40, 54, 0.7);
}

.workspace-context-item:last-child {
  border-bottom: 0;
}

.workspace-context-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.workspace-tabs {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 34px;
  padding: 0 10px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  flex-shrink: 0;
}

.workspace-tab {
  max-width: 190px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-bottom: none;
  color: var(--muted);
  border-radius: 0;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.77rem;
  cursor: pointer;
  flex-shrink: 0;
}

.workspace-tab.active {
  background: var(--bg);
  border-color: var(--border);
  color: var(--text);
}

.workspace-tab-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--orange);
  flex-shrink: 0;
}

.workspace-tab-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-tab-close {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  flex-shrink: 0;
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
