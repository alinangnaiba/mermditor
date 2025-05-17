<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">        <div class="flex items-center">
          <img src="@/assets/logo.png" alt="merMDitor Logo" class="h-8 mr-3" />
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
            <img src="@/assets/logo.png" alt="merMDitor Logo" class="h-10 sm:h-12 md:h-14 lg:h-16 mb-4 md:mb-0 md:mr-4" />
            merMDitor
          </h2>
          <p class="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-6">Markdown editor with <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">Mermaid</a> syntax support</p>
          <p class="text-xl text-gray-300 mb-12 leading-relaxed">
            A sleek, modern Markdown editor that lets you create beautiful documentation, 
            including diagrams and flowcharts with Mermaid syntax. merMDitor (mer-med-it-or) is
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
        <h3 class="text-3xl font-bold text-center mb-12 text-blue-400">Key Features</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Markdown] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            <h4 class="text-xl font-medium mb-3">Streamlined Markdown Editing</h4>
            <p class="text-gray-300">Effortlessly create rich text documents with full GitHub-flavored Markdown. Our clean interface, essential tools, and handy keyboard shortcuts let you focus on your content and work efficiently.</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Mermaid] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            <h4 class="text-xl font-medium mb-3">Intuitive Mermaid Diagrams</h4>
            <p class="text-gray-300">Seamlessly integrate complex diagrams. Create flowcharts, sequence diagrams, and more using intuitive Mermaid syntax. merMDitor provides a streamlined experience for visualizing ideas.</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Preview] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            <h4 class="text-xl font-medium mb-3">Real-Time Live Preview</h4>
            <p class="text-gray-300">Experience instant visual feedback. See your Markdown and Mermaid diagrams rendered in real-time as you type, ensuring your final document looks exactly as intended.</p>
          </div>

          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Auto-Save] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            <h4 class="text-xl font-medium mb-3">Auto-Save Functionality</h4>
            <p class="text-gray-300">Never lose your work. merMDitor automatically saves your changes to your browser's local storage, so you can pick up right where you left off, even after closing the page.</p>
          </div>

          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Free] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h4 class="text-xl font-medium mb-3">Completely Free</h4>
            <p class="text-gray-300">Enjoy all features without any cost. merMDitor is a free tool built to support your documentation and diagramming needs, accessible to everyone.</p>
          </div>

          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Layout] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9h16M4 15h16M9 4v16M15 4v16"></path></svg>
            <h4 class="text-xl font-medium mb-3">Intuitive Layout</h4>
            <p class="text-gray-300">A clean, minimalist design helps you stay focused. The smart layout provides essential tools without clutter, making your writing experience smooth and efficient.</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-gray-700 flex flex-col items-center text-center">
            <!-- [ICON: Cheatsheet] -->
            <svg class="w-12 h-12 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <h4 class="text-xl font-medium mb-3">Handy Cheatsheet Access</h4>
            <p class="text-gray-300">Quickly look up Markdown and Mermaid syntax with the readily available cheatsheet, helping you format your content without friction.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ideal Use Cases Section -->
    <section class="py-16 bg-gray-900">
      <div class="container mx-auto px-4">
        <h3 class="text-3xl font-bold text-center mb-12 text-blue-400">Ideal Use Cases</h3>
        <p class="text-lg text-gray-400 text-center mb-10 max-w-2xl mx-auto">merMDitor is a versatile tool designed to simplify documentation and visualization for several key user groups.</p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 class="text-xl font-medium mb-3">Students</h4>
            <p class="text-gray-300">Take clearer, more organized notes, create diagrams for assignments (e.g., process flows, data structures), and quickly draft reports or presentations with embedded visuals.</p>
          </div>
          
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 class="text-xl font-medium mb-3">Developers</h4>
            <p class="text-gray-300">Document code, APIs, and system architecture with ease. Create flowcharts and sequence diagrams to explain complex logic, or quickly sketch out database schemas and component interactions.</p>
          </div>
          
          <div class="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 class="text-xl font-medium mb-3">Technical Writers</h4>
            <p class="text-gray-300">Produce comprehensive user manuals and guides with integrated diagrams. Explain intricate processes and systems visually, and maintain documentation efficiently with a straightforward editor.</p>
          </div>
        </div>
      </div>
    </section>
    </main>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style>
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
