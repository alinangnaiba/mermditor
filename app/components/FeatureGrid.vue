<template>
  <div class="index-features-section">
    <div class="index-section-inner">
      <div class="index-section-eyebrow">What's included</div>
      <h2>Everything you need, nothing you don't</h2>
      <p>No plugins. No setup. Works in the browser.</p>
      <div class="index-features-grid">
        <div v-for="feature in features" :key="feature.name" class="index-feature">
          <div class="index-feature-name">{{ feature.name }}</div>
          <div class="index-feature-desc">{{ feature.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    features: Array<{ name: string; desc: string }>
  }>()
</script>
