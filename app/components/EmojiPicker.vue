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
      <div
        v-if="showEmojiPicker"
        ref="panelRef"
        class="emoji-picker-popover z-20 w-80 rounded-lg p-4"
        :style="panelStyle"
        @click.stop
      >
      <!-- Search Input -->
      <div class="mb-4">
        <div class="relative">
          <PhMagnifyingGlass
            :size="16"
            class="emoji-picker-search-icon absolute left-3 top-1/2 -translate-y-1/2 transform"
          />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search emojis..."
            class="emoji-picker-search w-full rounded-lg py-2 pl-10 pr-4 focus:outline-none"
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

      <!-- Category Tabs (only show when not searching) -->
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

      <!-- Emoji Grid -->
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
            class="emoji-picker-emoji rounded p-2 text-lg transition-colors"
            @click="insertEmoji(emoji)"
          >
            {{ emoji.unicode }}
          </button>
        </div>
      </div>

      <!-- Recent Emojis (only show when not searching and recent exists) -->
      <div
        v-if="!searchQuery && recentEmojis.length > 0"
        class="emoji-picker-section mt-4 pt-4"
      >
        <h4 class="emoji-picker-section-title mb-2 text-sm font-medium">Recently Used</h4>
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in recentEmojis.slice(0, 16)"
            :key="`recent-${emoji.shortcode}`"
            type="button"
            :title="`:${emoji.shortcode}:`"
            class="emoji-picker-emoji rounded p-2 text-lg transition-colors"
            @click="insertEmoji(emoji)"
          >
            {{ emoji.unicode }}
          </button>
        </div>
      </div>

      <!-- Shortcode info -->
      <div class="emoji-picker-section mt-4 pt-4">
        <p class="emoji-picker-tip text-xs">
          Tip: You can also type
          <code class="emoji-picker-code rounded px-1">:emoji_name:</code>
          in the editor
        </p>
      </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  import { PhSmiley, PhMagnifyingGlass, PhX } from '@phosphor-icons/vue'
  import { emojiMapping } from '../utils/emojiMapping'

  interface EmojiItem {
    shortcode: string
    unicode: string
  }

  interface Props {
    actions: {
      // eslint-disable-next-line no-unused-vars
      insertEmoji: (emojiText: string) => void
    }
  }

  const props = defineProps<Props>()

  const showEmojiPicker = ref(false)
  const searchQuery = ref('')
  const activeCategory = ref('Faces')
  const searchInput = ref<HTMLInputElement>()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const panelStyle = ref<Record<string, string>>({})

  const RECENT_EMOJIS_KEY = 'mermditor-recent-emojis'

  const allEmojis = computed(() => {
    return Object.entries(emojiMapping).map(([shortcode, unicode]) => ({
      shortcode,
      unicode,
    }))
  })

  const emojiCategories = [
    {
      name: 'Faces',
      icon: '😀',
      keywords: [
        'smile',
        'happy',
        'joy',
        'laugh',
        'grin',
        'blush',
        'wink',
        'cry',
        'angry',
        'love',
        'heart_eyes',
        'kiss',
        'tongue',
        'sleeping',
        'mask',
        'sunglasses',
        'confused',
        'worried',
        'relieved',
        'satisfied',
        'neutral',
        'expressionless',
        'unamused',
        'sweat',
        'weary',
        'pensive',
        'disappointed',
        'confounded',
        'fearful',
        'persevere',
        'sob',
        'astonished',
        'scream',
        'tired',
        'rage',
        'triumph',
        'sleepy',
        'yum',
        'dizzy',
        'imp',
        'smiling_imp',
        'innocent',
        'alien',
      ],
    },
    {
      name: 'Gestures',
      icon: '👍',
      keywords: [
        'thumbsup',
        'thumbsdown',
        'ok_hand',
        'punch',
        'fist',
        'wave',
        'hand',
        'raised_hand',
        'open_hands',
        'point_up',
        'point_down',
        'point_left',
        'point_right',
        'raised_hands',
        'pray',
        'clap',
        'muscle',
        'metal',
        'walking',
        'runner',
        'running',
        'dancer',
        'dancers',
      ],
    },
    {
      name: 'Hearts',
      icon: '❤️',
      keywords: [
        'heart',
        'yellow_heart',
        'blue_heart',
        'purple_heart',
        'green_heart',
        'broken_heart',
        'heartbeat',
        'heartpulse',
        'two_hearts',
        'revolving_hearts',
        'cupid',
        'sparkling_heart',
      ],
    },
    {
      name: 'Animals',
      icon: '🐶',
      keywords: [
        'dog',
        'cat',
        'mouse',
        'hamster',
        'rabbit',
        'wolf',
        'frog',
        'tiger',
        'koala',
        'bear',
        'pig',
        'cow',
        'boar',
        'monkey',
        'horse',
        'camel',
        'sheep',
        'elephant',
        'panda',
        'snake',
        'bird',
        'chicken',
        'penguin',
        'turtle',
        'bug',
        'honeybee',
        'ant',
        'beetle',
        'snail',
        'octopus',
        'fish',
        'whale',
        'dolphin',
      ],
    },
    {
      name: 'Food',
      icon: '🍎',
      keywords: [
        'apple',
        'orange',
        'banana',
        'grapes',
        'strawberry',
        'pizza',
        'hamburger',
        'fries',
        'coffee',
        'tea',
        'beer',
        'wine',
        'cake',
        'cookie',
        'chocolate',
        'candy',
        'bread',
        'egg',
        'meat',
        'rice',
        'sushi',
        'ice_cream',
      ],
    },
    {
      name: 'Activities',
      icon: '⚽',
      keywords: [
        'soccer',
        'basketball',
        'football',
        'tennis',
        'golf',
        'baseball',
        'rugby',
        'bowling',
        'ski',
        'snowboard',
        'swimming',
        'surfing',
        'bike',
        'car',
        'airplane',
        'rocket',
        'guitar',
        'music',
        'art',
        'microphone',
        'headphones',
      ],
    },
    {
      name: 'Travel',
      icon: '🚗',
      keywords: [
        'car',
        'bus',
        'train',
        'airplane',
        'rocket',
        'ship',
        'bike',
        'taxi',
        'police_car',
        'fire_engine',
        'ambulance',
        'truck',
        'hotel',
        'house',
        'office',
        'school',
        'hospital',
        'bank',
        'church',
      ],
    },
    {
      name: 'Symbols',
      icon: '⭐',
      keywords: [
        'star',
        'fire',
        'sparkles',
        'boom',
        'star2',
        'dizzy',
        'anger',
        'exclamation',
        'question',
        'zzz',
        'dash',
        'sweat_drops',
        'notes',
        'musical_note',
        'heavy_check_mark',
        'x',
        'heavy_plus_sign',
        'heavy_minus_sign',
        'heavy_multiplication_x',
        'heavy_division_sign',
        'arrow_up',
        'arrow_down',
        'arrow_left',
        'arrow_right',
        'warning',
        'information_source',
      ],
    },
  ]

  const getEmojisByCategory = (categoryName: string) => {
    const category = emojiCategories.find((c) => c.name === categoryName)
    if (!category) return []

    return allEmojis.value.filter((emoji) =>
      category.keywords.some((keyword) => emoji.shortcode.includes(keyword))
    )
  }

  const recentEmojis = ref<EmojiItem[]>([])

  const loadRecentEmojis = () => {
    try {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY)
      if (stored) {
        recentEmojis.value = JSON.parse(stored)
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  const saveRecentEmojis = () => {
    try {
      localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recentEmojis.value))
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  const addToRecent = (emoji: EmojiItem) => {
    const existingIndex = recentEmojis.value.findIndex((e) => e.shortcode === emoji.shortcode)
    if (existingIndex !== -1) {
      recentEmojis.value.splice(existingIndex, 1)
    }

    recentEmojis.value.unshift(emoji)

    if (recentEmojis.value.length > 24) {
      recentEmojis.value = recentEmojis.value.slice(0, 24)
    }

    saveRecentEmojis()
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

  const updatePanelPosition = () => {
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

  const toggleEmojiPicker = async () => {
    showEmojiPicker.value = !showEmojiPicker.value

    if (showEmojiPicker.value) {
      await nextTick()
      updatePanelPosition()
      searchInput.value?.focus()
    }
  }

  const setActiveCategory = (categoryName: string) => {
    activeCategory.value = categoryName
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchInput.value?.focus()
  }

  const insertEmoji = (emoji: EmojiItem) => {
    props.actions.insertEmoji(`:${emoji.shortcode}:`)
    addToRecent(emoji)
    showEmojiPicker.value = false
  }

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target
    if (!(target instanceof Node) || !showEmojiPicker.value) return
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    showEmojiPicker.value = false
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && showEmojiPicker.value) {
      showEmojiPicker.value = false
    }
  }

  const handleViewportChange = () => {
    if (showEmojiPicker.value) {
      updatePanelPosition()
    }
  }

  onMounted(() => {
    loadRecentEmojis()
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
    color: var(--orange);
  }

  /* Custom scrollbar styles */
  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .emoji-picker-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .emoji-picker-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .emoji-picker-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--border);
    border-radius: 3px;
  }

  .emoji-picker-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: var(--muted);
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  }
</style>
