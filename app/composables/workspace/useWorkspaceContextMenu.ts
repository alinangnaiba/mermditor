import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type {
  ContextMenuActionId,
  ContextMenuState,
  ContextMenuTargetType,
} from '../editorTypes'
import { findWorkspaceItem } from '../../utils/workspace'
import type { WorkspaceData } from '../../utils/workspace'

interface UseWorkspaceContextMenuOptions {
  workspace: Ref<WorkspaceData>
}

export const useWorkspaceContextMenu = ({ workspace }: UseWorkspaceContextMenuOptions) => {
  const contextMenu = ref<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
    targetType: null,
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

  return {
    contextMenu,
    contextMenuActions,
    openContextMenu,
    closeContextMenu,
  }
}
