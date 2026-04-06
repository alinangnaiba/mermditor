<template>
  <div v-if="isOpen" class="modal-overlay" @click="emit('cancel')">
    <div class="modal-box" @click.stop>
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="modal-close" aria-label="Close" @click="emit('cancel')">
          <PhX :size="14" />
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-label">{{ label }}</label>
        <input
          ref="inputRef"
          v-model="value"
          type="text"
          class="modal-input"
          :placeholder="placeholder"
          @keydown.enter="handleConfirm"
          @keydown.escape="emit('cancel')"
        />
        <p v-if="helperText" class="modal-helper">{{ helperText }}</p>
        <p v-if="errorText" class="modal-error">{{ errorText }}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="emit('cancel')">Cancel</button>
        <button class="modal-btn modal-btn-confirm" :disabled="!value.trim()" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { PhX } from '@phosphor-icons/vue'

  interface Props {
    isOpen: boolean
    title: string
    label: string
    confirmText?: string
    initialValue?: string
    placeholder?: string
    helperText?: string
    errorText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    confirmText: 'Save',
    initialValue: '',
    placeholder: '',
    helperText: '',
    errorText: '',
  })

  const emit = defineEmits<{
    confirm: [value: string]
    cancel: []
  }>()

  const value = ref('')
  const inputRef = ref<HTMLInputElement | null>(null)

  const handleConfirm = (): void => {
    if (value.value.trim()) {
      emit('confirm', value.value.trim())
    }
  }

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (!isOpen) {
        return
      }

      value.value = props.initialValue
      await nextTick()
      inputRef.value?.focus()
      inputRef.value?.select()
    }
  )
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
  background: rgba(0, 0, 0, 0.35);
}

.modal-box {
  width: 100%;
  max-width: 360px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 0;
}

.modal-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dim);
  letter-spacing: 0.01em;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
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
  padding: 10px 12px 12px;
}

.modal-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}

.modal-input {
  width: 100%;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 5px 8px;
  font-size: 0.8125rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color 0.12s;
  height: 28px;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: var(--accent);
}

.modal-input::placeholder {
  color: var(--muted);
}

.modal-helper {
  margin-top: 6px;
  font-size: 0.75rem;
  color: var(--muted);
  line-height: 1.4;
}

.modal-error {
  margin-top: 6px;
  font-size: 0.75rem;
  color: #ff8d8d;
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 0 12px 12px;
}

.modal-btn {
  height: 26px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: background 0.12s, color 0.12s;
}

.modal-btn-cancel {
  background: transparent;
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

.modal-btn-confirm:hover {
  background: #5f9fff;
}

.modal-btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
