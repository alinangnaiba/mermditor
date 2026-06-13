import { salvageWorkspaceData } from '../../app/utils/storageParsers'
import { createDefaultWorkspace } from '../../app/utils/workspace'

describe('workspace salvage parser', () => {
  it('returns ok for valid workspace data', () => {
    const workspace = createDefaultWorkspace('# Hello', 'notes')

    const result = salvageWorkspaceData(JSON.stringify(workspace))

    expect(result).toEqual({
      workspace,
      status: 'ok',
      droppedItems: [],
    })
  })

  it('keeps readable files and drops files with non-string content', () => {
    const workspace = createDefaultWorkspace('# Good', 'good')
    workspace.root.children.push({
      id: 'broken-file',
      type: 'file',
      name: 'broken.md',
      content: 42,
    } as never)

    const result = salvageWorkspaceData(JSON.stringify(workspace))

    expect(result.status).toBe('salvaged')
    expect(result.workspace?.root.children).toHaveLength(1)
    expect(result.workspace?.root.children[0]?.id).toBe(workspace.activeFileId)
    expect(result.droppedItems).toHaveLength(1)
  })

  it('repairs a non-string active file id to the first surviving file', () => {
    const workspace = createDefaultWorkspace('# Good', 'good')
    const expectedActiveFileId = workspace.activeFileId
    const rawWorkspace = JSON.stringify({
      ...workspace,
      activeFileId: null,
    })

    const result = salvageWorkspaceData(rawWorkspace)

    expect(result.status).toBe('salvaged')
    expect(result.workspace?.activeFileId).toBe(expectedActiveFileId)
    expect(result.workspace?.openFileIds).toEqual([expectedActiveFileId])
  })

  it('repairs dented folders while preserving readable nested files', () => {
    const rawWorkspace = JSON.stringify({
      root: {
        id: 'workspace-root',
        type: 'folder',
        name: 'Workspace',
        children: [
          {
            id: 'folder-1',
            type: 'folder',
            name: null,
            children: [
              {
                id: 'nested-file',
                type: 'file',
                name: 'nested.md',
                content: '# Nested',
              },
            ],
          },
        ],
      },
      activeFileId: 'nested-file',
      openFileIds: ['nested-file'],
    })

    const result = salvageWorkspaceData(rawWorkspace)
    const folder = result.workspace?.root.children[0]

    expect(result.status).toBe('salvaged')
    expect(folder?.type).toBe('folder')
    expect(folder?.name).toBe('New Folder')
    expect(folder?.children[0]?.id).toBe('nested-file')
  })

  it('preserves nested files when a folder type is corrupted', () => {
    const rawWorkspace = JSON.stringify({
      root: {
        id: 'workspace-root',
        type: 'folder',
        name: 'Workspace',
        children: [
          {
            id: 'folder-1',
            type: 'file',
            name: 'Notes',
            children: [
              {
                id: 'nested-file',
                type: 'file',
                name: 'nested.md',
                content: '# Nested',
              },
            ],
          },
        ],
      },
      activeFileId: 'nested-file',
      openFileIds: ['nested-file'],
    })

    const result = salvageWorkspaceData(rawWorkspace)
    const folder = result.workspace?.root.children[0]

    expect(result.status).toBe('salvaged')
    expect(folder?.type).toBe('folder')
    expect(folder?.children[0]?.id).toBe('nested-file')
  })

  it('returns unrecoverable for malformed JSON', () => {
    const result = salvageWorkspaceData('{"broken"')

    expect(result).toEqual({
      workspace: null,
      status: 'unrecoverable',
      droppedItems: [],
    })
  })

  it('returns unrecoverable when all files are invalid', () => {
    const rawWorkspace = JSON.stringify({
      root: {
        id: 'workspace-root',
        type: 'folder',
        name: 'Workspace',
        children: [
          {
            id: 'broken-file',
            type: 'file',
            name: 'broken.md',
            content: 42,
          },
        ],
      },
      activeFileId: 'broken-file',
      openFileIds: ['broken-file'],
    })

    const result = salvageWorkspaceData(rawWorkspace)

    expect(result.workspace).toBeNull()
    expect(result.status).toBe('unrecoverable')
  })
})
