<template>
  <div class="relative">
    <button
      class="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
      title="Insert Emoji"
      @click="toggleEmojiPicker"
    >
      <PhSmiley :size="16" />
    </button>

    <div
      v-show="showEmojiPicker"
      class="absolute left-0 top-full z-20 mt-2 w-80 rounded-lg border border-gray-600 bg-gray-700 p-4"
      @click.stop
    >
      <!-- Search Input -->
      <div class="mb-4">
        <div class="relative">
          <PhMagnifyingGlass
            :size="16"
            class="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
          />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search emojis..."
            class="w-full rounded-lg border border-gray-600 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            v-if="searchQuery"
            class="absolute right-2 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-white"
            @click="clearSearch"
          >
            <PhX :size="16" />
          </button>
        </div>
      </div>

      <!-- Category Tabs (only show when not searching) -->
      <div v-if="!searchQuery" class="mb-4">
        <div class="scrollbar-thin scrollbar-thumb-gray-600 flex space-x-1 overflow-x-auto">
          <button
            v-for="category in emojiCategories"
            :key="category.name"
            :class="[
              'whitespace-nowrap rounded-md px-3 py-1 text-sm transition-colors',
              activeCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500',
            ]"
            @click="setActiveCategory(category.name)"
          >
            {{ category.icon }} {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Emoji Grid -->
      <div class="scrollbar-thin scrollbar-thumb-gray-600 h-48 overflow-y-auto">
        <div v-if="displayedEmojis.length === 0" class="py-8 text-center text-gray-400">
          <PhMagnifyingGlass :size="24" class="mx-auto mb-2 opacity-50" />
          <p>No emojis found</p>
        </div>
        <div v-else class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in displayedEmojis"
            :key="emoji.shortcode"
            :title="`:${emoji.shortcode}:`"
            class="rounded p-2 text-lg transition-colors hover:bg-gray-600"
            @click="insertEmoji(emoji)"
          >
            {{ emoji.unicode }}
          </button>
        </div>
      </div>

      <!-- Recent Emojis (only show when not searching and recent exists) -->
      <div
        v-if="!searchQuery && recentEmojis.length > 0"
        class="mt-4 border-t border-gray-600 pt-4"
      >
        <h4 class="mb-2 text-sm font-medium text-gray-300">Recently Used</h4>
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in recentEmojis.slice(0, 16)"
            :key="`recent-${emoji.shortcode}`"
            :title="`:${emoji.shortcode}:`"
            class="rounded p-2 text-lg transition-colors hover:bg-gray-600"
            @click="insertEmoji(emoji)"
          >
            {{ emoji.unicode }}
          </button>
        </div>
      </div>

      <!-- Shortcode info -->
      <div class="mt-4 border-t border-gray-600 pt-4">
        <p class="text-xs text-gray-400">
          Tip: You can also type <code class="rounded bg-gray-800 px-1">:emoji_name:</code> in the
          editor
        </p>
      </div>
    </div>
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

const toggleEmojiPicker = async () => {
  showEmojiPicker.value = !showEmojiPicker.value

  if (showEmojiPicker.value) {
    await nextTick()
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
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showEmojiPicker.value = false
  }
}

onMounted(() => {
  loadRecentEmojis()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom scrollbar styles */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-600::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thumb-gray-600::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 3px;
}

.scrollbar-thumb-gray-600::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
</style>
