<template>
  <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Share Your Feedback
    </h2>
    
    <form @submit.prevent="submitSuggestion" class="space-y-4">
      <!-- Type Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type of Feedback
        </label>
        <select 
          v-model="form.type" 
          required 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">Select type...</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Improvement">Improvement</option>
          <option value="Question">Question</option>
        </select>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title
        </label>
        <input 
          v-model="form.title" 
          type="text" 
          required 
          maxlength="100"
          placeholder="Brief summary of your feedback"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea 
          v-model="form.description" 
          required 
          rows="6"
          placeholder="Please provide details about your feedback..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
        ></textarea>
      </div>

      <!-- Email (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email (Optional)
        </label>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="your@email.com (if you'd like a response)"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex gap-3">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          <span v-if="!isSubmitting">Submit Feedback</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        </button>
        
        <button 
          type="button" 
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="submitted" class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
      <div class="flex">
        <svg class="h-5 w-5 text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
            Feedback Submitted!
          </h3>
          <p class="mt-1 text-sm text-green-600 dark:text-green-300">
            Thank you for your feedback!
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Submission Failed
          </h3>
          <p class="mt-1 text-sm text-red-600 dark:text-red-300">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const form = ref({
  type: '',
  title: '',
  description: '',
  email: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)
const error = ref('')
const issueUrl = ref('')

const resetForm = () => {
  form.value = {
    type: '',
    title: '',
    description: '',
    email: ''
  }
  submitted.value = false
  error.value = ''
  issueUrl.value = ''
}

const submitSuggestion = async () => {
  isSubmitting.value = true
  error.value = ''
  try {
    const data = await $fetch('/api/suggestions', {
      method: 'POST',
      body: form.value
    }) as { success: boolean; issueUrl: string; issueNumber: number }
    
    submitted.value = true
    issueUrl.value = data.issueUrl
    
    // Reset form after successful submission
    setTimeout(() => {
      resetForm()
    }, 3000)
    
  } catch (err: any) {
    error.value = err.data?.message || 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script>
