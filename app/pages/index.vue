<template>
  <div>
    <!-- Header -->
    <header class="border-b border-gray-700 bg-gray-800">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo/Icon -->
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >
              <img src="../assets/images/logo.png" alt="merMDitor Logo" class="mr-3 h-8" />
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <nav>
            <NuxtLink
              to="/guide"
              class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Tool Guide
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Jumbotron -->
    <section
      class="flex flex-col items-center justify-center py-12 md:py-20"
      aria-labelledby="hero-heading"
    >
      <div class="container mx-auto px-4 text-center">
        <div class="mx-auto max-w-3xl">
          <h1
            id="hero-heading"
            class="mb-6 flex flex-col items-center justify-center text-5xl font-bold text-accent-primary sm:text-4xl md:flex-row md:text-5xl lg:text-6xl"
          >
            <img
              src="../assets/images/logo.png"
              alt="merMDitor Logo"
              class="mb-4 h-10 sm:h-12 md:mb-0 md:mr-4 md:h-14 lg:h-16"
            />
            merMDitor
          </h1>
          <p class="mb-6 text-xl text-text-secondary sm:text-2xl md:text-3xl">
            A simple Markdown editor with
            <a
              href="https://mermaid.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded text-text-tertiary underline transition-colors hover:text-text-secondary focus:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >
              Mermaid
            </a>
            diagrams and
            <a
              href="https://www.latex-project.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded text-text-tertiary underline transition-colors hover:text-text-secondary focus:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >
              LaTeX
            </a>
            math support
          </p>
          <p class="mb-12 text-lg leading-relaxed text-text-tertiary">
            Write Markdown, see it rendered instantly, add diagrams with Mermaid syntax, and render
            mathematical expressions with LaTeX. No signup required, works in your browser, saves
            automatically to local storage.
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <NuxtLink
              to="/editor"
              class="rounded-lg bg-surface-tertiary px-6 py-3 font-medium text-text-primary transition-colors hover:bg-surface-quaternary focus:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >
              Open Editor
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-surface-secondary py-16" aria-labelledby="features-heading">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="mb-12 text-center text-3xl font-bold">What it does</h2>

        <!-- Feature Carousel -->
        <div class="relative" @mouseenter="stopAutoAdvance" @mouseleave="startAutoAdvance">
          <!-- Carousel Container -->
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <!-- Slides -->
              <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0 px-2">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  <div
                    v-for="feature in slide"
                    :key="feature.title"
                    class="h-full rounded-lg border border-gray-700 bg-gray-800 p-6"
                  >
                    <div
                      class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                      :class="feature.iconBg"
                    >
                      <component :is="feature.icon" :size="24" class="text-white" />
                    </div>
                    <h3 class="mb-3 text-xl font-semibold">{{ feature.title }}</h3>
                    <p class="text-gray-400">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Navigation -->
          <div class="mt-8 flex justify-center space-x-4">
            <!-- Previous Button -->
            <button
              class="rounded-full bg-gray-700 p-2 transition-colors hover:bg-gray-600"
              :disabled="currentSlide === 0"
              :class="{ 'cursor-not-allowed opacity-50': currentSlide === 0 }"
              @click="previousSlide"
            >
              <PhCaretLeft :size="20" class="text-white" />
            </button>

            <!-- Dots Indicator -->
            <div class="flex items-center space-x-2">
              <button
                v-for="(slide, index) in slides"
                :key="index"
                class="h-3 w-3 rounded-full transition-colors"
                :class="currentSlide === index ? 'bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'"
                @click="goToSlide(index)"
              />
            </div>

            <!-- Next Button -->
            <button
              class="rounded-full bg-gray-700 p-2 transition-colors hover:bg-gray-600"
              :disabled="currentSlide === slides.length - 1"
              :class="{ 'cursor-not-allowed opacity-50': currentSlide === slides.length - 1 }"
              @click="nextSlide"
            >
              <PhCaretRight :size="20" class="text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Use cases Section -->
    <section class="bg-surface-primary py-16" aria-labelledby="use-cases-heading">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="mb-12 text-center text-3xl font-bold">Good for</h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <!-- Documentation -->
          <div class="rounded-lg border border-gray-700 bg-gray-900 p-8">
            <div
              class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500"
            >
              <PhBookOpen :size="32" class="text-white" />
            </div>
            <h3 class="mb-4 text-center text-2xl font-semibold">Documentation</h3>
            <p class="text-center text-gray-400">
              API docs, project READMEs, technical guides. Add flowcharts, architecture diagrams,
              and mathematical formulas inline with your text.
            </p>
          </div>

          <!-- Note-taking -->
          <div class="rounded-lg border border-gray-700 bg-gray-900 p-8">
            <div
              class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-green-500"
            >
              <PhNotebook :size="32" class="text-white" />
            </div>
            <h3 class="mb-4 text-center text-2xl font-semibold">Note-taking</h3>
            <p class="text-center text-gray-400">
              Meeting notes, research, study materials. Organize thoughts with headers, lists,
              visual diagrams, and mathematical equations.
            </p>
          </div>

          <!-- Academic & Research -->
          <div class="rounded-lg border border-gray-700 bg-gray-900 p-8">
            <div
              class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-500"
            >
              <PhGraduationCap :size="32" class="text-white" />
            </div>
            <h3 class="mb-4 text-center text-2xl font-semibold">Academic & Research</h3>
            <p class="text-center text-gray-400">
              Research papers, technical analysis, scientific documentation. Combine text, diagrams,
              and complex mathematical expressions in one place.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import {
    PhFileText,
    PhNotePencil,
    PhTreeStructure,
    PhFunction,
    PhBookOpen,
    PhNotebook,
    PhGraduationCap,
    PhEye,
    PhDownloadSimple,
    PhCurrencyDollar,
    PhCaretLeft,
    PhCaretRight,
    PhExport,
  } from '@phosphor-icons/vue'
  import type { Component } from 'vue'

  interface Feature {
    title: string
    description: string
    icon: Component
    iconBg: string
  }

  const currentSlide = ref<number>(0)

  const features: Feature[] = [
    {
      title: 'Markdown Support',
      description:
        'Full Markdown support with live preview, syntax highlighting, and formatting shortcuts.',
      icon: PhNotePencil,
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Mermaid Diagrams',
      description: 'Create beautiful flowcharts, sequence diagrams, and more with Mermaid syntax.',
      icon: PhTreeStructure,
      iconBg: 'bg-green-500',
    },
    {
      title: 'LaTeX Math',
      description: 'Write complex mathematical expressions and formulas using LaTeX syntax.',
      icon: PhFunction,
      iconBg: 'bg-purple-500',
    },
    {
      title: 'Live Preview',
      description:
        'Split-pane view with instant preview. See exactly how your markdown will look while you write.',
      icon: PhEye,
      iconBg: 'bg-indigo-500',
    },
    {
      title: 'Auto-save',
      description:
        'Your work is automatically saved to browser local storage. No accounts, no data sent anywhere.',
      icon: PhDownloadSimple,
      iconBg: 'bg-orange-500',
    },
    {
      title: 'Free to use',
      description: 'No registration, no payments, no limits. Just open it and start writing.',
      icon: PhCurrencyDollar,
      iconBg: 'bg-red-500',
    },
    {
      title: 'Built-in help',
      description:
        'Quick reference for Markdown, Mermaid, and LaTeX syntax available when you need it.',
      icon: PhFileText,
      iconBg: 'bg-cyan-500',
    },
    {
      title: 'Import & Export',
      description:
        'Import existing .md files from your device or export your work as Markdown files.',
      icon: PhExport,
      iconBg: 'bg-teal-500',
    },
  ]

  // Organize features into slides (4 per slide)
  const slides = computed<Feature[][]>(() => {
    const slidesArray: Feature[][] = []
    for (let i = 0; i < features.length; i += 4) {
      slidesArray.push(features.slice(i, i + 4))
    }
    return slidesArray
  })

  const nextSlide = (): void => {
    if (currentSlide.value < slides.value.length - 1) {
      currentSlide.value++
    }
  }

  const previousSlide = (): void => {
    if (currentSlide.value > 0) {
      currentSlide.value--
    }
  }

  const goToSlide = (index: number): void => {
    currentSlide.value = index
  }

  let autoAdvanceInterval: ReturnType<typeof setInterval> | null = null

  const startAutoAdvance = (): void => {
    autoAdvanceInterval = setInterval(() => {
      if (currentSlide.value < slides.value.length - 1) {
        nextSlide()
      } else {
        currentSlide.value = 0
      }
    }, 6000) // Change slide every 6 seconds
  }

  const stopAutoAdvance = (): void => {
    if (autoAdvanceInterval) {
      clearInterval(autoAdvanceInterval)
      autoAdvanceInterval = null
    }
  }

  onMounted(() => {
    startAutoAdvance()
  })

  onUnmounted(() => {
    stopAutoAdvance()
  })
</script>
