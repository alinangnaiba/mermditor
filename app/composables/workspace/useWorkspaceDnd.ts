import { ref } from 'vue'
import type { Ref } from 'vue'
import type { DragState } from '../editorTypes'
import type { WorkspaceData, WorkspaceItem } from '../../utils/workspace'

interface UseWorkspaceDndOptions {
  workspace: Ref<WorkspaceData>
  canMoveItemToFolder: (itemId: string, folderId: string) => boolean
  moveWorkspaceItem: (itemId: string, folderId: string) => boolean
}

export const useWorkspaceDnd = ({
  workspace,
  canMoveItemToFolder,
  moveWorkspaceItem,
}: UseWorkspaceDndOptions) => {
  const dragState = ref<DragState>({
    draggedItemId: null,
    targetFolderId: null,
  })

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

  const handleDragEnd = (): void => {
    dragState.value.draggedItemId = null
    dragState.value.targetFolderId = null
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

  return {
    dragState,
    handleDragStart,
    handleItemDragOver,
    handleItemDrop,
    handleRootDragOver,
    handleRootDrop,
    handleDragEnd,
  }
}
