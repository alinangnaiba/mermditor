<template>
  <div
    v-if="showEmojiPicker"
    ref="panelRef"
    class="emoji-picker-popover z-20 w-80 rounded-lg p-4"
    :style="panelStyle"
    @click.stop
  >
    <div class="mb-4">
      <div class="relative">
        <PhMagnifyingGlass
          :size="16"
          class="emoji-picker-search-icon absolute left-3 top-1/2 -translate-y-1/2 transform"
        />
        <input
          ref="searchInput"
          :value="searchQuery"
          type="text"
          placeholder="Search emojis..."
          class="emoji-picker-search w-full rounded-lg py-2 pl-10 pr-4 focus:outline-none"
          @input="setSearchQuery(($event.target as HTMLInputElement).value)"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="emoji-picker-clear absolute right-2 top-1/2 -translate-y-1/2 transform"
          @click="clearSearch"
        >
          <PhX :size="16" />
        </button>
      </div>
    </div>

    <div v-if="!searchQuery" class="mb-4">
      <div class="emoji-picker-scrollbar scrollbar-thin flex space-x-1 overflow-x-auto">
        <button
          v-for="category in emojiCategories"
          :key="category.name"
          :class="[
            'whitespace-nowrap rounded-md px-3 py-1 text-sm transition-colors',
            activeCategory === category.name
              ? 'emoji-picker-category active'
              : 'emoji-picker-category',
          ]"
          @click="setActiveCategory(category.name)"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
    </div>

    <div class="emoji-picker-scrollbar h-48 overflow-y-auto">
      <div v-if="displayedEmojis.length === 0" class="emoji-picker-empty py-8 text-center">
        <PhMagnifyingGlass :size="24" class="mx-auto mb-2 opacity-50" />
        <p>No emojis found</p>
      </div>
      <div v-else class="grid grid-cols-8 gap-1">
        <button
          v-for="emoji in displayedEmojis"
          :key="emoji.shortcode"
          type="button"
          :title="`:${emoji.shortcode}:`"
          :aria-label="emoji.shortcode"
          class="emoji-picker-emoji rounded p-2 text-lg transition-colors"
          @click="insertEmoji(emoji)"
        >
          {{ emoji.unicode }}
        </button>
      </div>
    </div>

    <div v-if="!searchQuery && recentEmojis.length > 0" class="emoji-picker-section mt-4 pt-4">
      <h4 class="emoji-picker-section-title mb-2 text-sm font-medium">Recently Used</h4>
      <div class="grid grid-cols-8 gap-1">
        <button
          v-for="emoji in recentEmojis.slice(0, 16)"
          :key="`recent-${emoji.shortcode}`"
          type="button"
          :title="`:${emoji.shortcode}:`"
          :aria-label="emoji.shortcode"
          class="emoji-picker-emoji rounded p-2 text-lg transition-colors"
          @click="insertEmoji(emoji)"
        >
          {{ emoji.unicode }}
        </button>
      </div>
    </div>

    <div class="emoji-picker-section mt-4 pt-4">
      <p class="emoji-picker-tip text-xs">
        Tip: You can also type
        <code class="emoji-picker-code rounded px-1">:emoji_name:</code>
        in the editor
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'
  import { PhMagnifyingGlass, PhX } from '@phosphor-icons/vue'
  import type { EmojiItem } from '../composables/useRecentEmojis'
  import type { EmojiCategory } from '../utils/emojiCategories'

  /* eslint-disable no-unused-vars */
  defineProps<{
    showEmojiPicker: boolean
    searchQuery: string
    activeCategory: string
    emojiCategories: EmojiCategory[]
    displayedEmojis: EmojiItem[]
    recentEmojis: EmojiItem[]
    panelStyle: Record<string, string>
    setSearchQuery: (value: string) => void
    setActiveCategory: (categoryName: string) => void
    clearSearch: () => void
    insertEmoji: (emoji: EmojiItem) => void
  }>()
  /* eslint-enable no-unused-vars */

  const emit = defineEmits<{
    mount: [payload: { panelRef: HTMLDivElement | null; searchInput: HTMLInputElement | undefined }]
  }>()

  const panelRef = ref<HTMLDivElement | null>(null)
  const searchInput = ref<HTMLInputElement>()

  onMounted(async () => {
    await nextTick()
    emit('mount', {
      panelRef: panelRef.value,
      searchInput: searchInput.value,
    })
  })
</script>
