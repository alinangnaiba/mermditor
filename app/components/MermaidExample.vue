<template>
  <div class="mermaid-example-container" v-html="renderedContent" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'

  interface Props {
    mermaidCode: string
  }

  const props = defineProps<Props>()
  const { renderMermaidExample } = useMarkdownRenderer()
  const renderedContent = ref('<div class="text-gray-400 p-4 text-center">Loading diagram...</div>')

  const renderContent = async () => {
    if (props.mermaidCode) {
      try {
        renderedContent.value = await renderMermaidExample(props.mermaidCode)
      } catch (error) {
        console.warn('Failed to render Mermaid example:', error)
        renderedContent.value =
          '<div class="text-gray-400 p-4 text-center">Diagram would render here</div>'
      }
    }
  }

  watch(() => props.mermaidCode, renderContent, { immediate: true })

  onMounted(() => {
    if (import.meta.client) {
      // Small delay to ensure Mermaid is loaded
      setTimeout(renderContent, 200)
    }
  })
</script>

<style scoped>
  .mermaid-example-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: rgb(31, 41, 55);
    border-radius: 0.5rem;
  }

  :deep(.mermaid-example svg) {
    max-width: 100%;
    height: auto;
  }
</style>
