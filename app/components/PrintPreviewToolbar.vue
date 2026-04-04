<template>
  <div class="toolbar print:hidden">
    <h1 class="text-xl font-bold">Print Preview</h1>

    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-300">Size:</label>
        <select :value="pageSize" class="settings-select" @change="updatePageSize">
          <option value="A4">A4</option>
          <option value="Letter">Letter</option>
          <option value="Legal">Legal</option>
          <option value="A3">A3</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-300">Margins:</label>
        <select :value="margins" class="settings-select" @change="updateMargins">
          <option value="narrow">Narrow (10mm)</option>
          <option value="normal">Normal (20mm)</option>
          <option value="wide">Wide (30mm)</option>
        </select>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        class="px-4 py-2 bg-accent-active hover:bg-accent-primary rounded text-white font-medium flex items-center gap-2"
        @click="$emit('print')"
      >
        <PhPrinter :size="20" />
        Print / Save PDF
      </button>
      <button
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PhPrinter } from '@phosphor-icons/vue'
  import type { MarginSize, PageSize } from '../utils/printStyles'

  defineProps<{
    pageSize: PageSize
    margins: MarginSize
  }>()

  const emit = defineEmits<{
    'update:pageSize': [value: PageSize]
    'update:margins': [value: MarginSize]
    print: []
    close: []
  }>()

  const updatePageSize = (event: Event): void => {
    emit('update:pageSize', (event.target as HTMLSelectElement).value as PageSize)
  }

  const updateMargins = (event: Event): void => {
    emit('update:margins', (event.target as HTMLSelectElement).value as MarginSize)
  }
</script>
