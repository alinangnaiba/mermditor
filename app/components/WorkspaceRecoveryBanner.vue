<template>
  <div
    class="border-b border-amber-500/30 bg-amber-950/40 px-4 py-3 text-sm text-amber-50"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="leading-6">
        {{ message }}
      </p>
      <div class="flex shrink-0 items-center gap-2">
        <button
          v-if="recovery.backupKey"
          class="rounded border border-amber-300/40 px-3 py-1.5 font-medium text-amber-50 transition hover:bg-amber-300/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
          type="button"
          @click="emit('download')"
        >
          Download backup
        </button>
        <button
          class="rounded border border-transparent px-3 py-1.5 font-medium text-amber-100 transition hover:bg-amber-300/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
          type="button"
          @click="emit('dismiss')"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { WorkspaceRecovery } from '../composables/useEditorPersistence'

  const props = defineProps<{
    recovery: WorkspaceRecovery
  }>()

  const emit = defineEmits<{
    download: []
    dismiss: []
  }>()

  const message = computed(() => {
    if (props.recovery.status === 'salvaged') {
      const itemCount = props.recovery.droppedItems.length
      const itemText = itemCount === 1 ? 'item' : 'items'
      const backupText = props.recovery.backupKey
        ? ''
        : ' A backup could not be written, so the original saved data was left in place.'

      return `Recovered your workspace - ${itemCount} ${itemText} could not be read and were set aside.${backupText}`
    }

    return props.recovery.backupKey
      ? 'We could not read your saved workspace and started fresh. Your previous data was backed up.'
      : 'We could not read your saved workspace and started fresh. A backup could not be written, so the original saved data was left in place.'
  })
</script>
