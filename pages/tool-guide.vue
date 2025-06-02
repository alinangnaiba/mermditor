<template>
  <div class="min-h-screen bg-slate-900 text-white flex flex-col">
    <!-- Header -->    <header class="py-4 px-6 border-b border-slate-800 flex-shrink-0 bg-slate-900 sticky top-0 z-30">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="~/assets/logo.png" alt="merMDitor Logo" class="h-8 mr-3" />
            <h1 class="text-xl font-semibold text-brand-blue">merMDitor</h1>
          </NuxtLink>
        </div>
        <nav class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-gray-300 hover:text-white">
            Home
          </NuxtLink>
          <NuxtLink to="/editor" class="text-gray-300 hover:text-white">
            Editor
          </NuxtLink>
        </nav>
      </div>
    </header>    <!-- Main Content Area -->
    <div class="flex-1 flex relative">      <!-- Mobile Sidebar Toggle Button -->
      <button 
        v-if="activeTab === 'markdown' || activeTab === 'mermaid'"
        @click="sidebarOpen = !sidebarOpen" 
        class="lg:hidden fixed bottom-6 left-6 z-40 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Toggle navigation menu">
        <svg v-if="!sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Overlay for mobile sidebar background -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
        aria-hidden="true"
      ></div>      <!-- Sidebar Navigation -->
      <div 
        :class="[
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'fixed lg:sticky left-0 top-16 z-30 h-[calc(100vh-64px)] lg:max-h-[calc(100vh-64px)]'
        ]"
      >
        <aside v-if="activeTab === 'markdown' || activeTab === 'mermaid'" 
               class="w-64 bg-slate-800 flex-shrink-0 border-r border-slate-700 h-full overflow-y-auto">
          <nav class="space-y-4 p-6">
          <div v-if="activeTab === 'markdown'">
            <h4 class="text-lg font-semibold mb-3 text-slate-300">Markdown Sections</h4>
            <ul class="space-y-2">
              <li><a @click.prevent="scrollToSection('headings')" href="#headings" :class="['hover:text-slate-200 block', activeSectionId === 'headings' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Headings</a></li>
              <li><a @click.prevent="scrollToSection('text-formatting')" href="#text-formatting" :class="['hover:text-slate-200 block', activeSectionId === 'text-formatting' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Text Formatting</a></li>
              <li><a @click.prevent="scrollToSection('lists')" href="#lists" :class="['hover:text-slate-200 block', activeSectionId === 'lists' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Lists</a></li>
              <li><a @click.prevent="scrollToSection('links-images')" href="#links-images" :class="['hover:text-slate-200 block', activeSectionId === 'links-images' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Links & Images</a></li>
              <li><a @click.prevent="scrollToSection('blockquotes')" href="#blockquotes" :class="['hover:text-slate-200 block', activeSectionId === 'blockquotes' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Blockquotes</a></li>
              <li><a @click.prevent="scrollToSection('code-blocks')" href="#code-blocks" :class="['hover:text-slate-200 block', activeSectionId === 'code-blocks' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Code Blocks</a></li>
              <li><a @click.prevent="scrollToSection('tables')" href="#tables" :class="['hover:text-slate-200 block', activeSectionId === 'tables' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Tables</a></li>
              <li><a @click.prevent="scrollToSection('horizontal-rule')" href="#horizontal-rule" :class="['hover:text-slate-200 block', activeSectionId === 'horizontal-rule' ? 'text-slate-200 font-semibold' : 'text-slate-400']">Horizontal Rule</a></li>
            </ul>
          </div>
          <div v-if="activeTab === 'mermaid'">
            <h4 class="text-lg font-semibold mb-3 text-slate-300">Mermaid Sections</h4>
            <ul class="space-y-2">
              <li><a @click.prevent="scrollToSection('basic-flowchart')" href="#basic-flowchart" :class="['hover:text-slate-200 block', isActiveSection('basic-flowchart') ? 'text-slate-200 font-semibold' : 'text-slate-400']">Basic Flowchart</a></li>
              <li>
                <a @click.prevent="toggleNodeShapesSubMenu(); scrollToSection('node-shapes')" href="#node-shapes" :class="['hover:text-slate-200 block', isActiveSection('node-shapes') || isNodeShapeSubMenuActive() ? 'text-slate-200 font-semibold' : 'text-slate-400']">
                  Node Shapes
                  <svg class="inline-block w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-90': nodeShapesSubMenuOpen }" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </a>
                <ul v-if="nodeShapesSubMenuOpen" class="pl-4 mt-1 space-y-1">
                  <li v-for="shape in nodeShapeSections" :key="shape.id">
                    <a @click.prevent="scrollToSection(shape.id)" :href="'#' + shape.id" :class="['hover:text-slate-200 block text-sm', isActiveSection(shape.id) ? 'text-slate-200 font-semibold' : 'text-slate-400']">
                      {{ shape.name }}
                    </a>
                  </li>
                </ul>
              </li>
              <li><a @click.prevent="scrollToSection('sequence-diagram')" href="#sequence-diagram" :class="['hover:text-slate-200 block', isActiveSection('sequence-diagram') ? 'text-slate-200 font-semibold' : 'text-slate-400']">Sequence Diagram</a></li>
              <li><a @click.prevent="scrollToSection('class-diagram')" href="#class-diagram" :class="['hover:text-slate-200 block', isActiveSection('class-diagram') ? 'text-slate-200 font-semibold' : 'text-slate-400']">Class Diagram</a></li>
              <li><a @click.prevent="scrollToSection('state-diagram')" href="#state-diagram" :class="['hover:text-slate-200 block', isActiveSection('state-diagram') ? 'text-slate-200 font-semibold' : 'text-slate-400']">State Diagram</a></li>
              <li><a @click.prevent="scrollToSection('gantt-chart')" href="#gantt-chart" :class="['hover:text-slate-200 block', isActiveSection('gantt-chart') ? 'text-slate-200 font-semibold' : 'text-slate-400']">Gantt Chart</a></li>
              <li><a @click.prevent="scrollToSection('entity-relationship')" href="#entity-relationship" :class="['hover:text-slate-200 block', isActiveSection('entity-relationship') ? 'text-slate-200 font-semibold' : 'text-slate-400']">Entity Relationship</a></li>
            </ul>
          </div>        </nav>
      </aside>
      </div>

      <!-- Documentation Content - Scrollable area -->
      <div class="flex-1 overflow-y-auto" ref="contentArea" @scroll="handleScroll">
        <div class="container mx-auto py-8 px-4 pb-20">          <!-- Tab Navigation -->
          <div class="mb-8 sticky top-16 bg-slate-900 py-3 z-20 border-b border-slate-800">
            <nav class="flex justify-center space-x-4" aria-label="Tabs">
              <button 
                @click="activeTab = 'markdown'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'markdown' ? 'text-slate-200 border-b-2 border-slate-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300']">
                Markdown
              </button>
              <button 
                @click="activeTab = 'mermaid'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'mermaid' ? 'text-slate-200 border-b-2 border-slate-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300']">
                Mermaid
              </button>
              <button 
                @click="activeTab = 'shortcuts'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'shortcuts' ? 'text-slate-200 border-b-2 border-slate-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300']">
                Shortcuts
              </button>
            </nav>
          </div>          <!-- Tab Content -->
          <div>
            <ToolGuideMarkdownContent v-if="activeTab === 'markdown'" />
            <ToolGuideMermaidContent v-if="activeTab === 'mermaid'" />
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
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';

