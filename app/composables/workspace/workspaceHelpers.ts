import type { WorkspaceFolder } from '../../utils/workspace'

export const collectExpandedFolders = (folder: WorkspaceFolder): string[] => {
  const folderIds: string[] = []

  for (const child of folder.children) {
    if (child.type === 'folder') {
      folderIds.push(child.id)
      folderIds.push(...collectExpandedFolders(child))
    }
  }

  return folderIds
}

export const collectFileIds = (folder: WorkspaceFolder): string[] => {
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

export const hasSiblingWithName = (
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

export const buildUniqueItemName = (
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
