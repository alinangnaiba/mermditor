<template>
  <Analytics />
  <SpeedInsights />
  <div>
    <NuxtRouteAnnouncer />
    <div class="app-container bg-dark">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { Analytics } from '@vercel/analytics/nuxt'

const route = useRoute()

// Apply overflow style directly to body based on route
watchEffect(() => {
  if (import.meta.client) {
    document.body.style.overflow = route.name === 'editor' ? 'hidden' : 'auto'
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = 'auto'
  }
})

// Global head configuration
useHead({
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
html, body {
  height: 100%;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
