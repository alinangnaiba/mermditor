<template>
  <div
    class="mx-auto max-w-2xl rounded-lg border border-border-primary bg-surface-secondary p-6 shadow-lg"
  >
    <h2 class="mb-6 text-2xl font-bold text-text-primary">Share Your Feedback</h2>

    <form class="space-y-4" @submit.prevent="submitSuggestion">
      <!-- Type Selection -->
      <div>
        <label class="mb-2 block text-sm font-medium text-text-secondary" for="feedback-type">
          Type of Feedback
        </label>
        <select
          id="feedback-type"
          v-model="form.type"
          required
          class="w-full rounded-md border border-border-secondary bg-surface-tertiary px-3 py-2 text-text-primary transition-colors focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
        <label class="mb-2 block text-sm font-medium text-text-secondary" for="feedback-title">
          Title
        </label>
        <input
          id="feedback-title"
          v-model="form.title"
          type="text"
          required
          maxlength="100"
          placeholder="Brief summary of your feedback"
          class="w-full rounded-md border border-border-secondary bg-surface-tertiary px-3 py-2 text-text-primary placeholder-text-tertiary transition-colors focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
      </div>

      <!-- Description -->
      <div>
        <label
          class="mb-2 block text-sm font-medium text-text-secondary"
          for="feedback-description"
        >
          Description
        </label>
        <textarea
          id="feedback-description"
          v-model="form.description"
          required
          rows="6"
          placeholder="Please provide details about your feedback..."
          class="w-full resize-none rounded-md border border-border-secondary bg-surface-tertiary px-3 py-2 text-text-primary placeholder-text-tertiary transition-colors focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
      </div>

      <!-- Email (Optional) -->
      <div>
        <label class="mb-2 block text-sm font-medium text-text-secondary" for="feedback-email">
          Email (Optional)
        </label>
        <input
          id="feedback-email"
          v-model="form.email"
          type="email"
          placeholder="your@email.com (if you'd like a response)"
          class="w-full rounded-md border border-border-secondary bg-surface-tertiary px-3 py-2 text-text-primary placeholder-text-tertiary transition-colors focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
        >
      </div>

      <!-- Submit Button -->
      <div class="flex gap-3">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 rounded-md bg-surface-tertiary px-4 py-2 font-medium text-text-primary transition-colors duration-200 hover:bg-surface-quaternary focus:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary disabled:bg-surface-quaternary disabled:opacity-50"
        >
          <span v-if="!isSubmitting">Submit Feedback</span>
          <span v-else class="flex items-center justify-center">
            <svg
              class="-ml-1 mr-3 h-5 w-5 animate-spin text-text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </span>
        </button>
        <button
          type="button"
          class="rounded-md border border-border-secondary px-4 py-2 text-text-secondary transition-colors duration-200 hover:bg-surface-tertiary focus:bg-surface-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
          @click="resetForm"
        >
          Reset
        </button>
      </div>
    </form>

    <!-- Success Message -->
    <div v-if="submitted" class="mt-6 rounded-md border border-green-700 bg-green-900/20 p-4">
      <div class="flex">
        <svg
          class="mt-0.5 h-5 w-5 text-green-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-200">Feedback Submitted!</h3>
          <p class="mt-1 text-sm text-green-300">Thank you for your feedback!</p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-6 rounded-md border border-red-700 bg-red-900/20 p-4">
      <div class="flex">
        <svg
          class="mt-0.5 h-5 w-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-200">Submission Failed</h3>
          <p class="mt-1 text-sm text-red-300">
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
  email: '',
});

const isSubmitting = ref(false);
const submitted = ref(false);
const error = ref('');
const issueUrl = ref('');

const resetForm = () => {
  form.value = {
    type: '',
    title: '',
    description: '',
    email: '',
  };
  submitted.value = false;
  error.value = '';
  issueUrl.value = '';
};

const submitSuggestion = async () => {
  isSubmitting.value = true;
  error.value = '';
  try {
    const data = (await $fetch('/api/suggestions', {
      method: 'POST',
      body: form.value,
    })) as { success: boolean; issueUrl: string; issueNumber: number };

    submitted.value = true;
    issueUrl.value = data.issueUrl;

    // Reset form after successful submission
    setTimeout(() => {
      resetForm();
    }, 3000);
  } catch (err: unknown) {
    const errorMessage = err && typeof err === 'object' && 'data' in err && 
                        err.data && typeof err.data === 'object' && 'message' in err.data
                        ? String(err.data.message)
                        : 'An unexpected error occurred';
    error.value = errorMessage;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
