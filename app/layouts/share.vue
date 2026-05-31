<template>
  <div class="share-layout" data-theme="dark">
    <slot />
  </div>
</template>

<script setup lang="ts">
if (import.meta.client) {
  document.documentElement.classList.add('dark')
}
</script>

<style>
.share-layout {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}
</style>
