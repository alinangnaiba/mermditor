import { ref } from 'vue'

export interface EmojiItem {
  shortcode: string
  unicode: string
}

const RECENT_EMOJIS_KEY = 'mermditor-recent-emojis'

export const useRecentEmojis = () => {
  const recentEmojis = ref<EmojiItem[]>([])

  const loadRecentEmojis = (): void => {
    try {
      const stored = localStorage.getItem(RECENT_EMOJIS_KEY)
      if (stored) {
        recentEmojis.value = JSON.parse(stored)
      }
    } catch {
      /* ignore storage errors */
    }
  }

  const saveRecentEmojis = (): void => {
    try {
      localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recentEmojis.value))
    } catch {
      /* ignore storage errors */
    }
  }

  const addToRecent = (emoji: EmojiItem): void => {
    const existingIndex = recentEmojis.value.findIndex((item) => item.shortcode === emoji.shortcode)
    if (existingIndex !== -1) {
      recentEmojis.value.splice(existingIndex, 1)
    }

    recentEmojis.value.unshift(emoji)

    if (recentEmojis.value.length > 24) {
      recentEmojis.value = recentEmojis.value.slice(0, 24)
    }

    saveRecentEmojis()
  }

  return {
    recentEmojis,
    loadRecentEmojis,
    addToRecent,
  }
}
