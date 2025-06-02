<template>
  <footer class="bg-slate-800 border-t border-slate-700 py-8 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- Brand Section -->
        <div>
          <div class="flex items-center mb-4">
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="h-8 mr-3" />
            <h3 class="text-xl font-semibold text-brand-blue">merMDitor</h3>
          </div>
          <p class="text-gray-400 text-sm">
            A simple, free Markdown editor with Mermaid diagram support. 
            No signup required, works entirely in your browser.
          </p>
        </div>        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-medium text-white mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/editor" class="text-gray-400 hover:text-white transition-colors">
                Markdown Editor
              </NuxtLink>
            </li>            <li>
              <NuxtLink to="/tool-guide" class="text-gray-400 hover:text-white transition-colors">
                Tool Guide
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/feedback" class="text-gray-400 hover:text-white transition-colors">
                Help & Feedback
              </NuxtLink>
            </li>
            <li>
              <a href="https://mermaid.js.org/syntax/flowchart.html" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
                Mermaid Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-slate-700 mt-8 pt-6 text-center">
        <p class="text-gray-500 text-sm">
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
