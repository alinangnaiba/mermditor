<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">        <div class="flex items-center">
          <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-3" />
          <!-- <h1 class="text-xl font-bold">MerMDitor</h1> -->
        </div>
        <nav class="flex items-center gap-4">
          <RouterLink to="/cheatsheet" class="text-gray-300 hover:text-white">
            Cheat Sheet
          </RouterLink>
          <RouterLink to="/editor" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
            Open Editor
          </RouterLink>
        </nav>
      </div>
    </header>    
    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col">
      <!-- Hero Section -->
      <section class="py-12 md:py-20 flex flex-col items-center justify-center">
        <div class="container mx-auto text-center px-4">        <div class="max-w-3xl mx-auto">
          <h2 class="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 flex flex-col md:flex-row items-center justify-center">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-10 sm:h-12 md:h-14 lg:h-16 mb-4 md:mb-0 md:mr-4" />
            merMDitor
          </h2>
          <p class="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-6">Markdown editor with <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">Mermaid</a> syntax support</p>
          <p class="text-xl text-gray-300 mb-12 leading-relaxed">
            A sleek, modern Markdown editor that lets you create beautiful documentation, 
            including diagrams and flowcharts with Mermaid syntax. MerMDitor (mer-med-it-or) is
            perfect for developers, technical writers, and anyone who needs to document complex ideas visually.
          </p>
          <RouterLink to="/editor" class="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-lg">
            Start Writing Now
          </RouterLink>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 bg-gray-800">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl font-semibold text-center mb-12">Key Features</h3>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-900 p-6 rounded-lg">
            <h4 class="text-xl font-medium mb-3">Markdown Support</h4>
            <p class="text-gray-300">Full support for GitHub-flavored Markdown with syntax highlighting for code blocks.</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg">
            <h4 class="text-xl font-medium mb-3">Mermaid Diagrams</h4>
            <p class="text-gray-300">Create flowcharts, sequence diagrams, class diagrams, and more with Mermaid syntax.</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg">
            <h4 class="text-xl font-medium mb-3">Live Preview</h4>
            <p class="text-gray-300">See your markdown and diagrams rendered in real-time as you type.</p>
          </div>        </div>
      </div>    </section>
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue'; // Import the new footer component
</script>

<style>
/* Ensure proper behavior for the page */
html, body {
  height: 100%;
  overflow-y: auto;
}

.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
