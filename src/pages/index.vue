<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-slate-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="merMDitor Logo" class="h-8 mr-3" />
          </RouterLink>
        </div>
        <nav class="flex items-center space-x-4">
            <RouterLink to="/cheatsheet" class="text-gray-300 hover:text-white">Cheat Sheet</RouterLink>
        </nav>
      </div>
    </header>    
    <!-- Main Content Area -->
    <main class="flex-grow flex flex-col">      <!-- Hero Section -->
      <section class="py-12 md:py-20 flex flex-col items-center justify-center">
        <div class="container mx-auto text-center px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-5xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 flex flex-col md:flex-row items-center justify-center text-brand-blue">
            <img src="@/assets/logo.png" alt="merMDitor Logo" class="h-10 sm:h-12 md:h-14 lg:h-16 mb-4 md:mb-0 md:mr-4" />
            merMDitor
          </h2>
          <p class="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-6">A simple Markdown editor with <a href="https://mermaid.js.org/" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-300 underline">Mermaid</a> diagram support</p>
          <p class="text-lg text-gray-400 mb-12 leading-relaxed">
            Write Markdown, see it rendered instantly, and add diagrams with Mermaid syntax. 
            No signup required, works in your browser, saves automatically to local storage.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/editor" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">
              Try the Editor
            </RouterLink>
            <!-- <RouterLink to="/richtexteditor" class="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg text-white font-medium">
              Rich Text Editor
            </RouterLink> -->
          </div>
        </div>
      </div>
      </section>
        <!-- Features Section -->
      <section class="py-16 bg-slate-800">
        <div class="container mx-auto px-4">
          <h3 class="text-3xl font-bold text-center mb-12 text-brand-blue">What it does</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <!-- [ICON: Markdown] -->
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              <h4 class="text-xl font-medium mb-3">Markdown editing</h4>
              <p class="text-gray-300">Standard Markdown with GitHub flavor support. Includes syntax highlighting, keyboard shortcuts, and formatting buttons.</p>
            </div>
            
            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="1">
                <rect x="9" y="2" width="6" height="4" rx="1"></rect>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v3"></path>
                <rect x="9" y="9" width="6" height="4" rx="1"></rect>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 13v2"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 15h10"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 15v2"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 15v2"></path>
                <rect x="4" y="17" width="6" height="4" rx="1"></rect>
                <rect x="14" y="17" width="6" height="4" rx="1"></rect>
              </svg>
              <h4 class="text-xl font-medium mb-3">Mermaid diagrams</h4>
              <p class="text-gray-300">Create flowcharts, sequence diagrams, and other visuals using Mermaid syntax. Renders in real-time as you type.</p>
            </div>
            
            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <!-- [ICON: Preview] -->
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <h4 class="text-xl font-medium mb-3">Live preview</h4>
              <p class="text-gray-300">Split-pane view with instant preview. See exactly how your markdown will look while you write.</p>
            </div>

            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <!-- [ICON: Auto-Save] -->
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
              <h4 class="text-xl font-medium mb-3">Auto-save</h4>
              <p class="text-gray-300">Your work is automatically saved to browser local storage. No accounts, no data sent anywhere.</p>
            </div>

            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <!-- [ICON: Free] -->
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                <line x1="6" y1="18" x2="18" y2="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
              </svg>
              <h4 class="text-xl font-medium mb-3">Free to use</h4>
              <p class="text-gray-300">No registration, no payments, no limits. Just open it and start writing.</p>
            </div>

            <div class="bg-slate-900 p-6 rounded-lg border border-slate-700">
              <!-- [ICON: Cheatsheet] -->
              <svg class="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <h4 class="text-xl font-medium mb-3">Built-in help</h4>
              <p class="text-gray-300">Quick reference for Markdown and Mermaid syntax available when you need it.</p>
            </div>
          </div>
        </div>
      </section>      <!-- Use Cases Section -->
      <section class="py-16 bg-slate-900">
        <div class="container mx-auto px-4">
          <h3 class="text-3xl font-bold text-center mb-12 text-brand-blue">Good for</h3>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h4 class="text-xl font-medium mb-3">Documentation</h4>
              <p class="text-gray-300">API docs, project READMEs, technical guides. Add flowcharts and architecture diagrams inline with your text.</p>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h4 class="text-xl font-medium mb-3">Note-taking</h4>
              <p class="text-gray-300">Meeting notes, research, study materials. Organize thoughts with headers, lists, and visual diagrams.</p>
            </div>
            
            <div class="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h4 class="text-xl font-medium mb-3">Planning & Design</h4>
              <p class="text-gray-300">System design, process flows, database schemas. Sketch ideas quickly with Mermaid diagrams.</p>
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
