import type { EmojiItem } from '../composables/useRecentEmojis'
import type { WorkspaceData, WorkspaceFile, WorkspaceFolder, WorkspaceItem } from './workspace'
import { DEFAULT_WORKSPACE_FILE_NAME } from './workspace'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
}

const isWorkspaceFile = (value: unknown): value is WorkspaceFile => {
  return (
    isRecord(value) &&
    value.type === 'file' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.content === 'string'
  )
}

const MAX_WORKSPACE_NESTING_DEPTH = 100

const isWorkspaceFolder = (value: unknown, depth = 0): value is WorkspaceFolder => {
  if (depth > MAX_WORKSPACE_NESTING_DEPTH) return false
  return (
    isRecord(value) &&
    value.type === 'folder' &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    Array.isArray(value.children) &&
    value.children.every((child) => isWorkspaceItem(child, depth + 1))
  )
}

const isWorkspaceItem = (value: unknown, depth = 0): value is WorkspaceItem => {
  if (depth > MAX_WORKSPACE_NESTING_DEPTH) return false
  return isWorkspaceFile(value) || isWorkspaceFolder(value, depth)
}

export const isWorkspaceData = (value: unknown): value is WorkspaceData => {
  return (
    isRecord(value) &&
    isWorkspaceFolder(value.root) &&
    typeof value.activeFileId === 'string' &&
    isStringArray(value.openFileIds)
  )
}

export const parseWorkspaceData = (rawValue: string): WorkspaceData | null => {
  try {
    const parsedValue: unknown = JSON.parse(rawValue)
    return isWorkspaceData(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

export interface WorkspaceSalvageResult {
  workspace: WorkspaceData | null
  status: 'ok' | 'salvaged' | 'unrecoverable'
  droppedItems: string[]
}

const createWorkspaceId = (): string => crypto.randomUUID()

const getDroppedItemLabel = (value: unknown): string => {
  if (!isRecord(value)) return 'Unreadable item'
  if (typeof value.name === 'string') return value.name
  if (typeof value.id === 'string') return value.id
  return 'Unnamed item'
}

const getUniqueWorkspaceId = (
  value: unknown,
  usedIds: Set<string>,
  fallbackId: () => string = createWorkspaceId
): string => {
  let id = typeof value === 'string' ? value : fallbackId()

  while (usedIds.has(id)) {
    id = createWorkspaceId()
  }

  usedIds.add(id)
  return id
}

export const salvageWorkspaceData = (rawValue: string): WorkspaceSalvageResult => {
  let parsedValue: unknown

  try {
    parsedValue = JSON.parse(rawValue)
  } catch {
    return { workspace: null, status: 'unrecoverable', droppedItems: [] }
  }

  if (isWorkspaceData(parsedValue)) {
    return { workspace: parsedValue, status: 'ok', droppedItems: [] }
  }

  if (!isRecord(parsedValue)) {
    return { workspace: null, status: 'unrecoverable', droppedItems: [] }
  }

  const droppedItems: string[] = []
  const usedIds = new Set<string>(['workspace-root'])
  const survivingFiles: WorkspaceFile[] = []

  const salvageFile = (value: Record<string, unknown>, depth: number): WorkspaceFile | null => {
    if (depth > MAX_WORKSPACE_NESTING_DEPTH || typeof value.content !== 'string') {
      droppedItems.push(getDroppedItemLabel(value))
      return null
    }

    const file: WorkspaceFile = {
      id: getUniqueWorkspaceId(value.id, usedIds),
      type: 'file',
      name: typeof value.name === 'string' ? value.name : DEFAULT_WORKSPACE_FILE_NAME,
      content: value.content,
    }

    survivingFiles.push(file)
    return file
  }

  const salvageItem = (value: unknown, depth: number): WorkspaceItem | null => {
    if (!isRecord(value)) {
      droppedItems.push(getDroppedItemLabel(value))
      return null
    }

    if (value.type === 'folder' || Array.isArray(value.children)) {
      return salvageFolder(value, depth)
    }

    return salvageFile(value, depth)
  }

  const salvageFolder = (
    value: Record<string, unknown>,
    depth: number,
    root = false
  ): WorkspaceFolder | null => {
    if (depth > MAX_WORKSPACE_NESTING_DEPTH) {
      droppedItems.push(getDroppedItemLabel(value))
      return null
    }

    const children = Array.isArray(value.children)
      ? value.children
          .map((child) => salvageItem(child, depth + 1))
          .filter((child): child is WorkspaceItem => child !== null)
      : []

    return {
      id: root ? 'workspace-root' : getUniqueWorkspaceId(value.id, usedIds),
      type: 'folder',
      name: root ? (typeof value.name === 'string' ? value.name : 'Workspace') : typeof value.name === 'string' ? value.name : 'New Folder',
      children,
    }
  }

  const rootRecord = isRecord(parsedValue.root) ? parsedValue.root : { children: [] }
  const root = salvageFolder(rootRecord, 0, true)

  if (!root || survivingFiles.length === 0) {
    return { workspace: null, status: 'unrecoverable', droppedItems }
  }

  const survivingFileIds = new Set(survivingFiles.map((file) => file.id))
  const activeFileId =
    typeof parsedValue.activeFileId === 'string' && survivingFileIds.has(parsedValue.activeFileId)
      ? parsedValue.activeFileId
      : survivingFiles[0]!.id
  const openFileIds = isStringArray(parsedValue.openFileIds)
    ? parsedValue.openFileIds.filter((id) => survivingFileIds.has(id))
    : []

  return {
    workspace: {
      root,
      activeFileId,
      openFileIds: openFileIds.length > 0 ? openFileIds : [activeFileId],
    },
    status: 'salvaged',
    droppedItems,
  }
}

const isEmojiItem = (value: unknown): value is EmojiItem => {
  return (
    isRecord(value) && typeof value.shortcode === 'string' && typeof value.unicode === 'string'
  )
}

export const parseRecentEmojis = (rawValue: string): EmojiItem[] | null => {
  try {
    const parsedValue: unknown = JSON.parse(rawValue)
    return Array.isArray(parsedValue) && parsedValue.every((entry) => isEmojiItem(entry))
      ? parsedValue
      : null
  } catch {
    return null
  }
}
