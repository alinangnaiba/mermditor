<template>
  <div class="dark min-h-screen bg-gray-900 text-gray-100">
    <slot />
  </div>
</template>

<script setup>
// Add dark class to html element
if (import.meta.client) {
  document.documentElement.classList.add('dark')
}
</script>
