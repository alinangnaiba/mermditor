import {
  useEditorPersistence,
  LEGACY_CONTENT_STORAGE_KEY,
  WORKSPACE_BACKUP_PREFIX,
  WORKSPACE_STORAGE_KEY,
} from '../../app/composables/useEditorPersistence'
import { useRecentEmojis } from '../../app/composables/useRecentEmojis'
import { createDefaultWorkspace } from '../../app/utils/workspace'

describe('persistence guards', () => {
  it('backs up malformed workspace storage and keeps legacy content', () => {
    const rawWorkspace = '{"broken"'
    localStorage.setItem(WORKSPACE_STORAGE_KEY, rawWorkspace)
    localStorage.setItem(LEGACY_CONTENT_STORAGE_KEY, '# Legacy')

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(WORKSPACE_BACKUP_PREFIX)
    )

    expect(snapshot.workspace).toBeNull()
    expect(snapshot.legacyContent).toBe('# Legacy')
    expect(snapshot.recovery?.status).toBe('unrecoverable')
    expect(snapshot.recovery?.backupKey).toBe(backupKeys[0])
    expect(backupKeys).toHaveLength(1)
    expect(localStorage.getItem(backupKeys[0]!)).toBe(rawWorkspace)
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toBeNull()
  })

  it('backs up unrecoverable workspace snapshots that fail structural validation', () => {
    const rawWorkspace = JSON.stringify({ nope: true })
    localStorage.setItem(WORKSPACE_STORAGE_KEY, rawWorkspace)

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(WORKSPACE_BACKUP_PREFIX)
    )

    expect(snapshot.workspace).toBeNull()
    expect(snapshot.recovery?.status).toBe('unrecoverable')
    expect(snapshot.recovery?.backupKey).toBe(backupKeys[0])
    expect(backupKeys).toHaveLength(1)
    expect(localStorage.getItem(backupKeys[0]!)).toBe(rawWorkspace)
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toBeNull()
  })

  it('backs up and writes cleaned salvaged workspace snapshots to the main key', () => {
    const workspace = createDefaultWorkspace('# Good', 'good')
    workspace.root.children.push({
      id: 'broken-file',
      type: 'file',
      name: 'broken.md',
      content: 42,
    } as never)
    const rawWorkspace = JSON.stringify(workspace)
    localStorage.setItem(WORKSPACE_STORAGE_KEY, rawWorkspace)

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()
    const backupKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith(WORKSPACE_BACKUP_PREFIX)
    )

    expect(snapshot.workspace?.root.children).toHaveLength(1)
    expect(snapshot.recovery?.status).toBe('salvaged')
    expect(snapshot.recovery?.droppedItems).toHaveLength(1)
    expect(snapshot.recovery?.backupKey).toBe(backupKeys[0])
    expect(localStorage.getItem(backupKeys[0]!)).toBe(rawWorkspace)
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).not.toBe(rawWorkspace)
    expect(JSON.parse(localStorage.getItem(WORKSPACE_STORAGE_KEY)!)).toEqual(snapshot.workspace)
  })

  it('accepts valid workspace snapshots', () => {
    const workspace = createDefaultWorkspace('# Hello', 'notes')
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()

    expect(snapshot.workspace).toEqual(workspace)
    expect(snapshot.recovery).toBeNull()
  })

  it('clears invalid recent emoji storage', () => {
    localStorage.setItem('mermditor-recent-emojis', '{"rocket":true}')

    const { recentEmojis, loadRecentEmojis } = useRecentEmojis()
    loadRecentEmojis()

    expect(recentEmojis.value).toEqual([])
    expect(localStorage.getItem('mermditor-recent-emojis')).toBeNull()
  })
})
