import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ContextMenuActionId, InlineEditState } from './editorTypes'
import { createDefaultWorkspace } from '../utils/workspace'
import type { WorkspaceData, WorkspaceItem } from '../utils/workspace'
import { useWorkspaceContextMenu } from './workspace/useWorkspaceContextMenu'
import { useWorkspaceDnd } from './workspace/useWorkspaceDnd'
import { useWorkspaceFileOps } from './workspace/useWorkspaceFileOps'
import { useWorkspaceInlineEdit } from './workspace/useWorkspaceInlineEdit'
import { useWorkspaceTree } from './workspace/useWorkspaceTree'
import { collectExpandedFolders } from './workspace/workspaceHelpers'

interface UseWorkspaceControllerOptions {
  content: Ref<string>
  replaceEditorContent: (nextContent: string, lineNumber?: number) => void
  persistWorkspaceIfEnabled: (workspace: WorkspaceData, content: string) => void
}

export const useWorkspaceController = ({
  content,
  replaceEditorContent,
  persistWorkspaceIfEnabled,
}: UseWorkspaceControllerOptions) => {
  const workspace = ref<WorkspaceData>(createDefaultWorkspace())
  const searchQuery = ref('')
  const expandedFolderIds = ref<string[]>([])

  const { contextMenu, contextMenuActions, openContextMenu, closeContextMenu } =
    useWorkspaceContextMenu({
      workspace,
    })

  const inlineEdit = ref<InlineEditState>({
    type: null,
    itemId: null,
    parentFolderId: null,
    depth: 0,
    value: '',
  })

  const {
    activeFile,
    activeFilePath,
    openFileIds,
    workspaceTreeRows,
    displayTreeRows,
    workspaceSearchResults,
    setSearchQuery,
    getFileName,
    toggleFolder,
  } = useWorkspaceTree({
    workspace,
    searchQuery,
    expandedFolderIds,
    inlineEdit,
  })

  const {
    moveModal,
    moveDestinationOptions,
    deleteItemModal,
    hydrateWorkspace,
    syncActiveFileContent,
    openFile,
    closeTab,
    createFileInFolder,
    createFolderInFolder,
    renameWorkspaceItem,
    duplicateWorkspaceFile,
    canMoveItemToFolder,
    moveWorkspaceItem,
    openMoveModal,
    closeMoveModal,
    submitMoveModal,
    openDeleteItemModal,
    closeDeleteItemModal,
    confirmDeleteWorkspaceItem,
    importMarkdownIntoWorkspace,
  } = useWorkspaceFileOps({
    workspace,
    content,
    expandedFolderIds,
    replaceEditorContent,
    persistWorkspaceIfEnabled,
    closeContextMenu,
  })

  const {
    updateInlineEditValue,
    cancelInlineEdit,
    commitInlineEdit,
    startInlineRename,
    startInlineNewItem,
  } = useWorkspaceInlineEdit({
    inlineEdit,
    workspace,
    expandedFolderIds,
    workspaceTreeRows,
    closeContextMenu,
    createFileInFolder: (folderId, fileName) => {
      createFileInFolder(folderId, fileName)
    },
    createFolderInFolder: (folderId, folderName) => {
      createFolderInFolder(folderId, folderName)
    },
    renameWorkspaceItem,
  })

  const {
    dragState,
    handleDragStart,
    handleItemDragOver,
    handleItemDrop,
    handleRootDragOver,
    handleRootDrop,
    handleDragEnd,
  } = useWorkspaceDnd({
    workspace,
    canMoveItemToFolder,
    moveWorkspaceItem,
  })

  const handleWorkspaceRowClick = (item: WorkspaceItem): void => {
    if (item.type === 'folder') {
      toggleFolder(item.id)
      return
    }

    openFile(item.id)
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
      const target = workspaceTreeRows.value.find((row) => row.item.id === targetId)?.item
      if (target) {
        startInlineRename(target)
      }
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

  const resetWorkspace = (): void => {
    workspace.value = createDefaultWorkspace()
    expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
    searchQuery.value = ''
    closeContextMenu()
    closeMoveModal()
    closeDeleteItemModal()
    cancelInlineEdit()
    handleDragEnd()
    replaceEditorContent(activeFile.value?.content ?? '')
  }

  return {
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
  }
}
