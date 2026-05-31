<template>
  <Teleport to="body">
    <div v-if="isOpen" class="share-modal-overlay" @click.self="$emit('close')">
      <div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
        <div class="share-modal-header">
          <h2 id="share-modal-title" class="share-modal-title">Share Document</h2>
          <button class="share-modal-close" aria-label="Close" @click="$emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="share-modal-body">
          <p class="share-modal-desc">
            Anyone with this link can view the rendered document — no account needed.
          </p>

          <div class="share-url-row">
            <input
              ref="urlInputEl"
              :value="shareUrl"
              class="share-url-input"
              readonly
              aria-label="Share URL"
              @focus="($event.target as HTMLInputElement).select()"
            />
            <button
              class="share-copy-btn"
              :class="{ copied }"
              :title="copied ? 'Copied!' : 'Copy link'"
              @click="copyUrl"
            >
              <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <div v-if="sizeWarning" class="share-size-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            This document is large (~{{ sizeKb }} KB compressed). The link will work in all major browsers and apps like MS Teams and Slack, but may be too long for Twitter/X.
          </div>

          <div class="share-modal-footer">
            <a :href="shareUrl" target="_blank" rel="noopener noreferrer" class="share-preview-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Preview link
            </a>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { buildShareUrl, estimateShareUrlBytes, SHARE_SIZE_WARN_BYTES } from '../utils/shareLink'

  interface Props {
    isOpen: boolean
    content: string
  }

  const props = defineProps<Props>()
  defineEmits<{ close: [] }>()

  const copied = ref(false)
  const urlInputEl = ref<HTMLInputElement | null>(null)

  const shareUrl = computed(() =>
    import.meta.client ? buildShareUrl(props.content, window.location.origin) : ''
  )

  const urlBytes = computed(() =>
    import.meta.client ? estimateShareUrlBytes(props.content) : 0
  )

  const sizeWarning = computed(() => urlBytes.value > SHARE_SIZE_WARN_BYTES)
  const sizeKb = computed(() => Math.round(urlBytes.value / 1024))

  let copiedTimer: ReturnType<typeof setTimeout> | null = null

  const copyUrl = async () => {
    if (!shareUrl.value) return
    try {
      await navigator.clipboard.writeText(shareUrl.value)
    } catch {
      urlInputEl.value?.select()
      document.execCommand('copy')
    }
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => { copied.value = false }, 2000)
  }

  watch(() => props.isOpen, (open) => {
    if (!open) {
      copied.value = false
      if (copiedTimer) clearTimeout(copiedTimer)
    }
  })
</script>

<style scoped>
.share-modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.share-modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(var(--shadow-rgb), 0.5);
}

.share-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
}

.share-modal-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.share-modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.12s, color 0.12s;
}

.share-modal-close:hover {
  background: var(--raised);
  color: var(--text);
}

.share-modal-close svg { width: 16px; height: 16px; }

.share-modal-body {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.share-modal-desc {
  font-size: 0.82rem;
  color: var(--dim);
  margin: 0;
  line-height: 1.5;
}

.share-url-row {
  display: flex;
  gap: 8px;
}

.share-url-input {
  flex: 1;
  background: var(--raised);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 7px 10px;
  color: var(--dim);
  font-size: 0.78rem;
  font-family: monospace;
  outline: none;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.share-url-input:focus {
  border-color: var(--accent);
  color: var(--text);
}

.share-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.12s, background 0.12s;
  flex-shrink: 0;
}

.share-copy-btn svg { width: 14px; height: 14px; }

.share-copy-btn:hover { opacity: 0.85; }

.share-copy-btn.copied {
  background: var(--green);
}

.share-size-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--warning-soft);
  border: 1px solid rgba(240, 136, 62, 0.2);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 0.78rem;
  color: var(--orange);
  line-height: 1.5;
}

.share-size-warning svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  margin-top: 1px;
}

.share-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}

.share-preview-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--dim);
  text-decoration: none;
  transition: color 0.12s;
}

.share-preview-link:hover { color: var(--accent); }
.share-preview-link svg { width: 13px; height: 13px; }
</style>
