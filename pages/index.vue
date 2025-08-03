<template>
  <div class="flex min-h-screen flex-col bg-surface-primary text-text-primary">
    <!-- Header -->
    <header class="flex-shrink-0 border-b border-border-primary px-6 py-4">
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="mr-3 h-8" >
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-4">
          <NuxtLink
            to="/tool-guide"
            class="rounded px-2 py-1 text-text-secondary transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
            >Tool Guide</NuxtLink
          >
        </nav>
      </div>
    </header>
    <!-- Main Content Area -->
    <main class="flex flex-grow flex-col" role="main">
      <!-- Hero Section -->
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
                src="~/assets/logo.png"
                alt="merMDitor Logo"
                class="mb-4 h-10 sm:h-12 md:mb-0 md:mr-4 md:h-14 lg:h-16"
              >
              merMDitor
            </h1>
            <p class="mb-6 text-xl text-text-secondary sm:text-2xl md:text-3xl">
              A simple Markdown editor with
              <a
                href="https://mermaid.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded text-text-tertiary underline transition-colors hover:text-text-secondary focus:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
                >Mermaid</a
              >
              diagrams and
              <a
                href="https://www.latex-project.org/"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded text-text-tertiary underline transition-colors hover:text-text-secondary focus:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
                >LaTeX</a
              >
              math support
            </p>
            <p class="mb-12 text-lg leading-relaxed text-text-tertiary">
              Write Markdown, see it rendered instantly, add diagrams with Mermaid syntax, and render mathematical expressions with LaTeX. No
              signup required, works in your browser, saves automatically to local storage.
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
        <div class="container mx-auto px-4">
          <h2
            id="features-heading"
            class="mb-12 text-center text-3xl font-bold text-accent-primary"
          >
            What it does
          </h2>

          <!-- Features Carousel -->
          <div class="relative">
            <!-- Navigation Buttons (only show when needed) -->
            <button
              v-if="showNavigation"
              class="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface-primary p-3 shadow-lg transition-all hover:bg-surface-tertiary focus:bg-surface-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              aria-label="Previous features"
              @click="previousSlide"
            >
              <svg
                class="h-6 w-6 text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <button
              v-if="showNavigation"
              class="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-surface-primary p-3 shadow-lg transition-all hover:bg-surface-tertiary focus:bg-surface-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              aria-label="Next features"
              @click="nextSlide"
            >
              <svg
                class="h-6 w-6 text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            <!-- Carousel Container -->
            <div class="overflow-hidden" :class="showNavigation ? 'px-8' : 'px-4'">
              <div
                v-if="!showNavigation"
                class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <!-- Static grid for mobile/when all cards fit -->
                <div
                  v-for="(feature, index) in features"
                  :key="index"
                  class="h-full"
                >
                  <div class="rounded-lg border border-border-primary bg-surface-primary p-6 h-full flex flex-col">
                    <div class="flex-shrink-0" v-html="feature.icon"/>
                    <h3 class="mb-3 text-xl font-medium text-text-primary flex-shrink-0">{{ feature.title }}</h3>
                    <p class="text-text-secondary flex-grow">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
              
              <div
                v-else
                class="flex transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(${translateX}%)` }"
              >
                <!-- Carousel mode for larger screens -->
                <div
                  v-for="(feature, index) in features"
                  :key="index"
                  class="flex-shrink-0 px-2"
                  :class="{
                    'w-full': cardsPerView === 1,
                    'w-1/2': cardsPerView === 2,
                    'w-1/3': cardsPerView === 3,
                    'w-1/4': cardsPerView === 4
                  }"
                >
                  <div class="rounded-lg border border-border-primary bg-surface-primary p-6 h-full flex flex-col">
                    <div class="flex-shrink-0" v-html="feature.icon"/>
                    <h3 class="mb-3 text-xl font-medium text-text-primary flex-shrink-0">{{ feature.title }}</h3>
                    <p class="text-text-secondary flex-grow">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination Dots (only show when navigation is needed) -->
            <div v-if="showNavigation && totalDots > 1" class="mt-8 flex justify-center space-x-2">
              <button
                v-for="index in totalDots"
                :key="index-1"
                :class="[
                  'h-3 w-3 rounded-full transition-all',
                  currentSlide === index-1 ? 'bg-accent-primary' : 'bg-surface-quaternary hover:bg-surface-tertiary'
                ]"
                :aria-label="`Go to slide ${index}`"
                @click="goToSlide(index-1)"
              />
            </div>
          </div>
        </div>
      </section>
      <!-- Use Cases Section -->
      <section class="bg-surface-primary py-16" aria-labelledby="use-cases-heading">
        <div class="container mx-auto px-4">
          <h2
            id="use-cases-heading"
            class="mb-12 text-center text-3xl font-bold text-accent-primary"
          >
            Good for
          </h2>

          <div class="grid gap-8 md:grid-cols-3">
            <div class="rounded-lg border border-border-primary bg-surface-secondary p-6">
              <h3 class="mb-3 text-xl font-medium text-text-primary">Documentation</h3>
              <p class="text-text-secondary">
                API docs, project READMEs, technical guides. Add flowcharts, architecture
                diagrams, and mathematical formulas inline with your text.
              </p>
            </div>

            <div class="rounded-lg border border-border-primary bg-surface-secondary p-6">
              <h3 class="mb-3 text-xl font-medium text-text-primary">Note-taking</h3>
              <p class="text-text-secondary">
                Meeting notes, research, study materials. Organize thoughts with headers, lists,
                visual diagrams, and mathematical equations.
              </p>
            </div>

            <div class="rounded-lg border border-border-primary bg-surface-secondary p-6">
              <h3 class="mb-3 text-xl font-medium text-text-primary">Academic & Research</h3>
              <p class="text-text-secondary">
                Research papers, technical analysis, scientific documentation. Combine text, diagrams,
                and complex mathematical expressions in one place.
              </p>
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

