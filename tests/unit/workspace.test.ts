import { ref } from 'vue'
import { useWorkspaceFileOps } from '../../app/composables/workspace/useWorkspaceFileOps'
import { normalizeFileName, createDefaultWorkspace, MAX_FILENAME_LENGTH } from '../../app/utils/workspace'

describe('workspace utilities', () => {
  it('normalizes invalid and reserved file names', () => {
    expect(normalizeFileName('')).toBe('untitled.md')
    expect(normalizeFileName('CON')).toBe('_CON.md')
    expect(normalizeFileName(' draft?.md ')).toBe('draft_.md')
    expect(normalizeFileName(`a`.repeat(MAX_FILENAME_LENGTH + 20))).toHaveLength(MAX_FILENAME_LENGTH)
  })

  it('keeps extracted workspace file operations behavior stable', () => {
    const workspace = ref(createDefaultWorkspace('Seed content', 'seed'))
    const content = ref('Seed content')
    const expandedFolderIds = ref<string[]>([])
    const replaceEditorContent = vi.fn((nextContent: string) => {
      content.value = nextContent
    })
    const persistWorkspaceIfEnabled = vi.fn()
    const closeContextMenu = vi.fn()

    const fileOps = useWorkspaceFileOps({
      workspace,
      content,
      expandedFolderIds,
      replaceEditorContent,
      persistWorkspaceIfEnabled,
      closeContextMenu,
    })

    const folder = fileOps.createFolderInFolder(workspace.value.root.id, 'Project Notes')
    expect(folder?.name).toBe('Project Notes')

    const file = fileOps.createFileInFolder(folder!.id, 'todo')
    expect(file?.name).toBe('todo.md')
    expect(workspace.value.activeFileId).toBe(file?.id)
    expect(expandedFolderIds.value).toContain(folder!.id)

    const moved = fileOps.moveWorkspaceItem(file!.id, workspace.value.root.id)
    expect(moved).toBe(true)
    expect(workspace.value.root.children.some((child) => child.id === file!.id)).toBe(true)
  })
})
