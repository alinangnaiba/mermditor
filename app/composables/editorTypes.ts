export type EditorTheme = 'dark' | 'light'

export type ContextMenuTargetType = 'root' | 'folder' | 'file' | null

export type ContextMenuActionId =
  | 'new-file'
  | 'new-folder'
  | 'rename'
  | 'duplicate'
  | 'move'
  | 'delete'

export interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  targetId: string | null
  targetType: ContextMenuTargetType
}

export interface MoveModalState {
  visible: boolean
  targetId: string | null
  itemName: string
  initialFolderId: string
  errorText: string
}

export interface DeleteItemModalState {
  visible: boolean
  targetId: string | null
  title: string
  message: string
}

export interface DragState {
  draggedItemId: string | null
  targetFolderId: string | null
}

export interface InlineEditState {
  type: 'rename' | 'new-file' | 'new-folder' | null
  itemId: string | null
  parentFolderId: string | null
  depth: number
  value: string
}
