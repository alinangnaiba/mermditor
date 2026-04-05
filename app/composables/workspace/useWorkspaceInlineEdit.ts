import type { ComputedRef, Ref } from 'vue'
import type { InlineEditState } from '../editorTypes'
import {
  findWorkspaceItem,
  normalizeFileName,
  normalizeFolderName,
} from '../../utils/workspace'
import type {
  WorkspaceData,
  WorkspaceFolder,
  WorkspaceItem,
  WorkspaceTreeRow,
} from '../../utils/workspace'
import { hasSiblingWithName } from './workspaceHelpers'

interface UseWorkspaceInlineEditOptions {
  inlineEdit: Ref<InlineEditState>
  workspace: Ref<WorkspaceData>
  expandedFolderIds: Ref<string[]>
  workspaceTreeRows: ComputedRef<WorkspaceTreeRow[]>
  closeContextMenu: () => void
  createFileInFolder: (folderId: string, fileName: string) => void
  createFolderInFolder: (folderId: string, folderName: string) => void
  renameWorkspaceItem: (itemId: string, nextName: string) => boolean
}

const createInactiveInlineEditState = (): InlineEditState => ({
  type: null,
  itemId: null,
  parentFolderId: null,
  depth: 0,
  value: '',
})

export const useWorkspaceInlineEdit = ({
  inlineEdit,
  workspace,
  expandedFolderIds,
  workspaceTreeRows,
  closeContextMenu,
  createFileInFolder,
  createFolderInFolder,
  renameWorkspaceItem,
}: UseWorkspaceInlineEditOptions) => {
  const updateInlineEditValue = (value: string): void => {
    inlineEdit.value.value = value
  }

  const cancelInlineEdit = (): void => {
    inlineEdit.value = createInactiveInlineEditState()
  }

  const commitInlineEdit = (): void => {
    const { type, itemId, parentFolderId, value } = inlineEdit.value
    if (!type) return

    if (!value.trim()) return

    if (type === 'rename' && itemId) {
      const target = findWorkspaceItem(workspace.value.root, itemId)
      if (!target || !target.parentFolder) return

      const normalizedName =
        target.item.type === 'file' ? normalizeFileName(value) : normalizeFolderName(value)

      if (hasSiblingWithName(target.parentFolder, normalizedName, itemId)) return

      cancelInlineEdit()
      renameWorkspaceItem(itemId, normalizedName)
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
      if (hasSiblingWithName(folder, normalizedName)) return

      cancelInlineEdit()
      createFileInFolder(folder.id, normalizedName)
      return
    }

    const normalizedName = normalizeFolderName(value)
    if (hasSiblingWithName(folder, normalizedName)) return

    cancelInlineEdit()
    createFolderInFolder(folder.id, normalizedName)
  }

  const startInlineRename = (item: WorkspaceItem): void => {
    closeContextMenu()
    inlineEdit.value = {
      type: 'rename',
      itemId: item.id,
      parentFolderId: null,
      depth: 0,
      value: item.name,
    }
  }

  const startInlineNewItem = (type: 'new-file' | 'new-folder', parentFolderId: string): void => {
    if (parentFolderId !== workspace.value.root.id && !expandedFolderIds.value.includes(parentFolderId)) {
      expandedFolderIds.value = [...expandedFolderIds.value, parentFolderId]
    }

    const parentRow = workspaceTreeRows.value.find((row) => row.item.id === parentFolderId)
    const depth =
      parentFolderId === workspace.value.root.id ? 0 : parentRow ? parentRow.depth + 1 : 0

    inlineEdit.value = { type, itemId: '__pending__', parentFolderId, depth, value: '' }
    closeContextMenu()
  }

  return {
    inlineEdit,
    updateInlineEditValue,
    cancelInlineEdit,
    commitInlineEdit,
    startInlineRename,
    startInlineNewItem,
  }
}
