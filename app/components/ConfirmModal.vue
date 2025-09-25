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
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        <button
          class="rounded p-2 text-gray-400 transition-colors hover:text-white"
          aria-label="Close"
          @click="emit('cancel')"
        >
          <PhX :size="18" />
        </button>
      </div>
      <div class="p-4 text-gray-200">
        <p class="whitespace-pre-line">{{ message }}</p>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-700 bg-gray-900 px-4 py-3">
        <button
          class="rounded bg-gray-700 px-3 py-2 text-gray-200 transition-colors hover:bg-gray-600"
          @click="emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button
          class="rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-500"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PhX } from '@phosphor-icons/vue'

  interface Props {
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Please confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  const emit = defineEmits<{
    confirm: []
    cancel: []
  }>()
</script>
