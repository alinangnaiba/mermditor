<template>
  <HelpModal :is-open="showHelpModal" @close="closeHelp" />

  <WorkspaceMoveModal
    :is-open="moveModal.visible"
    :item-name="moveModal.itemName"
    :options="moveDestinationOptions"
    :initial-folder-id="moveModal.initialFolderId"
    :error-text="moveModal.errorText"
    @confirm="submitMoveModal"
    @cancel="closeMoveModal"
  />

  <ConfirmModal
    :is-open="confirmAutosaveOn"
    title="Enable autosave?"
    message="Your content will be saved to your browser's local storage only. No data is sent to any server."
    confirm-text="Ok"
    cancel-text="Cancel"
    @confirm="confirmEnableAutosave"
    @cancel="cancelAutosaveChange"
  />
  <ConfirmModal
    :is-open="confirmAutosaveOff"
    title="Disable autosave?"
    message="This will turn off autosave and delete your saved content."
    confirm-text="Ok"
    cancel-text="Cancel"
    @confirm="confirmDisableAutosave"
    @cancel="cancelAutosaveChange"
  />
  <ConfirmModal
    :is-open="confirmClearData"
    title="Clear data?"
    message="This will delete your saved content from this browser and turn autosave off."
    confirm-text="Clear Data"
    cancel-text="Cancel"
    @confirm="confirmClearDataNow"
    @cancel="cancelClearData"
  />
  <ConfirmModal
    :is-open="deleteItemModal.visible"
    :title="deleteItemModal.title"
    :message="deleteItemModal.message"
    confirm-text="Delete"
    cancel-text="Cancel"
    @confirm="confirmDeleteWorkspaceItem"
    @cancel="closeDeleteItemModal"
  />
</template>

<script setup lang="ts">
  import HelpModal from './HelpModal.vue'
  import ConfirmModal from './ConfirmModal.vue'
  import WorkspaceMoveModal from './WorkspaceMoveModal.vue'
  import type { DeleteItemModalState, MoveModalState } from '../composables/editorTypes'

  /* eslint-disable no-unused-vars */
  defineProps<{
    showHelpModal: boolean
    moveModal: MoveModalState
    moveDestinationOptions: Array<{ id: string; label: string; disabled?: boolean }>
    confirmAutosaveOn: boolean
    confirmAutosaveOff: boolean
    confirmClearData: boolean
    deleteItemModal: DeleteItemModalState
    closeHelp: () => void
    submitMoveModal: (destinationFolderId: string) => void
    closeMoveModal: () => void
    confirmEnableAutosave: () => void
    confirmDisableAutosave: () => void
    cancelAutosaveChange: () => void
    confirmClearDataNow: () => void
    cancelClearData: () => void
    confirmDeleteWorkspaceItem: () => void
    closeDeleteItemModal: () => void
  }>()
  /* eslint-enable no-unused-vars */
</script>
