<template>
  <div v-if="isOpen" class="modal-overlay" @click="emit('cancel')">
    <div class="modal-box" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button class="modal-close" aria-label="Close" @click="emit('cancel')">
          <PhX :size="16" />
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-message">{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="emit('cancel')">{{ cancelText }}</button>
        <button class="modal-btn modal-btn-confirm" @click="emit('confirm')">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PhX } from '@phosphor-icons/vue'

  interface Props {
    isOpen: boolean
    title?: string
    message: string
    confirmText?: string
    cancelText?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Please confirm',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  const emit = defineEmits<{
    confirm: []
    cancel: []
  }>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
}

.modal-box {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 14px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.modal-close {
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

.modal-close:hover {
  color: var(--text);
  background: var(--raised);
}

.modal-body {
  padding: 18px;
}

.modal-message {
  font-size: 0.9375rem;
  color: var(--dim);
  line-height: 1.65;
  white-space: pre-line;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid var(--border);
  background: var(--raised);
}

.modal-btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 5px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: background 0.12s, color 0.12s;
}

.modal-btn-cancel {
  background: var(--surface);
  color: var(--dim);
}

.modal-btn-cancel:hover {
  background: var(--raised);
  color: var(--text);
}

.modal-btn-confirm {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.modal-btn-confirm:hover { background: #5f9fff; }
</style>
