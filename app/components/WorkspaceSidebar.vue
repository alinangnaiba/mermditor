<template>
  <aside
    v-if="!isMobile"
    ref="workspacePaneRef"
    class="workspace-pane"
    :style="{ width: `${customWorkspaceWidth}px` }"
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </button>
      </div>
    </div>

    <div class="workspace-search-wrap">
      <input
        :value="searchQuery"
        type="text"
        class="workspace-search-input"
        placeholder="Search files and headings"
        @input="onSearchQueryInput"
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
            @click="openFile(heading.fileId, heading.line)"
          >
            <span class="workspace-heading-badge">#</span>
            <span class="workspace-result-body">
              <span class="workspace-result-text">{{ heading.heading }}</span>
              <span class="workspace-result-meta">{{ heading.fileName }}</span>
            </span>
          </button>
        </div>

        <div
          v-if="workspaceSearchResults.files.length === 0 && workspaceSearchResults.headings.length === 0"
          class="workspace-empty-state"
        >
          No files or headings match "{{ searchQuery }}".
        </div>
      </template>

      <template v-else>
        <div class="workspace-section-title">Explorer</div>

        <template v-for="row in displayTreeRows" :key="row.item.id">
          <div
            v-if="inlineEdit.itemId === row.item.id"
            ref="inlineEditRowRef"
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
              ref="inlineInputRef"
              :value="inlineEdit.value"
              class="workspace-inline-input"
              @input="onInlineInput"
              @keydown.enter.prevent="commitInlineEdit"
              @keydown.escape.prevent="cancelInlineEdit"
              @blur="cancelInlineEdit"
              @click.stop
              @mousedown.stop
              @dblclick.stop
            />
          </div>

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
</template>

