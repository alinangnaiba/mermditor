<template>
  <div ref="mermaidContainer" class="mermaid-diagram-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import mermaid from 'mermaid';

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  idSuffix: {
    type: [String, Number],
    default: () => Math.random().toString(36).substring(2, 9)
  }
});

const mermaidContainer = ref<HTMLElement | null>(null);
const uniqueMermaidId = `mermaid-diagram-${props.idSuffix}`;

/**
 * Renders a Mermaid diagram using the provided code
 */
const renderMermaidDiagram = async () => {
  if (mermaidContainer.value && props.code) {
    try {
      // Clear previous diagram before rendering a new one
      mermaidContainer.value.innerHTML = '<div class="mermaid-loading">Rendering diagram...</div>';
      await nextTick(); // Wait for DOM update

      const { svg } = await mermaid.render(uniqueMermaidId, props.code);
      mermaidContainer.value.innerHTML = svg;
    } catch (error) {
      console.error(`Mermaid rendering error for ID ${uniqueMermaidId}:`, error);
      if (mermaidContainer.value) {
        mermaidContainer.value.textContent = `Error rendering diagram: ${(error as Error).message}`;
        mermaidContainer.value.classList.add('mermaid-error');
      }
    }
  } else if (mermaidContainer.value) {
    mermaidContainer.value.innerHTML = ''; // Clear if no code
  }
};

onMounted(async () => {
  await renderMermaidDiagram();
});

watch(() => props.code, async () => {
  await renderMermaidDiagram();
}, { immediate: false });
</script>

<style scoped>
.mermaid-diagram-container {
  width: 100%;
  padding: 8px 0;
}

.mermaid-diagram-container :deep(svg) {
  display: block;
  margin: auto;
  max-width: 100%;
}

.mermaid-error {
  color: #ff5252;
  padding: 10px;
  border: 1px dashed #ff5252;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  background-color: rgba(255, 82, 82, 0.1);
}

.mermaid-loading {
  color: #41B883;
  padding: 10px;
  text-align: center;
  font-style: italic;
  border: 1px dashed #41B883;
  border-radius: 4px;
  background-color: rgba(65, 184, 131, 0.1);
}
</style>
