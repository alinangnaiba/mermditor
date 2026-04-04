<template>
  <div data-heading-picker>
    <button
      ref="triggerRef"
      type="button"
      class="editor-toolbar-btn"
      :class="{ active: showHeadingPicker }"
      title="Insert Heading"
      aria-haspopup="menu"
      :aria-expanded="showHeadingPicker"
      @click="toggleHeadingPicker"
    >
      <PhTextH :size="16" />
    </button>

    <Teleport to="body">
      <div
        v-if="showHeadingPicker"
        ref="panelRef"
        class="heading-picker-popover z-20 w-64 rounded-lg p-3"
        :style="panelStyle"
        @click.stop
      >
        <h4 class="heading-picker-title mb-3 text-sm font-medium">Select Heading Level</h4>

        <div class="space-y-1">
          <button
            v-for="level in headingLevels"
            :key="level.number"
            type="button"
            class="heading-picker-option flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left transition-colors focus:outline-none"
            @click="insertHeading(level.number)"
          >
            <component :is="level.icon" :size="18" class="heading-picker-icon" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="heading-picker-name">{{ level.name }}</span>
                <span class="heading-picker-shortcut text-xs">Ctrl+{{ level.number }}</span>
              </div>
              <div :class="level.previewClass" class="heading-picker-preview mt-1">
                {{ level.preview }}
              </div>
            </div>
          </button>
        </div>

        <div class="heading-picker-footer mt-3 pt-3">
          <p class="heading-picker-tip text-xs">
            Tip: Use keyboard shortcuts Ctrl+1 to Ctrl+6 for quick access
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
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
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})

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

  const updatePanelPosition = () => {
    if (!triggerRef.value) return

    const rect = triggerRef.value.getBoundingClientRect()
    const panelWidth = 256
    const viewportPadding = 12
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - panelWidth - viewportPadding
    )

    panelStyle.value = {
      left: `${left}px`,
      top: `${rect.bottom + 8}px`,
    }
  }

  const toggleHeadingPicker = async () => {
    showHeadingPicker.value = !showHeadingPicker.value

    if (showHeadingPicker.value) {
      await nextTick()
      updatePanelPosition()
    }
  }

  const insertHeading = (level: number) => {
    props.actions.insertHeading(level)
    showHeadingPicker.value = false
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target
    if (!(target instanceof Node) || !showHeadingPicker.value) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    showHeadingPicker.value = false
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showHeadingPicker.value) {
      showHeadingPicker.value = false
    }
  }

  const handleViewportChange = () => {
    if (showHeadingPicker.value) {
      updatePanelPosition()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('scroll', handleViewportChange, true)
  })
</script>

<style scoped>
  .heading-picker-popover {
    position: fixed;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  }

  .heading-picker-title,
  .heading-picker-name {
    color: var(--text);
  }

  .heading-picker-icon,
  .heading-picker-shortcut,
  .heading-picker-preview,
  .heading-picker-tip {
    color: var(--dim);
  }

  .heading-picker-option:hover,
  .heading-picker-option:focus-visible {
    background: var(--raised);
  }

  .heading-picker-footer {
    border-top: 1px solid var(--border);
  }
</style>
