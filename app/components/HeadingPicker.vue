<template>
  <div class="relative" data-heading-picker>
    <button
      class="editor-toolbar-btn rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
      title="Insert Heading"
      @click="toggleHeadingPicker"
    >
      <PhTextH :size="16" />
    </button>

    <div
      v-show="showHeadingPicker"
      class="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-600 bg-gray-700 p-3"
      @click.stop
    >
      <h4 class="mb-3 text-sm font-medium text-gray-200">Select Heading Level</h4>

      <div class="space-y-1">
        <button
          v-for="level in headingLevels"
          :key="level.number"
          :class="[
            'flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left transition-colors',
            'hover:bg-gray-600 focus:bg-gray-600 focus:outline-none',
          ]"
          @click="insertHeading(level.number)"
        >
          <component :is="level.icon" :size="18" class="text-gray-300" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="text-gray-200">{{ level.name }}</span>
              <span class="text-xs text-gray-400">Ctrl+{{ level.number }}</span>
            </div>
            <div :class="level.previewClass" class="mt-1 text-gray-400">
              {{ level.preview }}
            </div>
          </div>
        </button>
      </div>

      <div class="mt-3 border-t border-gray-600 pt-3">
        <p class="text-xs text-gray-400">
          Tip: Use keyboard shortcuts Ctrl+1 to Ctrl+6 for quick access
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import {
    PhTextH,
    PhTextHOne,
    PhTextHTwo,
    PhTextHThree,
    PhTextHFour,
    PhTextHFive,
    PhTextHSix,
  } from '@phosphor-icons/vue'

  interface Props {
    actions: {
      // eslint-disable-next-line no-unused-vars
      insertHeading: (level: number) => void
    }
  }

  const props = defineProps<Props>()

  const showHeadingPicker = ref(false)

  const headingLevels = [
    {
      number: 1,
      name: 'Heading 1',
      icon: PhTextHOne,
      preview: 'Main title',
      previewClass: 'text-xl font-bold',
    },
    {
      number: 2,
      name: 'Heading 2',
      icon: PhTextHTwo,
      preview: 'Section title',
      previewClass: 'text-lg font-semibold',
    },
    {
      number: 3,
      name: 'Heading 3',
      icon: PhTextHThree,
      preview: 'Subsection title',
      previewClass: 'text-base font-semibold',
    },
    {
      number: 4,
      name: 'Heading 4',
      icon: PhTextHFour,
      preview: 'Minor heading',
      previewClass: 'text-sm font-semibold',
    },
    {
      number: 5,
      name: 'Heading 5',
      icon: PhTextHFive,
      preview: 'Small heading',
      previewClass: 'text-xs font-semibold',
    },
    {
      number: 6,
      name: 'Heading 6',
      icon: PhTextHSix,
      preview: 'Smallest heading',
      previewClass: 'text-xs font-medium',
    },
  ]

  const toggleHeadingPicker = () => {
    showHeadingPicker.value = !showHeadingPicker.value
  }

  const insertHeading = (level: number) => {
    props.actions.insertHeading(level)
    showHeadingPicker.value = false
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const headingPickerContainer = target.closest('[data-heading-picker]')
    if (!headingPickerContainer && showHeadingPicker.value) {
      showHeadingPicker.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>
