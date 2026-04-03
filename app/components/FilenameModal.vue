<template>
  <div v-if="isOpen" class="modal-overlay" @click="emit('cancel')">
    <div class="modal-box" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">Save As</h3>
        <button class="modal-close" aria-label="Close" @click="emit('cancel')">
          <PhX :size="16" />
        </button>
      </div>
      <div class="modal-body">
        <label class="modal-label">Filename (without extension)</label>
        <input
          ref="filenameInput"
          v-model="filename"
          type="text"
          class="modal-input"
          placeholder="Enter filename"
          @keydown.enter="handleSave"
          @keydown.escape="emit('cancel')"
        />
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="emit('cancel')">Cancel</button>
        <button class="modal-btn modal-btn-confirm" :disabled="!filename.trim()" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick } from 'vue'
  import { PhX } from '@phosphor-icons/vue'

  interface Props {
    isOpen: boolean
    defaultFilename?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    defaultFilename: '',
  })

  const emit = defineEmits<{
    save: [filename: string]
    cancel: []
  }>()

  const filename = ref('')
  const filenameInput = ref<HTMLInputElement | null>(null)

  const handleSave = () => {
    if (filename.value.trim()) {
      emit('save', filename.value.trim())
    }
  }

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (isOpen) {
        filename.value = props.defaultFilename
        await nextTick()
        filenameInput.value?.focus()
        filenameInput.value?.select()
      }
    }
  )
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

.modal-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dim);
  margin-bottom: 8px;
}

.modal-input {
  width: 100%;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 9px 12px;
  font-size: 0.9rem;
  color: var(--text);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.modal-input:focus { border-color: var(--accent); }
.modal-input::placeholder { color: var(--muted); }

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
.modal-btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
