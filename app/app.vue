<template>
  <Analytics />
  <SpeedInsights />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  import { SpeedInsights } from '@vercel/speed-insights/vue'
  import { Analytics } from '@vercel/analytics/nuxt'
</script>
