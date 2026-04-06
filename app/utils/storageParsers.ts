import type { EmojiItem } from '../composables/useRecentEmojis'
import type { WorkspaceData, WorkspaceFile, WorkspaceFolder, WorkspaceItem } from './workspace'

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
