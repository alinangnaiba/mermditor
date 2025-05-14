<template>
  <v-app theme="dark">
    <v-main class="fill-height">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// App.vue is the root component
</script>

<style>
/* Global styles */
html, body {
  height: 100%;
  overflow-y: auto;
}

:root {
  --md-editor-height: 100vh;
}

.fill-height {
  height: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Custom global styles for the app */
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
