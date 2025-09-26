<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    @click="emit('cancel')"
  >
    <div
      class="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 shadow-xl"
      @click.stop
    >
      <div class="flex items-start justify-between border-b border-gray-700 p-4">
        <h3 class="text-lg font-semibold text-white">Save As</h3>
        <button
          class="rounded p-2 text-gray-400 transition-colors hover:text-white"
          aria-label="Close"
          @click="emit('cancel')"
        >
          <PhX :size="18" />
        </button>
      </div>
      <div class="p-4">
        <label class="mb-2 block text-sm font-medium text-gray-200">
          Filename (without extension)
        </label>
        <input
          ref="filenameInput"
          v-model="filename"
          type="text"
          class="w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter filename"
          @keydown.enter="handleSave"
          @keydown.escape="emit('cancel')"
        />
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-700 bg-gray-900 px-4 py-3">
        <button
          class="rounded bg-gray-700 px-3 py-2 text-gray-200 transition-colors hover:bg-gray-600"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          class="rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!filename.trim()"
          @click="handleSave"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { PhX } from '@phosphor-icons/vue'

  interface Props {
    isOpen: boolean
    defaultFilename?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultFilename: '',
  })

  const emit = defineEmits<{
    save: [filename: string]
    cancel: []
  }>()

  const filename = ref('')
  const filenameInput = ref<HTMLInputElement | null>(null)

  const handleSave = () => {
    if (filename.value.trim()) {
      emit('save', filename.value.trim())
    }
  }

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (isOpen) {
        filename.value = props.defaultFilename
        await nextTick()
        filenameInput.value?.focus()
        filenameInput.value?.select()
      }
    }
  )
</script>
