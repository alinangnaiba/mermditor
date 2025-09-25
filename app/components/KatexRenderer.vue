<template>
  <div class="katex-renderer">
    <div v-if="error" class="text-red-400">LaTeX Error: {{ error }}</div>
    <div v-else-if="loading" class="text-gray-400">Rendering LaTeX...</div>
    <div v-else v-html="renderedLatex" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { renderLatexExample, waitForKatex } from '../utils/markdownItKatex'

  interface Props {
    latex: string
    block?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    block: false,
  })

  const renderedLatex = ref('')
  const loading = ref(false)
  const error = ref('')

  const renderLatex = async () => {
    if (!props.latex.trim()) {
      renderedLatex.value = ''
      return
    }

    loading.value = true
    error.value = ''

    try {
      await waitForKatex()
      renderedLatex.value = renderLatexExample(props.latex.trim(), props.block)
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
    } finally {
      loading.value = false
    }
  }

  watch(() => [props.latex, props.block], renderLatex, { immediate: false })

  onMounted(() => {
    renderLatex()
  })
</script>

<style scoped>
  .katex-renderer :deep(.katex-display) {
    @apply my-4 text-center;
  }

  .katex-renderer :deep(.katex) {
    color: #f3f4f6 !important;
  }
</style>
