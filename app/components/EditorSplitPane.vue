<template>
  <div class="flex flex-1 flex-col overflow-hidden sm:flex-row">
    <div
      v-show="showEditor"
      :class="showPreview && !isMobile ? 'sm:w-1/2' : 'w-full'"
      class="editor-pane flex flex-col border-r editor-border"
      data-testid="editor-pane"
    >
      <div ref="editorContainer" class="h-full min-h-0 flex-1" />
    </div>

    <div
      v-show="showEditor && showPreview"
      class="editor-resize-handle"
      @mousedown="onStartResize"
    />

    <div
      v-show="showPreview"
      :class="showEditor && !isMobile ? 'sm:w-1/2' : 'w-full'"
      class="preview-pane relative flex flex-col overflow-hidden"
      data-testid="preview-pane"
    >
      <button
        class="editor-help-btn"
        title="Quick Reference (shortcuts, syntax, examples)"
        @click="onOpenHelp"
      >
        ?
      </button>

      <div ref="previewContainer" class="editor-preview-inner flex-1 overflow-auto p-4">
        <div :class="previewProseClass" v-html="renderedContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'

  /* eslint-disable no-unused-vars */
  const props = defineProps<{
    isMobile: boolean
    showEditor: boolean
    showPreview: boolean
    previewProseClass: string
    renderedContent: string
    onStartResize: (event: MouseEvent) => void
    onOpenHelp: () => void
  }>()
  /* eslint-enable no-unused-vars */

  const emit = defineEmits<{
    mount: [payload: { editorContainer: HTMLElement | null; previewContainer: HTMLElement | null }]
  }>()

  const editorContainer = ref<HTMLElement | null>(null)
  const previewContainer = ref<HTMLElement | null>(null)

  onMounted(async () => {
    await nextTick()
    emit('mount', {
      editorContainer: editorContainer.value,
      previewContainer: previewContainer.value,
    })
  })

  const onStartResize = (event: MouseEvent): void => {
    props.onStartResize(event)
  }

  const onOpenHelp = (): void => {
    props.onOpenHelp()
  }
</script>
