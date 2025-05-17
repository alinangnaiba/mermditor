<template>
  <div class="h-screen bg-gray-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-gray-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-semibold">merMDitor</h1>
          </RouterLink>
        </div>
        <nav class="flex items-center space-x-4">
          <RouterLink to="/editor" class="hover:text-blue-400">Editor</RouterLink>
          <RouterLink to="/cheatsheet" class="text-blue-400 font-medium">Cheat Sheet</RouterLink>
        </nav>
      </div>
    </header>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside v-if="activeTab === 'markdown' || activeTab === 'mermaid'" 
             class="w-64 bg-gray-850 p-6 overflow-y-auto flex-shrink-0 border-r border-gray-800">
        <nav class="space-y-4">
          <div v-if="activeTab === 'markdown'">
            <h4 class="text-lg font-semibold mb-3 text-blue-300">Markdown Sections</h4>
            <ul class="space-y-2">
              <li><a @click.prevent="scrollToSection('headings')" href="#headings" :class="['hover:text-blue-400 block', activeSectionId === 'headings' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Headings</a></li>
              <li><a @click.prevent="scrollToSection('text-formatting')" href="#text-formatting" :class="['hover:text-blue-400 block', activeSectionId === 'text-formatting' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Text Formatting</a></li>
              <li><a @click.prevent="scrollToSection('lists')" href="#lists" :class="['hover:text-blue-400 block', activeSectionId === 'lists' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Lists</a></li>
              <li><a @click.prevent="scrollToSection('links-images')" href="#links-images" :class="['hover:text-blue-400 block', activeSectionId === 'links-images' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Links & Images</a></li>
              <li><a @click.prevent="scrollToSection('blockquotes')" href="#blockquotes" :class="['hover:text-blue-400 block', activeSectionId === 'blockquotes' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Blockquotes</a></li>
              <li><a @click.prevent="scrollToSection('code-blocks')" href="#code-blocks" :class="['hover:text-blue-400 block', activeSectionId === 'code-blocks' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Code Blocks</a></li>
              <li><a @click.prevent="scrollToSection('tables')" href="#tables" :class="['hover:text-blue-400 block', activeSectionId === 'tables' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Tables</a></li>
              <li><a @click.prevent="scrollToSection('horizontal-rule')" href="#horizontal-rule" :class="['hover:text-blue-400 block', activeSectionId === 'horizontal-rule' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Horizontal Rule</a></li>
            </ul>
          </div>
          <div v-if="activeTab === 'mermaid'">
            <h4 class="text-lg font-semibold mb-3 text-blue-300">Mermaid Sections</h4>
            <ul class="space-y-2">
              <li><a @click.prevent="scrollToSection('basic-flowchart')" href="#basic-flowchart" :class="['hover:text-blue-400 block', activeSectionId === 'basic-flowchart' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Basic Flowchart</a></li>
              <li><a @click.prevent="scrollToSection('node-shapes')" href="#node-shapes" :class="['hover:text-blue-400 block', activeSectionId === 'node-shapes' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Node Shapes</a></li>
              <li><a @click.prevent="scrollToSection('sequence-diagram')" href="#sequence-diagram" :class="['hover:text-blue-400 block', activeSectionId === 'sequence-diagram' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Sequence Diagram</a></li>
              <li><a @click.prevent="scrollToSection('class-diagram')" href="#class-diagram" :class="['hover:text-blue-400 block', activeSectionId === 'class-diagram' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Class Diagram</a></li>
              <li><a @click.prevent="scrollToSection('state-diagram')" href="#state-diagram" :class="['hover:text-blue-400 block', activeSectionId === 'state-diagram' ? 'text-blue-400 font-semibold' : 'text-gray-300']">State Diagram</a></li>
              <li><a @click.prevent="scrollToSection('gantt-chart')" href="#gantt-chart" :class="['hover:text-blue-400 block', activeSectionId === 'gantt-chart' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Gantt Chart</a></li>
              <li><a @click.prevent="scrollToSection('entity-relationship')" href="#entity-relationship" :class="['hover:text-blue-400 block', activeSectionId === 'entity-relationship' ? 'text-blue-400 font-semibold' : 'text-gray-300']">Entity Relationship</a></li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Cheat Sheet Content - Scrollable area -->
      <div class="flex-1 overflow-y-auto" ref="contentArea" @scroll="handleScroll">
        <div class="container mx-auto py-8 px-4 pb-20">
          <!-- Tab Navigation -->
          <div class="mb-8 sticky top-0 bg-gray-900 py-3 z-10 border-b border-gray-800">
            <nav class="flex justify-center space-x-4" aria-label="Tabs">
              <button 
                @click="activeTab = 'markdown'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'markdown' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
                Markdown
              </button>
              <button 
                @click="activeTab = 'mermaid'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'mermaid' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
                Mermaid
              </button>
              <button 
                @click="activeTab = 'shortcuts'" 
                :class="['py-2 px-4 font-medium rounded-md', activeTab === 'shortcuts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-blue-400']">
                Shortcuts
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div>
            <MarkdownContent v-if="activeTab === 'markdown'" />
            <MermaidContent v-if="activeTab === 'mermaid'" />
            <ShortcutsContent v-if="activeTab === 'shortcuts'" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { setupMermaid } from '@/plugins/mermaid';
