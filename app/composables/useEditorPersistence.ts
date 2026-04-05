import { ref } from 'vue'
import type { WorkspaceData } from '../utils/workspace'
import { parseWorkspaceData } from '../utils/storageParsers'
import { logError } from '../../utils/logging'

export const WORKSPACE_STORAGE_KEY = 'mermditor-workspace'
export const LEGACY_CONTENT_STORAGE_KEY = 'mermditor-content'
export const AUTOSAVE_STORAGE_KEY = 'mermditor-autosave'
export const RECENT_EMOJIS_STORAGE_KEY = 'mermditor-recent-emojis'
export const AUTOSAVE_INTERVAL_MS = 10_000

export const useEditorPersistence = () => {
  const autosave = ref(false)
  const lastSaved = ref('')
  const pendingAutosaveValue = ref<boolean | null>(null)
  const confirmAutosaveOn = ref(false)
  const confirmAutosaveOff = ref(false)
  const confirmClearData = ref(false)

  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  const loadWorkspaceSnapshot = (): { workspace: WorkspaceData | null; legacyContent: string } => {
    const legacyContent = localStorage.getItem(LEGACY_CONTENT_STORAGE_KEY) ?? ''

    try {
      const savedWorkspace = localStorage.getItem(WORKSPACE_STORAGE_KEY)
      const workspace = savedWorkspace ? parseWorkspaceData(savedWorkspace) : null

      if (savedWorkspace && !workspace) {
        localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      }

      return {
        workspace,
        legacyContent,
      }
    } catch (error) {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      logError('persistence.loadWorkspaceSnapshot', error)
      return { workspace: null, legacyContent }
    }
  }

  const loadSettings = (): void => {
    try {
      const savedAutosave = localStorage.getItem(AUTOSAVE_STORAGE_KEY)
      if (savedAutosave !== null) {
        autosave.value = savedAutosave === 'true'
      }
    } catch (error) {
      logError('persistence.loadSettings', error)
    }
  }

  const persistWorkspace = (workspace: WorkspaceData, content: string): void => {
    try {
      if (!autosave.value) return

      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
      localStorage.setItem(LEGACY_CONTENT_STORAGE_KEY, content)
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, autosave.value.toString())
      lastSaved.value = new Date().toLocaleTimeString()
    } catch (error) {
      logError('persistence.persistWorkspace', error, {
        activeFileId: workspace.activeFileId,
      })
    }
  }

  const persistWorkspaceIfEnabled = (workspace: WorkspaceData, content: string): void => {
    if (autosave.value) {
      persistWorkspace(workspace, content)
    }
  }

  const scheduleAutosave = (onSave: () => void): void => {
    if (!autosave.value) return

    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      onSave()
    }, AUTOSAVE_INTERVAL_MS)
  }

  const clearWorkspaceStorage = (): void => {
    try {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY)
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY)
      localStorage.removeItem(RECENT_EMOJIS_STORAGE_KEY)
    } catch {
      /* ignore storage errors */
    }
  }

  const onAutosaveToggle = (checked: boolean): void => {
    pendingAutosaveValue.value = checked
    if (checked) {
      confirmAutosaveOn.value = true
      return
    }

    confirmAutosaveOff.value = true
  }

  const cancelAutosaveChange = (): void => {
    confirmAutosaveOn.value = false
    confirmAutosaveOff.value = false
    pendingAutosaveValue.value = null
  }

  const confirmEnableAutosave = (onSave: () => void): void => {
    autosave.value = true
    confirmAutosaveOn.value = false
    pendingAutosaveValue.value = null

    try {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, 'true')
    } catch {
      /* ignore storage errors */
    }

    onSave()
  }

  const confirmDisableAutosave = (): void => {
    autosave.value = false
    confirmAutosaveOff.value = false
    pendingAutosaveValue.value = null

    try {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, 'false')
      localStorage.removeItem(WORKSPACE_STORAGE_KEY)
      localStorage.removeItem(LEGACY_CONTENT_STORAGE_KEY)
    } catch {
      /* ignore storage errors */
    }
  }

  const onClearStorageClick = (): void => {
    confirmClearData.value = true
  }

  const confirmClearDataNow = (resetState: () => void): void => {
    clearWorkspaceStorage()
    autosave.value = false
    resetState()
    confirmClearData.value = false
  }

  const cleanup = (): void => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
  }

  return {
    autosave,
    lastSaved,
    pendingAutosaveValue,
    confirmAutosaveOn,
    confirmAutosaveOff,
    confirmClearData,
    loadWorkspaceSnapshot,
    loadSettings,
    persistWorkspace,
    persistWorkspaceIfEnabled,
    scheduleAutosave,
    onAutosaveToggle,
    cancelAutosaveChange,
    confirmEnableAutosave,
    confirmDisableAutosave,
    onClearStorageClick,
    confirmClearDataNow,
    cleanup,
  }
}
