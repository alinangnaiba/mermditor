import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { sanitizeHtml, sanitizeSvg } from '../utils/sanitizer'

export type SafeHtmlKind = 'html' | 'svg'

interface UseSafeHtmlOptions {
  content: MaybeRefOrGetter<string>
  kind?: MaybeRefOrGetter<SafeHtmlKind>
}

export const useSafeHtml = ({ content, kind = 'html' }: UseSafeHtmlOptions) => {
  const sanitizedContent = computed(() => {
    const nextContent = toValue(content) || ''
    const nextKind = toValue(kind)

    return nextKind === 'svg' ? sanitizeSvg(nextContent) : sanitizeHtml(nextContent)
  })

  return {
    sanitizedContent,
  }
}