const currentSlide = ref(0);
const totalFeatures = 7;
const isClient = ref(false);
const windowWidth = ref(0);

const cardsPerView = computed(() => {
  if (!isClient.value) return 1; // Always 1 during SSR to prevent hydration mismatch
  
  const width = windowWidth.value;
  if (width >= 1280) return 4; // xl: 4 cards
  if (width >= 1024) return 3;  // lg: 3 cards  
  if (width >= 640) return 2;   // sm: 2 cards
  return 1; // mobile: 1 card
});

const showNavigation = computed(() => {
  return isClient.value && cardsPerView.value < totalFeatures;
});

const maxSlide = computed(() => {
  if (!showNavigation.value) return 0;
  return totalFeatures - cardsPerView.value;
});

const nextSlide = () => {
  if (currentSlide.value >= maxSlide.value) {
    currentSlide.value = 0;
  } else {
    currentSlide.value++;
  }
};

const previousSlide = () => {
  if (currentSlide.value <= 0) {
    currentSlide.value = maxSlide.value;
  } else {
    currentSlide.value--;
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = Math.min(index, maxSlide.value);
};

const translateX = computed(() => {
  if (!showNavigation.value) return 0;
  const slideWidth = 100 / cardsPerView.value;
  return -(currentSlide.value * slideWidth);
});

const totalDots = computed(() => {
  if (!showNavigation.value) return 0;
  return maxSlide.value + 1;
});

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

let resizeTimeout: NodeJS.Timeout | null = null;
const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  
  resizeTimeout = setTimeout(() => {
    updateWindowWidth();
    
    nextTick(() => {
      if (currentSlide.value > maxSlide.value) {
        currentSlide.value = Math.max(0, maxSlide.value);
      }
    });
  }, 100);
};

onMounted(() => {
  isClient.value = true;
  updateWindowWidth();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (isClient.value) {
    window.removeEventListener('resize', handleResize);
  }

  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
});

// Feature data
const features = [
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>`,
    title: 'Markdown editing',
    description: 'Standard Markdown with GitHub flavor support. Includes syntax highlighting, keyboard shortcuts, and formatting buttons.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-width="1" aria-hidden="true">
      <rect x="9" y="2" width="6" height="4" rx="1"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v3"/>
      <rect x="9" y="9" width="6" height="4" rx="1"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 13v2"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M7 15h10"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M7 15v2"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M17 15v2"/>
      <rect x="4" y="17" width="6" height="4" rx="1"/>
      <rect x="14" y="17" width="6" height="4" rx="1"/>
    </svg>`,
    title: 'Mermaid diagrams',
    description: 'Create flowcharts, sequence diagrams, and other visuals using Mermaid syntax. Renders in real-time as you type.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
    </svg>`,
    title: 'LaTeX math',
    description: 'Render mathematical expressions and equations using LaTeX syntax. Supports both inline and block math.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>`,
    title: 'Live preview',
    description: 'Split-pane view with instant preview. See exactly how your markdown will look while you write.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
    </svg>`,
    title: 'Auto-save',
    description: 'Your work is automatically saved to browser local storage. No accounts, no data sent anywhere.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      <line x1="6" y1="18" x2="18" y2="6" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/>
    </svg>`,
    title: 'Free to use',
    description: 'No registration, no payments, no limits. Just open it and start writing.'
  },
  {
    icon: `<svg class="mb-4 h-12 w-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`,
    title: 'Built-in help',
    description: 'Quick reference for Markdown, Mermaid, and LaTeX syntax available when you need it.'
  }
];

// Page-specific SEO meta tags
useSeoMeta({
  title: 'merMDitor - Free Markdown Editor with Mermaid Diagrams & LaTeX Math | No Signup Required',
  description:
    'Free online Markdown editor with live preview, Mermaid diagram support, and LaTeX math rendering. Create flowcharts, sequence diagrams, mathematical equations, and more. Works entirely in your browser with auto-save. No registration required.',
  ogTitle: 'merMDitor - Free Markdown Editor with Mermaid Diagrams & LaTeX Math',
  ogDescription:
    'Free online Markdown editor with live preview, Mermaid diagram support, and LaTeX math rendering. Create flowcharts, sequence diagrams, mathematical equations, and more. Works entirely in your browser with auto-save.',
  ogImage: '/og-image.png',
  ogUrl: 'https://www.mermditor.dev',
  twitterCard: 'summary_large_image',
  twitterTitle: 'merMDitor - Free Markdown Editor with Mermaid Diagrams & LaTeX Math',
  twitterDescription:
    'Free online Markdown editor with live preview, Mermaid diagram support, and LaTeX math rendering. No signup required.',
  twitterImage: '/og-image.png',
});

useHead({
  link: [{ rel: 'canonical', href: 'https://www.mermditor.dev' }],
});

// Structured data for better SEO
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'merMDitor',
        description: 'Free online Markdown editor with live preview, Mermaid diagram support, and LaTeX math rendering',
        url: 'https://www.mermditor.dev',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Organization',
          name: 'merMDitor',
        },
        features: [
          'Markdown editing with live preview',
          'Mermaid diagram support',
          'LaTeX math rendering',
          'Auto-save functionality',
          'No registration required',
          'Browser-based editor',
        ],
      }),
    },
  ],
});
</script>

