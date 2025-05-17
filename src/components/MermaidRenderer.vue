<template>
  <div class="mermaid-wrapper">
    <div class="mermaid-controls">
      <button @click="zoomIn" title="Zoom In">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M3.75 7.5a.75.75 0 0 1 .75-.75h2.25V4.5a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5H8.25v2.25a.75.75 0 0 1-1.5 0V8.25H4.5a.75.75 0 0 1-.75-.75Z"/>
          <path d="M7.5 0a7.5 7.5 0 0 1 5.807 12.247l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 1 1 7.5 0Zm-6 7.5a6 6 0 1 0 12 0 6 6 0 0 0-12 0Z"/>
        </svg>
        <span>Zoom In</span>
      </button>
      <button @click="reset" title="Reset">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path>
        </svg>
        <span>Reset</span>
      </button>
      <button @click="zoomOut" title="Zoom Out">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M4.5 6.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5Z"/>
          <path d="M0 7.5a7.5 7.5 0 1 1 13.307 4.747l2.473 2.473a.749.749 0 1 1-1.06 1.06l-2.473-2.473A7.5 7.5 0 0 1 0 7.5Zm7.5-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/>
        </svg>
        <span>Zoom Out</span>
      </button>
    </div>
    <div
      ref="mermaidContainer"
      class="mermaid-diagram-container"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      :style="diagramStyle"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue';
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

const scale = ref(1);
const pan = ref({ x: 0, y: 0 });
const isPanning = ref(false);
const startPanPosition = ref({ x: 0, y: 0 });

const diagramStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${pan.value.x}px, ${pan.value.y}px)`,
  cursor: isPanning.value ? 'grabbing' : 'grab',
  transition: isPanning.value ? 'none' : 'transform 0.2s ease-out',
}));

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3); // Max zoom 3x
};

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.2); // Min zoom 0.2x
};

const reset = () => {
  scale.value = 1;
  pan.value = { x: 0, y: 0 };
};

const handleMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) return; // Only pan with left mouse button
  isPanning.value = true;
  startPanPosition.value = {
    x: event.clientX - pan.value.x,
    y: event.clientY - pan.value.y,
  };
  // Prevent text selection while dragging
  event.preventDefault();
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isPanning.value) return;
  pan.value = {
    x: event.clientX - startPanPosition.value.x,
    y: event.clientY - startPanPosition.value.y,
  };
};

const handleMouseUp = () => {
  isPanning.value = false;
};

const renderMermaidDiagram = async () => {
  if (mermaidContainer.value && props.code) {
    try {
      mermaidContainer.value.innerHTML = '<div class="mermaid-loading">Rendering diagram...</div>';
      await nextTick();

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
    mermaidContainer.value.innerHTML = '';
  }
};

onMounted(async () => {
  await renderMermaidDiagram();
});

watch(() => props.code, async () => {
  // Reset zoom/pan when code changes, as the diagram might be different
  reset();
  await renderMermaidDiagram();
}, { immediate: false });
</script>

<style scoped>
.mermaid-wrapper {
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 4px;
}

.mermaid-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  gap: 4px;
  background-color: rgba(45, 45, 45, 0.7);
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.mermaid-controls button {
  background-color: transparent;
  border: none;
  color: #d1d5da;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  width: 32px;
  height: 32px;
}

.mermaid-controls button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.mermaid-controls button svg {
  pointer-events: none;
  fill: currentColor;
  display: block;
  margin: auto;
}

.mermaid-controls button span {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.mermaid-diagram-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  background-color: #1a1a1a;
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
