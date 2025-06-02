<template>
  <div>
    <NuxtRouteAnnouncer />
    <Analytics />
    <SpeedInsights />
    <div class="app-container bg-dark">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { Analytics } from '@vercel/analytics/vue'

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
  overflow-y: auto;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
