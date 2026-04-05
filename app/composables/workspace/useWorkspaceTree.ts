import { computed } from 'vue'
import type { Ref } from 'vue'
import type { InlineEditState } from '../editorTypes'
import {
  buildWorkspaceSearchIndex,
  findWorkspaceFile,
  flattenWorkspaceTree,
  getWorkspaceItemPath,
  searchWorkspaceIndex,
} from '../../utils/workspace'
import type { WorkspaceData, WorkspaceFile, WorkspaceTreeRow } from '../../utils/workspace'

interface UseWorkspaceTreeOptions {
  workspace: Ref<WorkspaceData>
  searchQuery: Ref<string>
  expandedFolderIds: Ref<string[]>
  inlineEdit: Ref<InlineEditState>
}

export const useWorkspaceTree = ({
  workspace,
  searchQuery,
  expandedFolderIds,
  inlineEdit,
}: UseWorkspaceTreeOptions) => {
  const activeFile = computed<WorkspaceFile | null>(() => {
    return findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)
  })

  const activeFilePath = computed(() => {
    return getWorkspaceItemPath(workspace.value.root, workspace.value.activeFileId).join(' / ')
  })

  const openFileIds = computed(() => workspace.value.openFileIds)

  const workspaceTreeRows = computed(() => {
    return flattenWorkspaceTree(workspace.value.root, new Set(expandedFolderIds.value))
  })

  const workspaceSearchIndex = computed(() => buildWorkspaceSearchIndex(workspace.value.root))

  const displayTreeRows = computed((): WorkspaceTreeRow[] => {
    const rows = workspaceTreeRows.value
    const { type, parentFolderId, depth } = inlineEdit.value

    if (type !== 'new-file' && type !== 'new-folder') return rows
    if (!parentFolderId) return rows

    const pendingItem: WorkspaceTreeRow =
      type === 'new-folder'
        ? {
            item: { id: '__pending__', type: 'folder', name: '', children: [] },
            depth,
            parentFolderId,
          }
        : {
            item: { id: '__pending__', type: 'file', name: '', content: '' },
            depth,
            parentFolderId,
          }

    if (parentFolderId === workspace.value.root.id) {
      return [pendingItem, ...rows]
    }

    const parentIndex = rows.findIndex((row) => row.item.id === parentFolderId)
    if (parentIndex === -1) return [pendingItem, ...rows]

    const result = [...rows]
    result.splice(parentIndex + 1, 0, pendingItem)
    return result
  })

  const workspaceSearchResults = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase()
    if (!normalizedQuery) {
      return { files: [], headings: [] }
    }

    return searchWorkspaceIndex(workspaceSearchIndex.value, normalizedQuery)
  })

  const setSearchQuery = (value: string): void => {
    searchQuery.value = value
  }

  const getFileName = (fileId: string): string => {
    return findWorkspaceFile(workspace.value.root, fileId)?.name ?? 'untitled.md'
  }

  const toggleFolder = (folderId: string): void => {
    expandedFolderIds.value = expandedFolderIds.value.includes(folderId)
      ? expandedFolderIds.value.filter((id) => id !== folderId)
      : [...expandedFolderIds.value, folderId]
  }

  return {
    activeFile,
    activeFilePath,
    openFileIds,
    workspaceTreeRows,
    displayTreeRows,
    workspaceSearchResults,
    setSearchQuery,
    getFileName,
    toggleFolder,
  }
}
