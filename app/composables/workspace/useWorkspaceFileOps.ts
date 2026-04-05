import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { DeleteItemModalState, MoveModalState } from '../editorTypes'
import {
  createDefaultWorkspace,
  createWorkspaceFile,
  createWorkspaceFolder,
  findFirstWorkspaceFile,
  findWorkspaceFile,
  findWorkspaceItem,
  normalizeFileName,
  normalizeFolderName,
} from '../../utils/workspace'
import type { WorkspaceData, WorkspaceFile, WorkspaceFolder } from '../../utils/workspace'
import { logError } from '../../../utils/logging'
import { buildUniqueItemName, collectExpandedFolders, collectFileIds } from './workspaceHelpers'

interface UseWorkspaceFileOpsOptions {
  workspace: Ref<WorkspaceData>
  content: Ref<string>
  expandedFolderIds: Ref<string[]>
  replaceEditorContent: (nextContent: string, lineNumber?: number) => void
  persistWorkspaceIfEnabled: (workspace: WorkspaceData, content: string) => void
  closeContextMenu: () => void
}

export const useWorkspaceFileOps = ({
  workspace,
  content,
  expandedFolderIds,
  replaceEditorContent,
  persistWorkspaceIfEnabled,
  closeContextMenu,
}: UseWorkspaceFileOpsOptions) => {
  const moveModal = ref<MoveModalState>({
    visible: false,
    targetId: null,
    itemName: '',
    initialFolderId: '',
    errorText: '',
  })

  const deleteItemModal = ref<DeleteItemModalState>({
    visible: false,
    targetId: null,
    title: '',
    message: '',
  })

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

  const hydrateWorkspace = (
    savedWorkspace: WorkspaceData | null,
    legacyContent: string = ''
  ): void => {
    try {
      workspace.value = savedWorkspace ?? createDefaultWorkspace(legacyContent)

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
      replaceEditorContent(findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)?.content ?? '')
    } catch (error) {
      logError('workspace.hydrate', error)
      workspace.value = createDefaultWorkspace()
      expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
      replaceEditorContent(findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)?.content ?? '')
    }
  }

  const syncActiveFileContent = (newContent: string): void => {
    const activeFile = findWorkspaceFile(workspace.value.root, workspace.value.activeFileId)
    if (activeFile && activeFile.content !== newContent) {
      activeFile.content = newContent
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
    closeContextMenu()
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

    persistWorkspaceIfEnabled(workspace.value, content.value)
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
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
    persistWorkspaceIfEnabled(workspace.value, content.value)
    return true
  }

  const moveDestinationOptions = computed<Array<{ id: string; label: string; disabled?: boolean }>>(
    () => {
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
    }
  )

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
    if (!targetId) return

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
    workspace.value.openFileIds = workspace.value.openFileIds.filter(
      (fileId) => !removedFileIds.has(fileId)
    )
    expandedFolderIds.value = expandedFolderIds.value.filter(
      (folderId) => !removedFolderIds.has(folderId)
    )

    syncWorkspaceAfterTreeChange(workspace.value.openFileIds[0])
    persistWorkspaceIfEnabled(workspace.value, content.value)
    closeDeleteItemModal()
  }

  const importMarkdownIntoWorkspace = (filename: string, importedContent: string): void => {
    createFileInFolder(workspace.value.root.id, filename, importedContent, true)
  }

  return {
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
  }
}
