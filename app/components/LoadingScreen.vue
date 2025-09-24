<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 transition-opacity duration-500"
    :class="{ 'opacity-0': !internalShow }"
  >
    <div class="text-center">
      <!-- Logo -->
      <div class="mb-8">
        <img
          src="../assets/images/logo.png"
          alt="merMDitor Logo"
          class="mx-auto mb-4 h-16 animate-pulse"
        />
        <h1 class="mb-2 text-2xl font-bold text-white">merMDitor</h1>
        <p class="text-gray-400">Markdown Editor with Mermaid Support</p>
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
      <div class="text-gray-300">
        <p class="mb-2">{{ loadingText }}</p>
        <div class="mx-auto h-2 w-64 overflow-hidden rounded-full bg-gray-700">
          <div
            class="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            :style="{ width: `${formattedProgress}%` }"
          />
        </div>
        <p class="mt-2 text-sm text-gray-500">{{ formattedProgress }}% complete</p>
      </div>

      <!-- Loading Steps -->
      <div class="mx-auto mt-8 max-w-md text-left">
        <div class="space-y-2">
          <div
            v-for="step in loadingSteps"
            :key="step.id"
            :class="[
              'flex items-center space-x-3 text-sm transition-opacity duration-300',
              step.completed ? 'text-green-400' : step.active ? 'text-blue-400' : 'text-gray-500',
            ]"
          >
            <div class="flex-shrink-0">
              <PhCheckCircle v-if="step.completed" :size="16" />
              <PhSpinner v-else-if="step.active" :size="16" class="animate-spin" />
              <PhCircle v-else :size="16" />
            </div>
            <span>{{ step.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhCheckCircle, PhSpinner, PhCircle } from '@phosphor-icons/vue'

interface LoadingStep {
  id: string
  label: string
  completed: boolean
  active: boolean
}

interface Props {
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
})

const emit = defineEmits<{
  'loading-complete': []
}>()

const internalShow = ref(true)
const progress = ref(0)

const loadingSteps = ref<LoadingStep[]>([
  { id: 'dependencies', label: 'Loading dependencies...', completed: false, active: true },
  { id: 'editor', label: 'Initializing editor...', completed: false, active: false },
  { id: 'markdown', label: 'Setting up markdown renderer...', completed: false, active: false },
  { id: 'mermaid', label: 'Loading Mermaid diagrams...', completed: false, active: false },
  { id: 'ready', label: 'Ready to edit!', completed: false, active: false },
])

const loadingText = computed(() => {
  const activeStep = loadingSteps.value.find((step) => step.active)
  return activeStep ? activeStep.label : 'Loading...'
})

const formattedProgress = computed(() => {
  return progress.value.toFixed(2)
})

let progressInterval: ReturnType<typeof setInterval> | null = null
let stepInterval: ReturnType<typeof setTimeout> | null = null

const simulateLoading = () => {
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      const delta = Math.random() * 25
      const next = Math.min(100, Math.round((progress.value + delta) * 100) / 100)
      progress.value = next
    }
  }, 100)

  const stepTimings = [300, 200, 200, 200, 100]

  stepTimings.forEach((timing, index) => {
    stepInterval = setTimeout(
      () => {
        const steps = loadingSteps.value

        if (index > 0 && steps[index - 1]) {
          steps[index - 1]!.completed = true
          steps[index - 1]!.active = false
        }

        if (index < steps.length && steps[index]) {
          steps[index].active = true

          if (index === steps.length - 1) {
            setTimeout(() => {
              if (steps[index]) {
                steps[index].completed = true
                steps[index].active = false
              }
              progress.value = 100

              setTimeout(() => {
                internalShow.value = false

                setTimeout(() => {
                  emit('loading-complete')
                }, 500) // Match transition duration
              }, 200)
            }, timing)
          }
        }
      },
      stepTimings.slice(0, index + 1).reduce((sum, time) => sum + time, 0)
    )
  })
}

onMounted(() => {
  if (props.show) {
    simulateLoading()
  }
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  if (stepInterval) clearTimeout(stepInterval)
})
</script>

<style scoped>
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
