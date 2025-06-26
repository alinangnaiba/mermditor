<template>
  <div class="flex min-h-screen flex-col bg-surface-primary text-text-primary">
    <!-- Header -->
    <header
      class="sticky top-0 z-30 flex-shrink-0 border-b border-border-primary bg-surface-primary px-6 py-4"
    >
      <div class="container mx-auto flex items-center justify-between">
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center rounded transition-opacity hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="mr-3 h-8" >
            <h1 class="text-xl font-semibold text-accent-primary">merMDitor</h1>
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-4">
          <NuxtLink
            to="/"
            class="rounded px-2 py-1 text-text-secondary hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/editor"
            class="rounded px-2 py-1 text-text-secondary hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary"
          >
            Editor
          </NuxtLink>
        </nav>
      </div>
    </header>
    <!-- Main Content Area -->
    <div class="relative flex flex-1">
      <!-- Mobile Sidebar Toggle Button -->
      <button
        v-if="activeTab === 'markdown' || activeTab === 'mermaid' || activeTab === 'latex'"
        class="fixed bottom-6 left-6 z-40 flex items-center justify-center rounded-full bg-surface-tertiary p-3 text-text-primary shadow-lg transition-colors hover:bg-surface-quaternary focus:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary lg:hidden"
        aria-label="Toggle navigation menu"
        @click="sidebarOpen = !sidebarOpen"
      >
        <span class="sr-only">Toggle navigation menu</span>
        <svg
          v-if="!sidebarOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Overlay for mobile sidebar background -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden"
        aria-hidden="true"
        @click="sidebarOpen = false"
      />
      <!-- Sidebar Navigation -->
      <div
        :class="[
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'fixed left-0 top-16 z-30 h-[calc(100vh-64px)] lg:sticky lg:max-h-[calc(100vh-64px)]',
        ]"
      >
        <aside
          v-if="activeTab === 'markdown' || activeTab === 'mermaid' || activeTab === 'latex'"
          class="h-full w-64 flex-shrink-0 overflow-y-auto border-r border-border-primary bg-surface-secondary"
        >
          <nav class="space-y-4 p-6">
            <div v-if="activeTab === 'markdown'">
              <h4 class="mb-3 text-lg font-semibold text-text-secondary">Markdown Sections</h4>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#headings"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'headings'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('headings')"
                    >Headings</a
                  >
                </li>
                <li>
                  <a
                    href="#text-formatting"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'text-formatting'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('text-formatting')"
                    >Text Formatting</a
                  >
                </li>
                <li>
                  <a
                    href="#lists"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'lists'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('lists')"
                    >Lists</a
                  >
                </li>
                <li>
                  <a
                    href="#links-images"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'links-images'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('links-images')"
                    >Links & Images</a
                  >
                </li>
                <li>
                  <a
                    href="#blockquotes"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'blockquotes'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('blockquotes')"
                    >Blockquotes</a
                  >
                </li>
                <li>
                  <a
                    href="#code-blocks"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'code-blocks'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('code-blocks')"
                    >Code Blocks</a
                  >
                </li>
                <li>
                  <a
                    href="#tables"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'tables'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('tables')"
                    >Tables</a
                  >
                </li>
                <li>
                  <a
                    href="#horizontal-rule"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      activeSectionId === 'horizontal-rule'
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('horizontal-rule')"
                    >Horizontal Rule</a
                  >
                </li>
              </ul>
            </div>
            <div v-if="activeTab === 'mermaid'">
              <h4 class="mb-3 text-lg font-semibold text-text-secondary">Mermaid Sections</h4>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#basic-flowchart"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('basic-flowchart')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('basic-flowchart')"
                    >Basic Flowchart</a
                  >
                </li>
                <li>
                  <a
                    href="#node-shapes"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('node-shapes') || isNodeShapeSubMenuActive()
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="
                      toggleNodeShapesSubMenu(),
                      scrollToSection('node-shapes')
                    "
                  >
                    Node Shapes
                    <svg
                      class="ml-1 inline-block h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-90': nodeShapesSubMenuOpen }"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <ul v-if="nodeShapesSubMenuOpen" class="mt-1 space-y-1 pl-4">
                    <li v-for="shape in nodeShapeSections" :key="shape.id">
                      <a
                        :href="'#' + shape.id"
                        :class="[
                          'block rounded px-2 py-1 text-sm transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                          isActiveSection(shape.id)
                            ? 'font-semibold text-text-primary'
                            : 'text-text-tertiary',
                        ]"
                        @click.prevent="scrollToSection(shape.id)"
                      >
                        {{ shape.name }}
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="#sequence-diagram"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('sequence-diagram')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('sequence-diagram')"
                    >Sequence Diagram</a
                  >
                </li>
                <li>
                  <a
                    href="#class-diagram"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('class-diagram')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('class-diagram')"
                    >Class Diagram</a
                  >
                </li>
                <li>
                  <a
                    href="#state-diagram"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('state-diagram')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('state-diagram')"
                    >State Diagram</a
                  >
                </li>
                <li>
                  <a
                    href="#gantt-chart"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('gantt-chart')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('gantt-chart')"
                    >Gantt Chart</a
                  >
                </li>
                <li>
                  <a
                    href="#entity-relationship"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('entity-relationship')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('entity-relationship')"
                    >Entity Relationship</a
                  >
                </li>
              </ul>
            </div>
            <div v-if="activeTab === 'latex'">
              <h4 class="mb-3 text-lg font-semibold text-text-secondary">LaTeX Sections</h4>
              <ul class="space-y-2">
                <li>
                  <a
                    href="#basic-syntax"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('basic-syntax')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('basic-syntax')"
                    >Basic Syntax</a
                  >
                </li>
                <li>
                  <a
                    href="#common-expressions"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('common-expressions')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('common-expressions')"
                    >Common Expressions</a
                  >
                </li>
                <li>
                  <a
                    href="#advanced-expressions"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('advanced-expressions')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('advanced-expressions')"
                    >Advanced Expressions</a
                  >
                </li>
                <li>
                  <a
                    href="#functions-operators"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('functions-operators')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('functions-operators')"
                    >Functions & Operators</a
                  >
                </li>
                <li>
                  <a
                    href="#complex-examples"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('complex-examples')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('complex-examples')"
                    >Complex Examples</a
                  >
                </li>
                <li>
                  <a
                    href="#tips"
                    :class="[
                      'block rounded px-2 py-1 transition-colors hover:text-text-primary focus:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-secondary',
                      isActiveSection('tips')
                        ? 'font-semibold text-text-primary'
                        : 'text-text-tertiary',
                    ]"
                    @click.prevent="scrollToSection('tips')"
                    >Tips & Best Practices</a
                  >
                </li>
              </ul>
            </div>
          </nav>
        </aside>
      </div>

      <!-- Documentation Content - Scrollable area -->
      <div ref="contentArea" class="flex-1 overflow-y-auto" @scroll="handleScroll">
        <div class="container mx-auto px-4 py-8 pb-20">
          <!-- Tab Navigation -->
          <div
            class="sticky top-16 z-20 mb-8 border-b border-border-primary bg-surface-primary py-3"
          >
            <nav class="flex justify-center space-x-4" aria-label="Tabs">
              <button
                :class="[
                  'rounded-md px-4 py-2 font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary',
                  activeTab === 'markdown'
                    ? 'border-b-2 border-border-accent text-text-primary'
                    : 'text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary',
                ]"
                @click="activeTab = 'markdown'"
              >
                Markdown
              </button>
              <button
                :class="[
                  'rounded-md px-4 py-2 font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary',
                  activeTab === 'mermaid'
                    ? 'border-b-2 border-border-accent text-text-primary'
                    : 'text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary',
                ]"
                @click="activeTab = 'mermaid'"
              >
                Mermaid
              </button>
              <button
                :class="[
                  'rounded-md px-4 py-2 font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary',
                  activeTab === 'latex'
                    ? 'border-b-2 border-border-accent text-text-primary'
                    : 'text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary',
                ]"
                @click="activeTab = 'latex'"
              >
                LaTeX
              </button>
              <button
                :class="[
                  'rounded-md px-4 py-2 font-medium transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-surface-primary',
                  activeTab === 'shortcuts'
                    ? 'border-b-2 border-border-accent text-text-primary'
                    : 'text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary',
                ]"
                @click="activeTab = 'shortcuts'"
              >
                Shortcuts
              </button>
            </nav>
          </div>
          <!-- Tab Content -->
          <div>
            <ToolGuideMarkdownContent v-if="activeTab === 'markdown'" />
            <ToolGuideMermaidContent v-if="activeTab === 'mermaid'" />
            <ToolGuideLatexContent v-if="activeTab === 'latex'" />
            <ToolGuideShortcutsContent v-if="activeTab === 'shortcuts'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

