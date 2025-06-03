<template>
  <footer class="mt-auto border-t border-border-primary bg-surface-secondary py-8">
    <div class="container mx-auto px-4">
      <div class="grid gap-8 md:grid-cols-2">
        <!-- Brand Section -->
        <div>
          <div class="mb-4 flex items-center">
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="mr-3 h-8" >
            <h3 class="text-xl font-semibold text-accent-primary">merMDitor</h3>
          </div>
          <p class="text-sm text-text-tertiary">
            A simple, free Markdown editor with Mermaid diagram support. No signup required, works
            entirely in your browser.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="mb-4 text-lg font-medium text-text-primary">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/editor"
                class="rounded px-1 py-0.5 text-text-tertiary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Markdown Editor
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/tool-guide"
                class="rounded px-1 py-0.5 text-text-tertiary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Tool Guide
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/feedback"
                class="rounded px-1 py-0.5 text-text-tertiary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Help & Feedback
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://mermaid.js.org/syntax/flowchart.html"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded px-1 py-0.5 text-text-tertiary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary"
              >
                Mermaid Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-8 border-t border-border-primary pt-6 text-center">
        <p class="text-sm text-text-quaternary">
          © {{ new Date().getFullYear() }} merMDitor - Free Markdown Editor with Mermaid support
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
// No script needed for this simple component
</script>

<style scoped>
footer {
  position: relative;
  width: 100%;
}
</style>
