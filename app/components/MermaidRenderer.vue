<template>
  <div class="mermaid-renderer">
    <div v-if="error" class="rounded border border-red-600 p-4 text-red-400">
      Mermaid Error: {{ error }}
    </div>
    <div v-else-if="loading" class="p-4 text-gray-400">Rendering diagram...</div>
    <div v-else v-html="renderedSvg" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { renderMermaidExample } from '../utils/markdownItMermaid'

  interface Props {
    code: string
  }

  const props = defineProps<Props>()

  const renderedSvg = ref('')
  const loading = ref(false)
  const error = ref('')

  const renderDiagram = async () => {
    if (!props.code.trim()) {
      renderedSvg.value = ''
      return
    }

    loading.value = true
    error.value = ''

    try {
      renderedSvg.value = await renderMermaidExample(props.code.trim())
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  watch(() => props.code, renderDiagram, { immediate: false })

  onMounted(() => {
    renderDiagram()
  })
</script>

<style scoped>
  .mermaid-renderer :deep(.mermaid-example) {
    @apply flex min-h-32 items-center justify-center;
  }
</style>