const activeTab = ref('markdown');
const contentArea = ref<HTMLElement | null>(null);
const activeSectionId = ref<string | null>(null);
const sectionIds = ref<string[]>([]);
const nodeShapesSubMenuOpen = ref(false);
const sidebarOpen = ref(false);

const markdownSections = [
  'headings',
  'text-formatting',
  'lists',
  'links-images',
  'blockquotes',
  'code-blocks',
  'tables',
  'horizontal-rule',
];
const mermaidMainSections = [
  'basic-flowchart',
  'node-shapes',
  'sequence-diagram',
  'class-diagram',
  'state-diagram',
  'gantt-chart',
  'entity-relationship',
];
const latexSections = [
  'basic-syntax',
  'common-expressions',
  'advanced-expressions',
  'functions-operators',
  'complex-examples',
  'tips',
];
const nodeShapeSections = [
  { id: 'node-shape-square', name: 'Square Node' },
  { id: 'node-shape-rounded', name: 'Rounded Node' },
  { id: 'node-shape-stadium', name: 'Stadium Node' },
  { id: 'node-shape-subroutine', name: 'Subroutine Node' },
  { id: 'node-shape-database', name: 'Database Node' },
  { id: 'node-shape-circle', name: 'Circle Node' },
  { id: 'node-shape-asymmetric', name: 'Asymmetric Node' },
  { id: 'node-shape-rhombus', name: 'Rhombus Node' },
  { id: 'node-shape-parallelogram', name: 'Parallelogram' },
  { id: 'node-shape-alt-parallelogram', name: 'Alt. Parallelogram' },
  { id: 'node-shape-trapezoid', name: 'Trapezoid' },
  { id: 'node-shape-alt-trapezoid', name: 'Alt. Trapezoid' },
];

