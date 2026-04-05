import { nextTick, onMounted, onUnmounted, ref } from 'vue'

export const useEmojiPicker = () => {
  const showEmojiPicker = ref(false)
  const searchQuery = ref('')
  const activeCategory = ref('Faces')
  const searchInput = ref<HTMLInputElement>()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})

  const updatePanelPosition = (): void => {
    if (!triggerRef.value) return

    const rect = triggerRef.value.getBoundingClientRect()
    const panelWidth = 320
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

  const closeEmojiPicker = (): void => {
    showEmojiPicker.value = false
  }

  const toggleEmojiPicker = async (): Promise<void> => {
    showEmojiPicker.value = !showEmojiPicker.value

    if (showEmojiPicker.value) {
      await nextTick()
      updatePanelPosition()
      requestAnimationFrame(() => {
        searchInput.value?.focus()
      })
    }
  }

  const clearSearch = (): void => {
    searchQuery.value = ''
    searchInput.value?.focus()
  }

  const handleClickOutside = (event: MouseEvent): void => {
    const target = event.target
    if (!(target instanceof Node) || !showEmojiPicker.value) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    closeEmojiPicker()
  }

  const handleEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && showEmojiPicker.value) {
      closeEmojiPicker()
    }
  }

  const handleViewportChange = (): void => {
    if (showEmojiPicker.value) {
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

  return {
    showEmojiPicker,
    searchQuery,
    activeCategory,
    searchInput,
    triggerRef,
    panelRef,
    panelStyle,
    toggleEmojiPicker,
    clearSearch,
    closeEmojiPicker,
  }
}
