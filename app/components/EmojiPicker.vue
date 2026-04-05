<template>
  <div data-emoji-picker>
    <button
      ref="triggerRef"
      type="button"
      class="editor-toolbar-btn"
      :class="{ active: showEmojiPicker }"
      title="Insert Emoji"
      aria-haspopup="dialog"
      :aria-expanded="showEmojiPicker"
      @click="toggleEmojiPicker"
    >
      <PhSmiley :size="16" />
    </button>

    <Teleport to="body">
      <EmojiPickerPopover
        :show-emoji-picker="showEmojiPicker"
        :search-query="searchQuery"
        :active-category="activeCategory"
        :emoji-categories="emojiCategories"
        :displayed-emojis="displayedEmojis"
        :recent-emojis="recentEmojis"
        :panel-style="panelStyle"
        :set-search-query="setSearchQuery"
        :set-active-category="setActiveCategory"
        :clear-search="clearSearch"
        :insert-emoji="insertEmoji"
        @mount="handlePopoverMount"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { PhSmiley } from '@phosphor-icons/vue'
  import EmojiPickerPopover from './EmojiPickerPopover.vue'
  import { useEmojiPicker } from '../composables/useEmojiPicker'
  import { useRecentEmojis, type EmojiItem } from '../composables/useRecentEmojis'
  import { emojiCategories } from '../utils/emojiCategories'
  import { emojiMapping } from '../utils/emojiMapping'

  /* eslint-disable no-unused-vars */
  interface Props {
    actions: {
      insertEmoji: (emojiText: string) => void
    }
  }
  /* eslint-enable no-unused-vars */

  const props = defineProps<Props>()

  const {
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
  } = useEmojiPicker()

  const { recentEmojis, loadRecentEmojis, addToRecent } = useRecentEmojis()

  const allEmojis = computed<EmojiItem[]>(() => {
    return Object.entries(emojiMapping).map(([shortcode, unicode]) => ({
      shortcode,
      unicode,
    }))
  })

  const getEmojisByCategory = (categoryName: string): EmojiItem[] => {
    const category = emojiCategories.find((item) => item.name === categoryName)
    if (!category) return []

    return allEmojis.value.filter((emoji) =>
      category.keywords.some((keyword) => emoji.shortcode.includes(keyword))
    )
  }

  const searchResults = computed(() => {
    if (!searchQuery.value.trim()) return []

    const query = searchQuery.value.toLowerCase().trim()
    return allEmojis.value
      .filter(
        (emoji) => emoji.shortcode.toLowerCase().includes(query) || emoji.unicode.includes(query)
      )
      .slice(0, 64)
  })

  const displayedEmojis = computed(() => {
    if (searchQuery.value.trim()) {
      return searchResults.value
    }

    return getEmojisByCategory(activeCategory.value)
  })

  const setSearchQuery = (value: string): void => {
    searchQuery.value = value
  }

  const setActiveCategory = (categoryName: string): void => {
    activeCategory.value = categoryName
  }

  const insertEmoji = (emoji: EmojiItem): void => {
    props.actions.insertEmoji(`:${emoji.shortcode}:`)
    addToRecent(emoji)
    closeEmojiPicker()
  }

  const handlePopoverMount = ({
    panelRef: nextPanelRef,
    searchInput: nextSearchInput,
  }: {
    panelRef: HTMLDivElement | null
    searchInput: HTMLInputElement | undefined
  }): void => {
    panelRef.value = nextPanelRef
    searchInput.value = nextSearchInput
  }

  onMounted(() => {
    loadRecentEmojis()
  })
</script>

<style>
.emoji-picker-popover {
  position: fixed;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
}

.emoji-picker-search {
  border: 1px solid var(--border);
  background: var(--raised);
  color: var(--text);
}

.emoji-picker-search::placeholder,
.emoji-picker-search-icon,
.emoji-picker-clear,
.emoji-picker-empty,
.emoji-picker-tip {
  color: var(--dim);
}

.emoji-picker-clear:hover,
.emoji-picker-section-title {
  color: var(--text);
}

.emoji-picker-search:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--focus-ring);
}

.emoji-picker-category {
  background: var(--raised);
  color: var(--dim);
}

.emoji-picker-category:hover {
  color: var(--text);
  background: var(--accent-soft);
}

.emoji-picker-category.active {
  background: var(--accent);
  color: #fff;
}

.emoji-picker-emoji:hover {
  background: var(--raised);
}

.emoji-picker-section {
  border-top: 1px solid var(--border);
}

.emoji-picker-code {
  background: var(--raised);
  color: var(--text);
}
</style>
