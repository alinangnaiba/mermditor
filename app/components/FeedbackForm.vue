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

    <!-- Attachments -->
    <div v-if="isBugReport" class="ff-field">
      <label class="ff-label" for="ff-attachments">Attachments <span class="ff-opt">(optional)</span></label>
      <input
        id="ff-attachments"
        ref="attachmentInput"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,text/plain,text/markdown,application/json,text/csv,.txt,.md,.markdown,.log,.json,.csv"
        class="ff-file-input"
        @change="selectAttachments"
      />
      <p class="ff-attachment-help">Up to 10 screenshots or text files, 10 MB each. Uploaded files are linked publicly in the GitHub issue.</p>

      <ul v-if="selectedFiles.length" class="ff-attachment-list">
        <li v-for="(file, index) in selectedFiles" :key="`${file.name}-${file.size}-${index}`">
          <span>{{ file.name }}</span>
          <span>{{ formatBytes(file.size) }}</span>
          <button type="button" @click="removeAttachment(index)">Remove</button>
        </li>
      </ul>

      <ul v-if="rejectedAttachments.length" class="ff-attachment-errors">
        <li v-for="failure in rejectedAttachments" :key="`${failure.filename}-${failure.error}`">
          {{ failure.filename }}: {{ failure.error }}
        </li>
      </ul>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="ff-submit"
      :disabled="isSubmitting || !form.title || !form.description"
    >
      <span v-if="!isSubmitting">Send Feedback</span>
      <span v-else>{{ submitLabel }}</span>
    </button>

    <p class="ff-privacy">If you include your email, it'll only be used to follow up about this feedback — never shared or published.</p>

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
  import { upload } from '@vercel/blob/client'
  import { computed, onMounted, ref, watch } from 'vue'

  interface FeedbackAttachment {
    filename: string
    url: string
    contentType: string
    size: number
  }

  interface FeedbackAttachmentUploadFailure {
    filename: string
    error: string
  }

  const MAX_ATTACHMENTS = 10
  const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024
  const ALLOWED_ATTACHMENT_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'text/plain',
    'text/markdown',
    'application/json',
    'text/csv',
  ])
  const EXTENSION_CONTENT_TYPES: Record<string, string> = {
    '.csv': 'text/csv',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
    '.log': 'text/plain',
    '.markdown': 'text/markdown',
    '.md': 'text/markdown',
    '.png': 'image/png',
    '.txt': 'text/plain',
    '.webp': 'image/webp',
  }

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
  const attachmentInput = ref<HTMLInputElement | null>(null)
  const selectedFiles = ref<File[]>([])
  const rejectedAttachments = ref<FeedbackAttachmentUploadFailure[]>([])
  const isUploadingAttachments = ref(false)
  const isBugReport = computed(() => form.value.type === 'Bug Report')
  const submitLabel = computed(() => isUploadingAttachments.value ? 'Uploading attachments…' : 'Submitting…')

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
    selectedFiles.value = []
    rejectedAttachments.value = []
    if (attachmentInput.value) {
      attachmentInput.value.value = ''
    }
    submitted.value = false
    error.value = ''
  }

  const clearAttachments = () => {
    selectedFiles.value = []
    rejectedAttachments.value = []
    if (attachmentInput.value) {
      attachmentInput.value.value = ''
    }
  }

  watch(() => form.value.type, (type) => {
    if (type !== 'Bug Report') {
      clearAttachments()
    }
  })

  // Get CSRF token from cookie
  const getCsrfToken = (): string | undefined => {
    if (!import.meta.client) return undefined
    const match = document.cookie.match(/csrf-token=([^;]+)/)
    return match ? match[1] : undefined
  }

  const getFileExtension = (filename: string): string => {
    const dotIndex = filename.lastIndexOf('.')
    return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : ''
  }

  const getAttachmentContentType = (file: File): string => {
    if (ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
      return file.type
    }

    return EXTENSION_CONTENT_TYPES[getFileExtension(file.name)] ?? file.type
  }

  const sanitizeAttachmentFilename = (filename: string): string => {
    const safeName = filename
      .replace(/[\\/]/g, '-')
      .replace(/[^a-zA-Z0-9._ -]/g, '')
      .trim()
      .slice(0, 120)

    return safeName || 'attachment'
  }

  const formatBytes = (size: number): string => {
    if (size < 1024 * 1024) {
      return `${Math.ceil(size / 1024)} KB`
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  const selectAttachments = (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files ?? [])
    const acceptedFiles = [...selectedFiles.value]
    const failures = [...rejectedAttachments.value]

    for (const file of files) {
      if (acceptedFiles.length >= MAX_ATTACHMENTS) {
        failures.push({
          filename: sanitizeAttachmentFilename(file.name),
          error: 'Only 10 files can be uploaded',
        })
        continue
      }

      const contentType = getAttachmentContentType(file)
      if (!ALLOWED_ATTACHMENT_TYPES.has(contentType)) {
        failures.push({
          filename: sanitizeAttachmentFilename(file.name),
          error: 'File type is not supported',
        })
        continue
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        failures.push({
          filename: sanitizeAttachmentFilename(file.name),
          error: 'File is larger than 10 MB',
        })
        continue
      }

      acceptedFiles.push(file)
    }

    selectedFiles.value = acceptedFiles
    rejectedAttachments.value = failures
    input.value = ''
  }

  const removeAttachment = (index: number) => {
    selectedFiles.value = selectedFiles.value.filter((_, fileIndex) => fileIndex !== index)
    if (!selectedFiles.value.length && attachmentInput.value) {
      attachmentInput.value.value = ''
    }
  }

  const createUploadBatchId = (): string => {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  const uploadAttachments = async (csrfToken: string | undefined): Promise<{
    attachments: FeedbackAttachment[]
    attachmentUploadFailures: FeedbackAttachmentUploadFailure[]
  }> => {
    const attachments: FeedbackAttachment[] = []
    const attachmentUploadFailures = [...rejectedAttachments.value]

    if (!isBugReport.value || !selectedFiles.value.length) {
      return { attachments, attachmentUploadFailures }
    }

    isUploadingAttachments.value = true
    const uploadBatchId = createUploadBatchId()

    for (const file of selectedFiles.value) {
      const filename = sanitizeAttachmentFilename(file.name)
      const contentType = getAttachmentContentType(file)

      try {
        const blob = await upload(`feedback/${uploadBatchId}/${filename}`, file, {
          access: 'public',
          handleUploadUrl: '/api/feedback-attachments/upload',
          contentType,
          headers: csrfToken ? { 'x-csrf-token': csrfToken } : {},
        })

        attachments.push({
          filename,
          url: blob.url,
          contentType,
          size: file.size,
        })
      } catch (uploadError) {
        attachmentUploadFailures.push({
          filename,
          error: uploadError instanceof Error ? uploadError.message : 'Upload failed before feedback submission',
        })
      }
    }

    isUploadingAttachments.value = false
    return { attachments, attachmentUploadFailures }
  }

  const submitSuggestion = async () => {
    isSubmitting.value = true
    error.value = ''
    try {
      const csrfToken = getCsrfToken()
      const { attachments, attachmentUploadFailures } = await uploadAttachments(csrfToken)
      await $fetch('/api/suggestions', {
        method: 'POST',
        body: {
          ...form.value,
          attachments,
          attachmentUploadFailures,
        },
        headers: csrfToken ? {
          'x-csrf-token': csrfToken
        } : {}
      })

      submitted.value = true

      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
      }, 3000)
    } catch {
      error.value = 'Something went wrong. Please try again.'
    } finally {
      isUploadingAttachments.value = false
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

.ff-file-input {
  width: 100%;
  color: var(--dim);
  font-size: 0.8125rem;
}

.ff-file-input::file-selector-button {
  margin-right: 10px;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--raised);
  color: var(--text);
  font: inherit;
  cursor: pointer;
}

.ff-attachment-help {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--muted);
}

.ff-attachment-list,
.ff-attachment-errors {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 2px 0 0;
  list-style: none;
}

.ff-attachment-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  align-items: center;
  min-height: 30px;
  padding: 6px 8px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--raised);
  font-size: 0.8125rem;
}

.ff-attachment-list span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ff-attachment-list span:nth-child(2) {
  color: var(--muted);
  white-space: nowrap;
}

.ff-attachment-list button {
  border: none;
  background: transparent;
  color: var(--accent);
  font: inherit;
  cursor: pointer;
}

.ff-attachment-errors li {
  color: #f85149;
  font-size: 0.75rem;
  line-height: 1.45;
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
