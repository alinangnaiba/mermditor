<template>
  <form @submit.prevent="submitSuggestion">
    <!-- Type -->
    <div class="ff-field">
      <label class="ff-label">Type</label>
      <div class="ff-type-group" role="group" aria-label="Feedback type">
        <button
          v-for="opt in typeOptions"
          :key="opt.value"
          type="button"
          class="ff-type-btn"
          :class="{ active: form.type === opt.value }"
          @click="form.type = opt.value"
        >{{ opt.label }}</button>
      </div>
    </div>

    <!-- Title -->
    <div class="ff-field">
      <label class="ff-label" for="ff-title">Title <span class="ff-req">*</span></label>
      <input
        id="ff-title"
        v-model="form.title"
        type="text"
        required
        maxlength="200"
        placeholder="Brief summary"
        class="ff-input"
      />
    </div>

    <!-- Details -->
    <div class="ff-field">
      <label class="ff-label" for="ff-details">Details <span class="ff-req">*</span></label>
      <textarea
        id="ff-details"
        v-model="form.description"
        required
        rows="5"
        placeholder="Describe the bug or idea in detail..."
        class="ff-input ff-textarea"
      />
    </div>

    <!-- Email -->
    <div class="ff-field">
      <label class="ff-label" for="ff-email">Email <span class="ff-opt">(optional)</span></label>
      <input
        id="ff-email"
        v-model="form.email"
        type="email"
        placeholder="you@example.com"
        class="ff-input"
      />
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="ff-submit"
      :disabled="isSubmitting || !form.title || !form.description"
    >
      <span v-if="!isSubmitting">Send Feedback</span>
      <span v-else>Submitting…</span>
    </button>

    <p class="ff-privacy">We don't share your data with anyone.</p>

    <!-- Success -->
    <div v-if="submitted" class="ff-notice ff-success">
      Feedback submitted — thank you!
    </div>

    <!-- Error -->
    <div v-if="error" class="ff-notice ff-error">
      {{ error }}
    </div>
  </form>
</template>

<script setup lang="ts">
  const typeOptions = [
    { label: 'Bug',     value: 'Bug Report' },
    { label: 'Feature', value: 'Feature Request' },
    { label: 'Other',   value: 'Other' },
  ]

  const form = ref({
    type: 'Bug Report',
    title: '',
    description: '',
    email: '',
  })

  const isSubmitting = ref(false)
  const submitted = ref(false)
  const error = ref('')
  const issueUrl = ref('')

  // Fetch CSRF token on mount so the csrf-token cookie is set before submission
  onMounted(async () => {
    await $fetch('/api/csrf')
  })

  const resetForm = () => {
    form.value = {
      type: 'Bug Report',
      title: '',
      description: '',
      email: '',
    }
    submitted.value = false
    error.value = ''
    issueUrl.value = ''
  }

  // Get CSRF token from cookie
  const getCsrfToken = (): string | undefined => {
    if (!import.meta.client) return undefined
    const match = document.cookie.match(/csrf-token=([^;]+)/)
    return match ? match[1] : undefined
  }

  const submitSuggestion = async () => {
    isSubmitting.value = true
    error.value = ''
    try {
      const csrfToken = getCsrfToken()
      const data = (await $fetch('/api/suggestions', {
        method: 'POST',
        body: form.value,
        headers: csrfToken ? {
          'x-csrf-token': csrfToken
        } : {}
      })) as { success: boolean; issueUrl: string; issueNumber: number }

      submitted.value = true
      issueUrl.value = data.issueUrl

      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
      }, 3000)
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isSubmitting.value = false
    }
  }
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ff-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ff-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--dim);
}

.ff-req { color: var(--accent); }
.ff-opt { font-weight: 400; color: var(--muted); }

.ff-type-group {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.ff-type-btn {
  flex: 1;
  padding: 7px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dim);
  background: transparent;
  border: none;
  border-right: 1px solid var(--border);
  cursor: pointer;
  transition: color 0.12s, background 0.12s;
}

.ff-type-btn:last-child { border-right: none; }

.ff-type-btn:hover { color: var(--text); background: var(--raised); }

.ff-type-btn.active {
  color: var(--text);
  background: var(--raised);
  font-weight: 600;
}

.ff-input {
  width: 100%;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 10px;
  font-size: 0.875rem;
  color: var(--text);
  outline: none;
  transition: border-color 0.12s;
  font-family: inherit;
  box-sizing: border-box;
}

.ff-input::placeholder { color: var(--muted); }
.ff-input:focus { border-color: var(--accent); }

.ff-input:-webkit-autofill,
.ff-input:-webkit-autofill:hover,
.ff-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 100px var(--raised) inset;
  -webkit-text-fill-color: var(--text);
  caret-color: var(--text);
  border-color: var(--accent);
}

.ff-textarea {
  resize: vertical;
  min-height: 110px;
}

.ff-submit {
  width: 100%;
  padding: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 2px;
}

.ff-submit:hover:not(:disabled) { background: #5f9fff; }

.ff-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ff-privacy {
  text-align: center;
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

.ff-notice {
  padding: 10px 14px;
  border-radius: var(--radius);
  font-size: 0.875rem;
}

.ff-success {
  background: rgba(63, 185, 80, 0.1);
  border: 1px solid var(--green);
  color: var(--green);
}

.ff-error {
  background: rgba(255, 80, 80, 0.08);
  border: 1px solid #f85149;
  color: #f85149;
}
</style>