const activeTab = ref('markdown');
const contentArea = ref<HTMLElement | null>(null);
const activeSectionId = ref<string | null>(null);
const sectionIds = ref<string[]>([]);
const nodeShapesSubMenuOpen = ref(false);
const sidebarOpen = ref(false);

const markdownSections = ['headings', 'text-formatting', 'lists', 'links-images', 'blockquotes', 'code-blocks', 'tables', 'horizontal-rule'];
const mermaidMainSections = ['basic-flowchart', 'node-shapes', 'sequence-diagram', 'class-diagram', 'state-diagram', 'gantt-chart', 'entity-relationship'];
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
  return nodeShapeSections.some(shape => isActiveSection(shape.id));
};

const toggleNodeShapesSubMenu = () => {
  nodeShapesSubMenuOpen.value = !nodeShapesSubMenuOpen.value;
};

watch(activeTab, async (newTab) => {
  activeSectionId.value = null;
  nodeShapesSubMenuOpen.value = false;
  await nextTick();
  updateSectionIds();
  if (contentArea.value && sectionIds.value.length > 0) {
    contentArea.value.scrollTop = 0;
    // Wait a bit more for components to render
    setTimeout(() => {
      handleScroll();
    }, 100);
  }
}, { immediate: true });

const updateSectionIds = () => {
  if (activeTab.value === 'markdown') {
    sectionIds.value = markdownSections;
  } else if (activeTab.value === 'mermaid') {
    const allMermaidSections = [...mermaidMainSections, ...nodeShapeSections.map(s => s.id)];
    sectionIds.value = allMermaidSections;
  } else {
    sectionIds.value = [];
  }
};

