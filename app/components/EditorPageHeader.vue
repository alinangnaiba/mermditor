<template>
  <header class="editor-header">
    <NuxtLink to="/" class="editor-logo">
      <img src="../assets/images/logo.png" alt="merMDitor Logo" />
      merMDitor
    </NuxtLink>

    <div class="editor-header-sep" />

    <div class="editor-file-chip">
      <span class="editor-file-dot" :class="{ saved: autosave && lastSaved }" />
      Workspace
    </div>

    <div class="editor-header-spacer" />

    <nav class="editor-header-nav">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/guide">Guide</NuxtLink>
      <NuxtLink to="/feedback">Feedback</NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
  defineProps<{
    autosave: boolean
    lastSaved: string
  }>()
</script>
