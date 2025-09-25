<template>
  <div class="math-display text-center text-lg text-white" v-html="renderedContent" />
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'

  interface Props {
    latex: string
    isBlock?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    isBlock: false,
  })

  const { renderLatexExample } = useMarkdownRenderer()
  const renderedContent = ref('')

  // Wait for KaTeX script to be available on the client
  const waitForKatex = (): Promise<void> => {
    return new Promise((resolve) => {
      if (!import.meta.client) {
        resolve()
        return
      }
      if ((window as any).katex) {
        resolve()
        return
      }
      const check = () => {
        if ((window as any).katex) {
          resolve()
        } else {
          setTimeout(check, 50)
        }
      }
      check()
    })
  }

  const renderContent = () => {
    const input = props.latex || ''
    if (!input) {
      renderedContent.value = ''
      return
    }

    try {
      if (props.isBlock) {
        const parts = input.split(/(\$\$[\s\S]*?\$\$)/g).filter(Boolean)

        const html = parts
          .map((part) => {
            const trimmed = part.trim()
            if (/^\$\$[\s\S]*?\$\$$/.test(trimmed)) {
              const content = trimmed.slice(2, -2)
              return renderLatexExample(content, true)
            }
            return trimmed ? `<p>${trimmed.replace(/\n+/g, '<br/>')}</p>` : ''
          })
          .join('')

        renderedContent.value = html
        return
      }

      renderedContent.value = renderLatexExample(input, false)
    } catch {
      renderedContent.value = input
    }
  }

  watch(
    () => [props.latex, props.isBlock],
    async () => {
      if (import.meta.client && !(window as any).katex) {
        await waitForKatex()
      }
      renderContent()
    },
    { immediate: true }
  )

  onMounted(() => {
    if (import.meta.client) {
      waitForKatex().then(renderContent)
    }
  })
</script>

<style scoped>
  .math-display {
    line-height: 1.5;
  }
</style>