const scrollToSection = (sectionId: string) => {
  if (!contentArea.value) return;
  
  // Handle node shapes submenu state
  if (nodeShapeSections.some(shape => shape.id === sectionId)) {
    nodeShapesSubMenuOpen.value = true;
  } else if (sectionId !== 'node-shapes') {
    nodeShapesSubMenuOpen.value = false;
  }
  
  // Close sidebar on mobile after selection
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
  
  // Update active section immediately for responsive feedback
  activeSectionId.value = sectionId;
    // Simple approach: use scrollIntoView with better positioning
  nextTick(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Use 'center' positioning to avoid going too far
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // Fine-tune position to show section header properly
      setTimeout(() => {
        if (contentArea.value) {
          // Scroll up just enough to show the section header nicely
          contentArea.value.scrollTop -= 50;
        }
      }, 100);
    }
  });
};

const handleScroll = () => {
  if (!contentArea.value || sectionIds.value.length === 0) return;

  const containerRect = contentArea.value.getBoundingClientRect();
  const activationThreshold = 100;
  
  let currentSection: string | null = null;

  // Find the current section by checking which section is visible in viewport
  for (const id of sectionIds.value) {
    const element = document.getElementById(id);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top;
      
      if (relativeTop <= activationThreshold) {
        currentSection = id;
      } else {
        break;
      }
    }
  }
  
  const scrollHeight = contentArea.value.scrollHeight;
  const scrollTop = contentArea.value.scrollTop;
  const clientHeight = contentArea.value.clientHeight;
  const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
  
  if (isAtBottom && sectionIds.value.length > 0) {
    currentSection = sectionIds.value[sectionIds.value.length - 1];
  }
  
  // If at the top of the page, ensure the first section is active
  if (contentArea.value.scrollTop < 50 && sectionIds.value.length > 0) {
    currentSection = sectionIds.value[0];
  }

  if (currentSection && activeSectionId.value !== currentSection) {
    activeSectionId.value = currentSection;
    
    // Auto-open node shapes submenu if a node shape section is active
    if (nodeShapeSections.some(shape => shape.id === currentSection)) {
      nodeShapesSubMenuOpen.value = true;
    }
  }
};

onMounted(() => {
  updateSectionIds();
  if (contentArea.value) {
    contentArea.value.addEventListener('scroll', handleScroll);
  }
  // Wait for components to render before initial scroll check
  setTimeout(() => {
    handleScroll();
  }, 200);
});

onUnmounted(() => {
  if (contentArea.value) {
    contentArea.value.removeEventListener('scroll', handleScroll);
  }
});

// Page-specific SEO meta tags
useSeoMeta({
  title: 'Tool Guide - merMDitor | Markdown & Mermaid Syntax Reference',
  description: 'Complete guide to Markdown syntax and Mermaid diagrams. Learn how to create headings, lists, links, flowcharts, sequence diagrams, and more in merMDitor.',
  ogTitle: 'Tool Guide - merMDitor | Markdown & Mermaid Reference',
  ogDescription: 'Complete guide to Markdown syntax and Mermaid diagrams. Learn how to create headings, lists, links, flowcharts, and sequence diagrams.',
  ogUrl: 'https://www.mermditor.dev/tool-guide',
  twitterTitle: 'Tool Guide - merMDitor | Markdown & Mermaid Reference',
  twitterDescription: 'Complete guide to Markdown syntax and Mermaid diagrams. Learn formatting, diagrams, and shortcuts.'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.mermditor.dev/tool-guide' }
  ]
})

// Structured data for the tool guide page
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'merMDitor Tool Guide - Markdown & Mermaid Syntax Reference',
        description: 'Complete guide to Markdown syntax and Mermaid diagrams for the merMDitor editor',
        url: 'https://www.mermditor.dev/tool-guide',
        author: {
          '@type': 'Organization',
          name: 'merMDitor'
        },
        publisher: {
          '@type': 'Organization',
          name: 'merMDitor'
        },
        about: [
          'Markdown syntax',
          'Mermaid diagrams',
          'Text formatting',
          'Flowcharts',
          'Sequence diagrams'
        ]
      })
    }
  ]
})
</script>

<style scoped>
</style>
