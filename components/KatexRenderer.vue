<template>
  <div class="katex-wrapper" :class="{ 'inline-math': !isBlock, 'block-math': isBlock }">
    <div ref="mathContainer" class="katex-container"/>
    <div v-if="error" class="katex-error">
      <span class="text-red-400">Math rendering error:</span>
      <pre class="text-sm mt-1">{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import * as katex from 'katex';
import 'katex/dist/katex.min.css';

const props = defineProps<{
  code: string
  isBlock?: boolean
  idSuffix?: string
}>();

const isBlock = computed(() => props.isBlock === true);

const mathContainer = ref<HTMLElement | null>(null);
const error = ref<string | null>(null);

const renderMath = async () => {
  if (!mathContainer.value || !props.code.trim()) return;
  
  try {
    error.value = null;
    
    mathContainer.value.innerHTML = '';
    
    katex.render(props.code.trim(), mathContainer.value, {
      displayMode: isBlock.value,
      throwOnError: false,
      errorColor: '#ef4444',
      strict: 'warn',
      trust: false,
      output: 'html',
      macros: {
        '\\text': '\\textrm'
      }
    });    
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown rendering error';
    console.error('KaTeX rendering error:', err);
    error.value = errorMessage;
    
    if (mathContainer.value) {
      mathContainer.value.innerHTML = `<code class="text-yellow-400">${props.code}</code>`;
    }
  }
};

watch(
  () => props.code,
  async () => {
    await nextTick();
    await renderMath();
  },
  { immediate: false }
);

onMounted(async () => {
  await renderMath();
});
</script>

<style scoped>
.katex-container {
  overflow-x: auto;
  overflow-y: hidden;
}

/* Block math styling */
.block-math {
  margin: 0.5rem 0;
}

.block-math .katex-container {
  text-align: center;
}

/* Inline math styling */
.inline-math {
  display: inline;
  margin: 0;
}

.inline-math .katex-container {
  display: inline;
  text-align: left;
}

.katex-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 4px;
  padding: 0.5rem;
  margin: 0.5rem 0;
}

/* Ensure KaTeX renders with proper colors in dark theme */
:deep(.katex) {
  color: rgba(255, 255, 255, 0.87);
}

:deep(.katex .base) {
  color: rgba(255, 255, 255, 0.87);
}
</style>
