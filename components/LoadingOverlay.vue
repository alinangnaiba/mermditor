<template>
  <div 
    v-if="isLoading"
    class="fixed inset-0 z-50 flex items-center justify-center bg-deep-black"
    :class="{ 'opacity-0 pointer-events-none': !isLoading }"
    style="transition: opacity 0.3s ease-out"
  >
    <!-- Background with subtle pattern -->
    <div class="absolute inset-0 bg-deep-black">
      <div 
        class="absolute inset-0 opacity-5"
        style="background-image: radial-gradient(circle at 25% 25%, #79B5D7 1px, transparent 1px); background-size: 50px 50px;"
      />
    </div>
    
    <!-- Loading content -->
    <div class="relative z-10 text-center">
      <!-- Logo and brand -->
      <div class="mb-8">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10">
          <img src="~/assets/logo.png" alt="merMDitor" class="h-10 w-10" >
        </div>
        <h1 class="text-2xl font-semibold text-accent-primary mb-2">merMDitor</h1>
        <p class="text-text-secondary text-sm">Loading your markdown editor...</p>
      </div>

      <!-- Animated loading spinner -->
      <div class="mb-8">
        <div class="relative mx-auto h-8 w-8">
          <!-- Outer ring -->
          <div 
            class="absolute inset-0 rounded-full border-2 border-accent-primary/20"
          />
          <!-- Spinning ring -->
          <div 
            class="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin"
          />
          <!-- Inner dot -->
          <div 
            class="absolute inset-2 rounded-full bg-accent-primary/30 animate-pulse"
          />
        </div>
      </div>

      <!-- Loading steps -->
      <div class="space-y-2 text-sm text-text-tertiary">
        <div class="flex items-center justify-center space-x-2">
          <div 
            class="h-1 w-1 rounded-full bg-accent-primary animate-bounce"
            style="animation-delay: 0ms"
          />
          <div 
            class="h-1 w-1 rounded-full bg-accent-primary animate-bounce"
            style="animation-delay: 150ms"
          />
          <div 
            class="h-1 w-1 rounded-full bg-accent-primary animate-bounce"
            style="animation-delay: 300ms"
          />
        </div>
        <p class="mt-4">{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  isLoading?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: true
});

// Cycling loading messages
const loadingMessages = [
  'Initializing editor components...',
  'Loading markdown renderer...',
  'Setting up Mermaid diagrams...',
  'Preparing math expressions...',
  'Almost ready...'
];

const loadingMessage = ref(loadingMessages[0]);
let messageIndex = 0;
let messageInterval: NodeJS.Timeout;

onMounted(() => {
  // Cycle through loading messages
  messageInterval = setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingMessage.value = loadingMessages[messageIndex];
  }, 800);
});

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval);
  }
});
</script>

<style scoped>
/* Additional animations for smoother experience */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-content {
  animation: fadeIn 0.5s ease-out;
}
</style>
