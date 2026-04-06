import { useEditorPersistence, LEGACY_CONTENT_STORAGE_KEY, WORKSPACE_STORAGE_KEY } from '../../app/composables/useEditorPersistence'
import { useRecentEmojis } from '../../app/composables/useRecentEmojis'
import { createDefaultWorkspace } from '../../app/utils/workspace'

describe('persistence guards', () => {
  it('clears malformed workspace storage and keeps legacy content', () => {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, '{"broken"')
    localStorage.setItem(LEGACY_CONTENT_STORAGE_KEY, '# Legacy')

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()

    expect(snapshot.workspace).toBeNull()
    expect(snapshot.legacyContent).toBe('# Legacy')
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toBeNull()
  })

  it('clears invalid workspace snapshots that fail structural validation', () => {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify({ nope: true }))

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()

    expect(snapshot.workspace).toBeNull()
    expect(localStorage.getItem(WORKSPACE_STORAGE_KEY)).toBeNull()
  })

  it('accepts valid workspace snapshots', () => {
    const workspace = createDefaultWorkspace('# Hello', 'notes')
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))

    const { loadWorkspaceSnapshot } = useEditorPersistence()
    const snapshot = loadWorkspaceSnapshot()

    expect(snapshot.workspace).toEqual(workspace)
  })

  it('clears invalid recent emoji storage', () => {
    localStorage.setItem('mermditor-recent-emojis', '{"rocket":true}')

    const { recentEmojis, loadRecentEmojis } = useRecentEmojis()
    loadRecentEmojis()

    expect(recentEmojis.value).toEqual([])
    expect(localStorage.getItem('mermditor-recent-emojis')).toBeNull()
  })
})