const isActiveSection = (sectionId: string) => {
  return activeSectionId.value === sectionId;
};

const isNodeShapeSubMenuActive = () => {
  return nodeShapeSections.some((shape) => isActiveSection(shape.id));
};

const toggleNodeShapesSubMenu = () => {
  nodeShapesSubMenuOpen.value = !nodeShapesSubMenuOpen.value;
};

watch(
  activeTab,
  async (_newTab) => {
    activeSectionId.value = null;
    nodeShapesSubMenuOpen.value = false;
    await nextTick();
    updateSectionIds();
    if (contentArea.value && sectionIds.value.length > 0) {
      contentArea.value.scrollTop = 0;
    }
  },
  { immediate: true }
);

const updateSectionIds = () => {
  if (activeTab.value === 'markdown') {
    sectionIds.value = markdownSections;
  } else if (activeTab.value === 'mermaid') {
    const allMermaidSections = [...mermaidMainSections, ...nodeShapeSections.map((s) => s.id)];
    sectionIds.value = allMermaidSections;
  } else if (activeTab.value === 'latex') {
    sectionIds.value = latexSections;
  } else {
    sectionIds.value = [];
  }
};

const scrollToSection = (sectionId: string) => {
  if (!contentArea.value) return;

  if (nodeShapeSections.some((shape) => shape.id === sectionId)) {
    nodeShapesSubMenuOpen.value = true;
  } else if (sectionId !== 'node-shapes') {
    nodeShapesSubMenuOpen.value = false;
  }

  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }

  activeSectionId.value = sectionId;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });

    setTimeout(() => {
      if (contentArea.value) {
        contentArea.value.scrollTop -= 50;
      }
    }, 100);
  }
};

