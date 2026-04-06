import { computed, ref } from 'vue'
import { useWorkspaceInlineEdit } from '../../app/composables/workspace/useWorkspaceInlineEdit'
import {
  createDefaultWorkspace,
  createWorkspaceFile,
  type WorkspaceItem,
} from '../../app/utils/workspace'

const createInlineEditHarness = () => {
  const workspace = ref(createDefaultWorkspace('Seed content', 'seed'))
  const inlineEdit = ref({
    type: null,
    itemId: null,
    parentFolderId: null,
    depth: 0,
    value: '',
  })
  const closeContextMenu = vi.fn()
  const createFileInFolder = vi.fn()
  const createFolderInFolder = vi.fn()
  const renameWorkspaceItem = vi.fn(() => true)

  const inlineEditApi = useWorkspaceInlineEdit({
    inlineEdit,
    workspace,
    expandedFolderIds: ref<string[]>([]),
    workspaceTreeRows: computed(() => []),
    closeContextMenu,
    createFileInFolder,
    createFolderInFolder,
    renameWorkspaceItem,
  })

  return {
    workspace,
    inlineEdit,
    closeContextMenu,
    createFileInFolder,
    createFolderInFolder,
    renameWorkspaceItem,
    ...inlineEditApi,
  }
}

describe('workspace inline edit', () => {
  it('keeps rename mode active when the submitted name conflicts with a sibling', () => {
    const harness = createInlineEditHarness()
    const existingFile = createWorkspaceFile('notes')
    harness.workspace.value.root.children.push(existingFile)

    const targetItem = harness.workspace.value.root.children[0] as WorkspaceItem
    harness.startInlineRename(targetItem)
    harness.updateInlineEditValue(existingFile.name)

    harness.commitInlineEdit()

    expect(harness.renameWorkspaceItem).not.toHaveBeenCalled()
    expect(harness.inlineEdit.value.itemId).toBe(targetItem.id)
    expect(harness.inlineEdit.value.type).toBe('rename')
    expect(harness.inlineEdit.value.value).toBe(existingFile.name)
  })

  it('keeps rename mode active when the submitted name is blank', () => {
    const harness = createInlineEditHarness()
    const targetItem = harness.workspace.value.root.children[0] as WorkspaceItem

    harness.startInlineRename(targetItem)
    harness.updateInlineEditValue('   ')
    harness.commitInlineEdit()

    expect(harness.renameWorkspaceItem).not.toHaveBeenCalled()
    expect(harness.inlineEdit.value.itemId).toBe(targetItem.id)
    expect(harness.inlineEdit.value.type).toBe('rename')
  })

  it('closes the context menu when inline rename starts and clears state on success', () => {
    const harness = createInlineEditHarness()
    const targetItem = harness.workspace.value.root.children[0] as WorkspaceItem

    harness.startInlineRename(targetItem)
    expect(harness.closeContextMenu).toHaveBeenCalledTimes(1)

    harness.updateInlineEditValue('renamed')
    harness.commitInlineEdit()

    expect(harness.renameWorkspaceItem).toHaveBeenCalledWith(targetItem.id, 'renamed.md')
    expect(harness.inlineEdit.value.type).toBeNull()
    expect(harness.inlineEdit.value.itemId).toBeNull()
  })
})
