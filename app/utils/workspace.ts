export interface WorkspaceFile {
  id: string
  type: 'file'
  name: string
  content: string
}

export interface WorkspaceFolder {
  id: string
  type: 'folder'
  name: string
  children: WorkspaceItem[]
}

export type WorkspaceItem = WorkspaceFile | WorkspaceFolder

export interface WorkspaceData {
  root: WorkspaceFolder
  activeFileId: string
  openFileIds: string[]
}

export interface WorkspaceTreeRow {
  item: WorkspaceItem
  depth: number
  parentFolderId: string
}

export interface WorkspaceHeadingResult {
  fileId: string
  fileName: string
  heading: string
  line: number
}

export interface WorkspaceSearchResults {
  files: WorkspaceFile[]
  headings: WorkspaceHeadingResult[]
}

const createId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export const normalizeFileName = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) return 'untitled.md'
  return trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`
}

export const normalizeFolderName = (name: string): string => {
  const trimmed = name.trim()
  return trimmed || 'New Folder'
}

export const createWorkspaceFile = (name: string, content: string = ''): WorkspaceFile => {
  return {
    id: createId(),
    type: 'file',
    name: normalizeFileName(name),
    content,
  }
}

export const createWorkspaceFolder = (name: string, children: WorkspaceItem[] = []): WorkspaceFolder => {
  return {
    id: createId(),
    type: 'folder',
    name: normalizeFolderName(name),
    children,
  }
}

export const createDefaultWorkspace = (
  initialContent: string = '',
  initialFilename: string = 'untitled.md'
): WorkspaceData => {
  const file = createWorkspaceFile(initialFilename, initialContent)

  return {
    root: {
      id: 'workspace-root',
      type: 'folder',
      name: 'Workspace',
      children: [file],
    },
    activeFileId: file.id,
    openFileIds: [file.id],
  }
}

export const findWorkspaceItem = (
  folder: WorkspaceFolder,
  itemId: string,
  parentFolder: WorkspaceFolder | null = null
): { item: WorkspaceItem; parentFolder: WorkspaceFolder | null } | null => {
  if (folder.id === itemId) {
    return { item: folder, parentFolder }
  }

  for (const child of folder.children) {
    if (child.id === itemId) {
      return { item: child, parentFolder: folder }
    }

    if (child.type === 'folder') {
      const nested = findWorkspaceItem(child, itemId, folder)
      if (nested) return nested
    }
  }

  return null
}

export const findWorkspaceFile = (root: WorkspaceFolder, fileId: string): WorkspaceFile | null => {
  const found = findWorkspaceItem(root, fileId)
  return found?.item.type === 'file' ? found.item : null
}

export const findFirstWorkspaceFile = (folder: WorkspaceFolder): WorkspaceFile | null => {
  for (const child of folder.children) {
    if (child.type === 'file') {
      return child
    }

    const nested = findFirstWorkspaceFile(child)
    if (nested) {
      return nested
    }
  }

  return null
}

export const flattenWorkspaceTree = (
  folder: WorkspaceFolder,
  expandedFolderIds: Set<string>,
  depth: number = 0
): WorkspaceTreeRow[] => {
  const rows: WorkspaceTreeRow[] = []

  for (const child of folder.children) {
    rows.push({
      item: child,
      depth,
      parentFolderId: folder.id,
    })

    if (child.type === 'folder' && expandedFolderIds.has(child.id)) {
      rows.push(...flattenWorkspaceTree(child, expandedFolderIds, depth + 1))
    }
  }

  return rows
}

export const getWorkspaceItemPath = (root: WorkspaceFolder, itemId: string): string[] => {
  const visit = (folder: WorkspaceFolder, path: string[]): string[] | null => {
    if (folder.id === itemId) {
      return [...path, folder.name]
    }

    for (const child of folder.children) {
      if (child.id === itemId) {
        return [...path, folder.name, child.name]
      }

      if (child.type === 'folder') {
        const nested = visit(child, [...path, folder.name])
        if (nested) return nested
      }
    }

    return null
  }

  return visit(root, []) ?? [root.name]
}

export const extractMarkdownHeadings = (content: string): Array<{ heading: string; line: number }> => {
  const headings: Array<{ heading: string; line: number }> = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const match = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*$/)
    if (match) {
      headings.push({
        heading: match[2] ?? '',
        line: index + 1,
      })
    }
  })

  return headings
}

export const searchWorkspace = (root: WorkspaceFolder, query: string): WorkspaceSearchResults => {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return { files: [], headings: [] }
  }

  const files: WorkspaceFile[] = []
  const headings: WorkspaceHeadingResult[] = []

  const visit = (folder: WorkspaceFolder): void => {
    for (const child of folder.children) {
      if (child.type === 'file') {
        if (child.name.toLowerCase().includes(normalizedQuery)) {
          files.push(child)
        }

        for (const heading of extractMarkdownHeadings(child.content)) {
          if (heading.heading.toLowerCase().includes(normalizedQuery)) {
            headings.push({
              fileId: child.id,
              fileName: child.name,
              heading: heading.heading,
              line: heading.line,
            })
          }
        }
      } else {
        visit(child)
      }
    }
  }

  visit(root)

  return { files, headings }
}