const handleScroll = () => {
  if (!contentArea.value || sectionIds.value.length === 0) return;

  const scrollTop = contentArea.value.scrollTop;
  const scrollHeight = contentArea.value.scrollHeight;
  const clientHeight = contentArea.value.clientHeight;

  let currentSection: string | null = null;

  if (scrollTop < 50) {
    currentSection = sectionIds.value[0];
  } else if (scrollHeight - scrollTop - clientHeight < 50) {
    currentSection = sectionIds.value[sectionIds.value.length - 1];
  } else {
    let bestSection: string | null = null;
    let bestScore = -1;

    for (const id of sectionIds.value) {
      const element = document.getElementById(id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const containerRect = contentArea.value.getBoundingClientRect();

      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);

      if (visibleHeight <= 0) continue;

      const totalHeight = rect.height;
      const visibilityRatio = visibleHeight / totalHeight;

      const distanceFromTop = Math.abs(rect.top - containerRect.top);
      const maxDistance = containerRect.height;
      const positionScore = Math.max(0, 1 - distanceFromTop / maxDistance);

      const score = visibilityRatio * 0.7 + positionScore * 0.3;

      if (visibilityRatio >= 0.2 && score > bestScore) {
        bestScore = score;
        bestSection = id;
      }
    }

    currentSection = bestSection;
  }

  if (currentSection && activeSectionId.value !== currentSection) {
    activeSectionId.value = currentSection;

    if (nodeShapeSections.some((shape) => shape.id === currentSection)) {
      nodeShapesSubMenuOpen.value = true;
    }
  }
};

onMounted(() => {
  updateSectionIds();
  if (contentArea.value) {
    contentArea.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (contentArea.value) {
    contentArea.value.removeEventListener('scroll', handleScroll);
  }
});

// Page-specific SEO meta tags
useSeoMeta({
  title: 'Tool Guide - merMDitor | Markdown, Mermaid & LaTeX Syntax Reference',
  description:
    'Complete guide to Markdown syntax, Mermaid diagrams, and LaTeX math expressions. Learn how to create headings, lists, links, flowcharts, sequence diagrams, mathematical formulas, and more in merMDitor.',
  ogTitle: 'Tool Guide - merMDitor | Markdown, Mermaid & LaTeX Reference',
  ogDescription:
    'Complete guide to Markdown syntax, Mermaid diagrams, and LaTeX math expressions. Learn how to create headings, lists, links, flowcharts, and mathematical formulas.',
  ogUrl: 'https://www.mermditor.dev/tool-guide',
  twitterTitle: 'Tool Guide - merMDitor | Markdown, Mermaid & LaTeX Reference',
  twitterDescription:
    'Complete guide to Markdown syntax, Mermaid diagrams, and LaTeX math expressions. Learn formatting, diagrams, math, and shortcuts.',
});

useHead({
  link: [{ rel: 'canonical', href: 'https://www.mermditor.dev/tool-guide' }],
});

// Structured data for the tool guide page
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'merMDitor Tool Guide - Markdown, Mermaid & LaTeX Syntax Reference',
        description:
          'Complete guide to Markdown syntax, Mermaid diagrams, and LaTeX math expressions for the merMDitor editor',
        url: 'https://www.mermditor.dev/tool-guide',
        author: {
          '@type': 'Organization',
          name: 'merMDitor',
        },
        publisher: {
          '@type': 'Organization',
          name: 'merMDitor',
        },
        about: [
          'Markdown syntax',
          'Mermaid diagrams',
          'LaTeX math expressions',
          'Text formatting',
          'Flowcharts',
          'Sequence diagrams',
          'Mathematical formulas',
        ],
      }),
    },
  ],
});
</script>

<style scoped></style>
