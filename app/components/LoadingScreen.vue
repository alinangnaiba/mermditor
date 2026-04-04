<template>
  <div
    class="loading-screen fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
    :class="[theme, { 'opacity-0 pointer-events-none': !internalShow }]"
  >
    <div class="text-center">
      <!-- Logo -->
      <div class="mb-8">
        <img
          src="../assets/images/logo.png"
          alt="merMDitor Logo"
          class="mx-auto mb-4 h-16 animate-pulse"
        />
        <h1 class="loading-title mb-2 text-2xl font-bold">merMDitor</h1>
        <p class="loading-subtitle">Markdown Editor with Mermaid Support</p>
      </div>

      <!-- Loading Animation -->
      <div class="mb-6">
        <div class="flex justify-center space-x-2">
          <div
            v-for="i in 3"
            :key="i"
            :class="[
              'h-3 w-3 animate-bounce rounded-full bg-blue-500',
              i === 1 ? 'animation-delay-0' : '',
              i === 2 ? 'animation-delay-150' : '',
              i === 3 ? 'animation-delay-300' : '',
            ]"
            :style="{ animationDelay: `${(i - 1) * 150}ms` }"
          />
        </div>
      </div>

      <!-- Loading Text -->
      <div class="loading-message">
        <p class="mb-2">{{ loadingText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'

  interface Props {
    show?: boolean
    step?: string
    theme?: 'dark' | 'light'
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
    step: 'Loading...',
    theme: 'dark',
  })

  const emit = defineEmits<{
    'loading-complete': []
  }>()

  const internalShow = ref(true)

  const loadingText = computed(() => props.step)

  // Watch for show prop changes to handle fade out
  watch(
    () => props.show,
    (newShow) => {
      if (!newShow) {
        internalShow.value = false
        // Emit after transition completes
        setTimeout(() => {
          emit('loading-complete')
        }, 300)
      }
    }
  )

  onMounted(() => {
    internalShow.value = props.show
  })
</script>

<style scoped>
  .loading-screen {
    background: var(--bg);
  }

  .loading-title {
    color: var(--text);
  }

  .loading-subtitle,
  .loading-message {
    color: var(--dim);
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }
</style>
