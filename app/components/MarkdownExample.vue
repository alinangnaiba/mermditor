<template>
  <div class="prose prose-invert max-w-none" v-html="renderedContent" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'

  interface Props {
    content: string
  }

  const props = defineProps<Props>()
  const { renderMarkdownExample } = useMarkdownRenderer()
  const renderedContent = ref('')

  const renderContent = async () => {
    if (props.content) {
      try {
        renderedContent.value = await renderMarkdownExample(props.content)
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
</script>
