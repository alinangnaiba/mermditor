<template>
  <v-app-bar
    density="compact"
    color="primary"
    dark
    app
  >
    <v-app-bar-title>Markdown Editor with Mermaid</v-app-bar-title>
  </v-app-bar>

  <MarkdownEditor />
</template>

<script lang="ts" setup>
import MarkdownEditor from '@/components/MarkdownEditor.vue';
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
