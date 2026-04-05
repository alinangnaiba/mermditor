import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type {
  ContextMenuActionId,
  ContextMenuState,
  ContextMenuTargetType,
  DeleteItemModalState,
  DragState,
  InlineEditState,
  MoveModalState,
} from './editorTypes'
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
import type {
  WorkspaceData,
  WorkspaceFile,
  WorkspaceFolder,
  WorkspaceItem,
  WorkspaceTreeRow,
} from '../utils/workspace'

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
  const contextMenu = ref<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
    targetType: null,
  })
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
  const dragState = ref<DragState>({
    draggedItemId: null,
    targetFolderId: null,
  })
  const inlineEdit = ref<InlineEditState>({
    type: null,
    itemId: null,
    parentFolderId: null,
    depth: 0,
    value: '',
  })

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
    return searchWorkspace(workspace.value.root, searchQuery.value)
  })

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
      replaceEditorContent(activeFile.value?.content ?? '')
    } catch (error) {
      console.error('Error hydrating workspace:', error)
      workspace.value = createDefaultWorkspace()
      expandedFolderIds.value = collectExpandedFolders(workspace.value.root)
      replaceEditorContent(activeFile.value?.content ?? '')
    }
  }

  const syncActiveFileContent = (newContent: string): void => {
    if (activeFile.value && activeFile.value.content !== newContent) {
      activeFile.value.content = newContent
    }
  }

  const setSearchQuery = (value: string): void => {
    searchQuery.value = value
  }

  const updateInlineEditValue = (value: string): void => {
    inlineEdit.value.value = value
  }

  const openContextMenu = (
    targetType: ContextMenuTargetType,
    targetId: string,
    x: number,
    y: number
  ): void => {
    contextMenu.value.visible = true
    contextMenu.value.targetType = targetType
    contextMenu.value.targetId = targetId
    contextMenu.value.x = x
    contextMenu.value.y = y
  }

  const closeContextMenu = (): void => {
    contextMenu.value.visible = false
    contextMenu.value.targetId = null
    contextMenu.value.targetType = null
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

  const getFileName = (fileId: string): string => {
    return findWorkspaceFile(workspace.value.root, fileId)?.name ?? 'untitled.md'
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

  const cancelInlineEdit = (): void => {
    inlineEdit.value = { type: null, itemId: null, parentFolderId: null, depth: 0, value: '' }
  }

  const commitInlineEdit = (): void => {
    const { type, itemId, parentFolderId, value } = inlineEdit.value
    if (!type) return

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
      return
    }

    const normalizedName = normalizeFolderName(value)
    if (!hasSiblingWithName(folder, normalizedName)) {
      createFolderInFolder(folder.id, normalizedName)
    }
  }

  const startInlineRename = (item: WorkspaceItem): void => {
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

  const importMarkdownIntoWorkspace = (filename: string, importedContent: string): void => {
    createFileInFolder(workspace.value.root.id, filename, importedContent, true)
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
