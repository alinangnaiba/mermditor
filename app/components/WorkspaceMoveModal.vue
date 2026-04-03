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
        <p class="modal-message">Choose a destination for <strong>{{ itemName }}</strong>.</p>
        <label class="modal-label">Destination folder</label>
        <select
          ref="selectRef"
          v-model="selectedId"
          class="modal-select"
          @keydown.enter="handleConfirm"
          @keydown.escape="emit('cancel')"
        >
          <option
            v-for="option in options"
            :key="option.id"
            :value="option.id"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
        </select>
        <p v-if="errorText" class="modal-error">{{ errorText }}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel" @click="emit('cancel')">Cancel</button>
        <button
          class="modal-btn modal-btn-confirm"
          :disabled="!selectedId || !hasEnabledOption"
          @click="handleConfirm"
        >
          Move
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue'
  import { PhX } from '@phosphor-icons/vue'

  interface MoveOption {
    id: string
    label: string
    disabled?: boolean
  }

  interface Props {
    isOpen: boolean
    title?: string
    itemName: string
    options: MoveOption[]
    initialFolderId?: string
    errorText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Move Item',
    initialFolderId: '',
    errorText: '',
  })

  const emit = defineEmits<{
    confirm: [folderId: string]
    cancel: []
  }>()

  const selectedId = ref('')
  const selectRef = ref<HTMLSelectElement | null>(null)

  const hasEnabledOption = computed(() => props.options.some((option) => !option.disabled))

  const getInitialSelection = (): string => {
    const initialOption = props.options.find(
      (option) => option.id === props.initialFolderId && !option.disabled
    )
    if (initialOption) {
      return initialOption.id
    }

    return props.options.find((option) => !option.disabled)?.id ?? ''
  }

  const handleConfirm = (): void => {
    if (selectedId.value) {
      emit('confirm', selectedId.value)
    }
  }

  watch(
    () => props.isOpen,
    async (isOpen) => {
      if (!isOpen) {
        return
      }

      selectedId.value = getInitialSelection()
      await nextTick()
      selectRef.value?.focus()
    }
  )
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
}

.modal-box {
  width: 100%;
  max-width: 440px;
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
  margin-bottom: 14px;
  font-size: 0.875rem;
  color: var(--dim);
  line-height: 1.6;
}

.modal-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dim);
  margin-bottom: 8px;
}

.modal-select {
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

.modal-select:focus {
  border-color: var(--accent);
}

.modal-error {
  margin-top: 8px;
  font-size: 0.76rem;
  color: #ff8d8d;
  line-height: 1.5;
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

.modal-btn-confirm:hover {
  background: #5f9fff;
}

.modal-btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
