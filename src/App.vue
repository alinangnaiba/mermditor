<template>
  <Analytics />
  <SpeedInsights />
  <div class="app-container bg-dark">
    <router-view class="flex-grow" />
  </div>
</template>

<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { Analytics } from '@vercel/analytics/vue';
</script>

<!-- Using styles from global.css -->
