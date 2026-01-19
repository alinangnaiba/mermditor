<template>
  <div class="math-display text-center text-lg text-white" v-html="renderedContent" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { renderLatexExample } from '../utils/markdownItKatex'

  interface Props {
    latex: string
    isBlock?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isBlock: false,
  })

  const renderedContent = ref('')

  const renderContent = async () => {
    const input = props.latex || ''
    if (!input) {
      renderedContent.value = ''
      return
    }

    try {
      if (props.isBlock) {
        const parts = input.split(/(\$\$[\s\S]*?\$\$)/g).filter(Boolean)

        const htmlParts = await Promise.all(
          parts.map(async (part) => {
            const trimmed = part.trim()
            if (/^\$\$[\s\S]*?\$\$$/.test(trimmed)) {
              const content = trimmed.slice(2, -2)
              return await renderLatexExample(content, true)
            }
            return trimmed ? `<p>${trimmed.replace(/\n+/g, '<br/>')}</p>` : ''
          })
        )

        renderedContent.value = htmlParts.join('')
        return
      }

      renderedContent.value = await renderLatexExample(input, false)
    } catch {
      renderedContent.value = input
    }
  }

  watch(
    () => [props.latex, props.isBlock],
    () => {
      renderContent()
    },
    { immediate: true }
  )

  onMounted(() => {
    renderContent()
  })
</script>

<style scoped>
  .math-display {
    line-height: 1.5;
  }
</style>
