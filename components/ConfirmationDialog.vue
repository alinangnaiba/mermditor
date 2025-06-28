<template>
  <Teleport to="body">
    <div 
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="handleCancel"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
      
      <!-- Modal -->
      <div 
        class="relative w-full max-w-md rounded-lg bg-surface-primary shadow-xl border border-border-primary"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 pb-4">
          <div class="flex items-center space-x-3">
            <div 
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="type === 'destructive' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'"
            >
              <svg 
                class="h-6 w-6" 
                :class="type === 'destructive' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
              >
                <path 
                  v-if="type === 'destructive'"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" 
                />
                <path 
                  v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-text-primary">{{ title }}</h3>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 pb-4">
          <p class="text-sm text-text-secondary leading-relaxed">
            {{ message }}
          </p>
        </div>
        
        <!-- Actions - Centered buttons -->
        <div class="flex justify-center space-x-3 px-6 py-4 bg-surface-secondary/50 rounded-b-lg">
          <button
            type="button"
            :class="type === 'destructive' 
              ? 'rounded-md border border-border-primary bg-surface-tertiary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 transition-colors'
              : 'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors'
            "
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            :class="type === 'destructive'
              ? 'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors'
              : 'rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors'
            "
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'destructive' | 'informational';
}

interface Emits {
  (e: 'confirm' | 'cancel'): void;
}

withDefaults(defineProps<Props>(), {
  confirmText: 'OK',
  cancelText: 'Cancel',
  type: 'destructive'
});

const emit = defineEmits<Emits>();

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>
