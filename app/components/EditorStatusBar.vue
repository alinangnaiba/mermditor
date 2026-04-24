<template>
  <div class="editor-status">
    <div class="editor-status-group">
      <span v-if="autosave && lastSaved" class="editor-status-saved">
        <span class="editor-status-dot" />Saved {{ lastSaved }}
      </span>
      <span v-else class="editor-status-item">
        <strong>{{ openFileCount }}</strong> open files
      </span>
    </div>
    <div class="editor-status-group">
      <span class="editor-status-item">{{ activeFilePath }}</span>
      <span class="editor-status-item">{{ cursorInfo }}</span>
      <span class="editor-status-item">{{ wordCount }} words, {{ charCount }} chars</span>
      <span class="editor-status-item">UTF-8</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    autosave: boolean
    lastSaved: string
    openFileCount: number
    wordCount: number
    charCount: number
    activeFilePath: string
    cursorInfo: string
  }>()
</script>
