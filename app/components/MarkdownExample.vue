<template>
  <SafeHtml
    ref="containerRef"
    class="prose prose-invert max-w-none"
    :content="renderedContent"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
  import SafeHtml from './SafeHtml.vue'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'
  import { attachCodeBlockInteractions } from '../utils/codeBlockInteractions'

  interface Props {
    content: string
  }

  const props = defineProps<Props>()
  const { renderMarkdownExample } = useMarkdownRenderer()
  const renderedContent = ref('')
  const containerRef = ref<{ element: HTMLElement | null } | null>(null)
  let cleanupCodeBlockInteractions: (() => void) | null = null

  const renderContent = async () => {
    if (props.content) {
      try {
        renderedContent.value = await renderMarkdownExample(props.content)
        await nextTick()
        cleanupCodeBlockInteractions?.()
        if (containerRef.value?.element) {
          cleanupCodeBlockInteractions = attachCodeBlockInteractions(containerRef.value.element)
        }
      } catch (error) {
        console.warn('Failed to render markdown example:', error)
        renderedContent.value = '<div class="text-red-400">Error rendering example</div>'
      }
    }
  }

  watch(() => props.content, renderContent, { immediate: true })

  onMounted(() => {
    if (import.meta.client) {
      renderContent()
    }
  })

  onUnmounted(() => {
    cleanupCodeBlockInteractions?.()
  })
</script>
