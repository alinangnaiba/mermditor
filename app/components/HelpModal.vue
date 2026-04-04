<template>
  <div v-if="isOpen" class="help-overlay" @click="closeModal">
    <div class="help-box" @click.stop>
      <div class="help-header">
        <h2 class="help-title">Quick Reference</h2>
        <button class="help-close" @click="closeModal">
          <PhX :size="16" />
        </button>
      </div>
      <div class="help-scroll">
        <GuideContent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PhX } from '@phosphor-icons/vue'
  import GuideContent from './GuideContent.vue'

  defineProps<{ isOpen: boolean }>()
  const emit = defineEmits(['close'])

  const closeModal = () => emit('close')
</script>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.6);
}

.help-box {
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.help-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.help-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.help-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  color: var(--muted);
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.12s, background 0.12s;
}

.help-close:hover {
  color: var(--text);
  background: var(--raised);
}

.help-scroll {
  overflow-y: auto;
  padding: 24px;
  flex: 1;
}
</style>