<script setup lang="ts">
  import { nextTick, onUnmounted, ref, watch } from 'vue'
  import type {
    ContextMenuActionId,
    ContextMenuState,
    DragState,
    InlineEditState,
  } from '../composables/editorTypes'
  import type {
    WorkspaceData,
    WorkspaceItem,
    WorkspaceSearchResults,
    WorkspaceTreeRow,
  } from '../utils/workspace'

  /* eslint-disable no-unused-vars */
  interface Props {
    isMobile: boolean
    customWorkspaceWidth: number
    workspace: WorkspaceData
    searchQuery: string
    workspaceSearchResults: WorkspaceSearchResults
    displayTreeRows: WorkspaceTreeRow[]
    expandedFolderIds: string[]
    openFileIds: string[]
    contextMenu: ContextMenuState
    contextMenuActions: Array<{ id: ContextMenuActionId; label: string }>
    dragState: DragState
    inlineEdit: InlineEditState
    setSearchQuery: (value: string) => void
    updateInlineEditValue: (value: string) => void
    startInlineNewItem: (type: 'new-file' | 'new-folder', parentFolderId: string) => void
    openFile: (fileId: string, lineNumber?: number) => void
    handleWorkspaceRowClick: (item: WorkspaceItem) => void
    startInlineRename: (item: WorkspaceItem) => void
    openContextMenu: (
      targetType: 'root' | 'folder' | 'file' | null,
      targetId: string,
      x: number,
      y: number
    ) => void
    handleRootDragOver: (event: DragEvent) => void
    handleRootDrop: () => void
    handleDragStart: (event: DragEvent, item: WorkspaceItem) => void
    handleItemDragOver: (event: DragEvent, item: WorkspaceItem) => void
    handleItemDrop: (event: DragEvent, item: WorkspaceItem) => void
    handleDragEnd: () => void
    runContextMenuAction: (actionId: ContextMenuActionId) => void
    commitInlineEdit: () => void
    cancelInlineEdit: () => void
  }
  /* eslint-enable no-unused-vars */

  const props = defineProps<Props>()

  const workspacePaneRef = ref<HTMLElement | null>(null)
  const inlineInputRef = ref<HTMLInputElement | null>(null)
  const inlineEditRowRef = ref<HTMLElement | null>(null)

  const isInlineEditTarget = (target: EventTarget | null): boolean => {
    const node = target instanceof Node ? target : null
    return !!node && !!inlineEditRowRef.value?.contains(node)
  }

  const cancelInlineEditIfOutside = (target: EventTarget | null): void => {
    if (!props.inlineEdit.itemId || isInlineEditTarget(target)) {
      return
    }

    props.cancelInlineEdit()
  }

  const handleOutsideDocumentClick = (event: MouseEvent): void => {
    cancelInlineEditIfOutside(event.target)
  }

  const handleOutsideFocusIn = (event: FocusEvent): void => {
    cancelInlineEditIfOutside(event.target)
  }

  const attachInlineEditGuards = (): void => {
    document.addEventListener('click', handleOutsideDocumentClick, true)
    document.addEventListener('focusin', handleOutsideFocusIn, true)
  }

  const detachInlineEditGuards = (): void => {
    document.removeEventListener('click', handleOutsideDocumentClick, true)
    document.removeEventListener('focusin', handleOutsideFocusIn, true)
  }

  watch(
    () => props.inlineEdit.itemId,
    async (itemId) => {
      detachInlineEditGuards()

      if (!itemId) return

      await nextTick()
      inlineInputRef.value?.focus()
      if (props.inlineEdit.type === 'rename') {
        inlineInputRef.value?.select()
      }

      attachInlineEditGuards()
    }
  )

  onUnmounted(() => {
    detachInlineEditGuards()
  })

  const resolveContextMenuPosition = (event: MouseEvent, targetType: 'root' | 'folder' | 'file') => {
    const pane = workspacePaneRef.value
    if (!pane) {
      return null
    }

    const bounds = pane.getBoundingClientRect()
    const itemCounts: Record<'root' | 'folder' | 'file', number> = {
      root: 2,
      folder: 5,
      file: 4,
    }
    const estimatedMenuHeight = itemCounts[targetType] * 30 + 2
    const clickY = event.clientY - bounds.top
    const y =
      bounds.height - clickY < estimatedMenuHeight + 8
        ? Math.max(8, clickY - estimatedMenuHeight)
        : Math.max(8, clickY)

    return {
      x: Math.max(8, Math.min(event.clientX - bounds.left, bounds.width - 190)),
      y,
    }
  }

  const openRootContextMenu = (event: MouseEvent): void => {
    const position = resolveContextMenuPosition(event, 'root')
    if (!position) return

    props.openContextMenu('root', props.workspace.root.id, position.x, position.y)
  }

  const openItemContextMenu = (event: MouseEvent, item: WorkspaceItem): void => {
    const position = resolveContextMenuPosition(event, item.type)
    if (!position) return

    props.openContextMenu(item.type, item.id, position.x, position.y)
  }

  const onSearchQueryInput = (event: Event): void => {
    props.setSearchQuery((event.target as HTMLInputElement).value)
  }

  const onInlineInput = (event: Event): void => {
    props.updateInlineEditValue((event.target as HTMLInputElement).value)
  }

  const handleRootDragOver = (event: DragEvent): void => {
    props.handleRootDragOver(event)
  }

  const handleRootDrop = (): void => {
    props.handleRootDrop()
  }

  const handleWorkspaceRowClick = (item: WorkspaceItem): void => {
    if (props.inlineEdit.itemId && props.inlineEdit.itemId !== item.id) {
      props.cancelInlineEdit()
    }

    props.handleWorkspaceRowClick(item)
  }

  const startInlineRename = (item: WorkspaceItem): void => {
    props.startInlineRename(item)
  }

  const handleDragStart = (event: DragEvent, item: WorkspaceItem): void => {
    props.handleDragStart(event, item)
  }

  const handleItemDragOver = (event: DragEvent, item: WorkspaceItem): void => {
    props.handleItemDragOver(event, item)
  }

  const handleItemDrop = (event: DragEvent, item: WorkspaceItem): void => {
    props.handleItemDrop(event, item)
  }

  const handleDragEnd = (): void => {
    props.handleDragEnd()
  }

  const runContextMenuAction = (actionId: ContextMenuActionId): void => {
    props.runContextMenuAction(actionId)
  }

  const commitInlineEdit = (): void => {
    props.commitInlineEdit()
  }

  const cancelInlineEdit = (): void => {
    props.cancelInlineEdit()
  }
</script>
