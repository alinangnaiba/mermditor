<template>
  <SpeedInsights />
  <div class="app-container bg-dark">
    <router-view class="flex-grow" />
  </div>
</template>

<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/vue"
</script>

<!-- Using styles from global.css -->