import AppFooter from '@/components/AppFooter.vue';
import MarkdownContent from '@/components/cheatsheet/MarkdownContent.vue';
import MermaidContent from '@/components/cheatsheet/MermaidContent.vue';
import ShortcutsContent from '@/components/cheatsheet/ShortcutsContent.vue';

const activeTab = ref('markdown');
const contentArea = ref<HTMLElement | null>(null);
const activeSectionId = ref<string | null>(null);
const sectionIds = ref<string[]>([]);

const markdownSections = ['headings', 'text-formatting', 'lists', 'links-images', 'blockquotes', 'code-blocks', 'tables', 'horizontal-rule'];
const mermaidSections = ['basic-flowchart', 'node-shapes', 'sequence-diagram', 'class-diagram', 'state-diagram', 'gantt-chart', 'entity-relationship'];

watch(activeTab, async (newTab) => {
  activeSectionId.value = null; // Reset active section when tab changes
  await nextTick(); // Wait for DOM to update with new tab content
  updateSectionIds();
  // Automatically set the first section as active if content area is available
  if (contentArea.value && sectionIds.value.length > 0) {
    // Ensure the content area is scrolled to the top before calculating offsets
    contentArea.value.scrollTop = 0; 
    await nextTick();
    handleScroll(); // Initial check after tab switch
  }
}, { immediate: true });

const updateSectionIds = () => {
  if (activeTab.value === 'markdown') {
    sectionIds.value = markdownSections;
  } else if (activeTab.value === 'mermaid') {
    sectionIds.value = mermaidSections;
  } else {
    sectionIds.value = [];
  }
};

const scrollToSection = async (sectionId: string) => {
  activeSectionId.value = sectionId; // Set active section immediately on click
  await nextTick(); 
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement && contentArea.value) {
    const topOffset = sectionElement.offsetTop - contentArea.value.offsetTop;
    contentArea.value.scrollTo({
      top: topOffset - 20, // Adjusted for sticky header/padding
      behavior: 'smooth'
    });
  }
};

const handleScroll = () => {
  if (!contentArea.value || sectionIds.value.length === 0) return;

  const scrollPosition = contentArea.value.scrollTop;
  const containerOffsetTop = contentArea.value.offsetTop;
  // A threshold to make section active a bit before it hits the very top
  const activationThreshold = containerOffsetTop + 50; 

  let currentSection: string | null = null;

  for (const id of sectionIds.value) {
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.offsetTop;
      // Check if the top of the section is at or above the activation threshold
      if (elementTop <= scrollPosition + activationThreshold) {
        currentSection = id;
      } else {
        // If we've passed a section that was potentially active, but the current one is too far down,
        // stick with the previous one.
        break;
      }
    }
  }
  
  // If scrolled to the very bottom, the last section should be active.
  if (contentArea.value.scrollHeight - contentArea.value.scrollTop <= contentArea.value.clientHeight + 5) // +5 for buffer
      currentSection = sectionIds.value[sectionIds.value.length -1];



  if (currentSection) {
    activeSectionId.value = currentSection;
  } else if (sectionIds.value.length > 0) {
    // If no section is "active" (e.g. scrolled above the first section),
    // default to the first section if scroll is near top.
     if (scrollPosition < activationThreshold) {
        activeSectionId.value = sectionIds.value[0];
     } else {
        activeSectionId.value = null;
     }
  } else {
    activeSectionId.value = null;
  }
};

onMounted(() => {
  setupMermaid();
  updateSectionIds();
  if (contentArea.value) {
    contentArea.value.addEventListener('scroll', handleScroll);
    // Initial check in case the page loads scrolled or with a specific section in view
    handleScroll(); 
  }
});

onUnmounted(() => {
  if (contentArea.value) {
    contentArea.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped>
.bg-gray-850 {
  background-color: #1f2937; /* A slightly different shade from gray-800 or gray-900 for contrast */
}
/* Scoped styles for this component */
</style>
