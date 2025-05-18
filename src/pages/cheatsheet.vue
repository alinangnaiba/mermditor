<template>
  <div class="h-screen bg-slate-900 text-white flex flex-col">
    <!-- Header -->
    <header class="py-4 px-6 border-b border-slate-800 flex-shrink-0">
      <div class="container mx-auto flex justify-between items-center">
        <div class="flex items-center">
          <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
            <img src="@/assets/logo.png" alt="MerMDitor Logo" class="h-8 mr-2" />
            <h1 class="text-xl font-semibold text-brand-blue">merMDitor</h1>
          </RouterLink>
        </div>
        <nav class="flex items-center space-x-4">
            <RouterLink to="/" class="text-slate-300 font-medium">Home</RouterLink>
            <RouterLink to="/editor" class="hover:text-slate-300">Editor</RouterLink>
        </nav>
      </div>
    </header>
    
    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside v-if="activeTab === 'markdown' || activeTab === 'mermaid'" 
             class="w-64 bg-slate-800 p-6 overflow-y-auto flex-shrink-0 border-r border-slate-700">
        <nav class="space-y-4">
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
          </div>
        </nav>
      </aside>

      <!-- Cheat Sheet Content - Scrollable area -->
      <div class="flex-1 overflow-y-auto" ref="contentArea" @scroll="handleScroll">
        <div class="container mx-auto py-8 px-4 pb-20">
          <!-- Tab Navigation -->
          <div class="mb-8 sticky top-0 bg-slate-900 py-3 z-10 border-b border-slate-800">
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
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { setupMermaid } from '@/plugins/mermaid';
import AppFooter from '@/components/AppFooter.vue';
import MarkdownContent from '@/components/cheatsheet/MarkdownContent.vue';
import MermaidContent from '@/components/cheatsheet/MermaidContent.vue';
import ShortcutsContent from '@/components/cheatsheet/ShortcutsContent.vue';

const activeTab = ref('markdown');
const contentArea = ref<HTMLElement | null>(null);
const activeSectionId = ref<string | null>(null);
const sectionIds = ref<string[]>([]);
const nodeShapesSubMenuOpen = ref(false);

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
    await nextTick();
    handleScroll();
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

const scrollToSection = async (sectionId: string) => {
  activeSectionId.value = sectionId;

  if (nodeShapeSections.some(shape => shape.id === sectionId)) {
    nodeShapesSubMenuOpen.value = true;
  } else if (sectionId !== 'node-shapes') {
    nodeShapesSubMenuOpen.value = false;
  }

  await nextTick(); 
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement && contentArea.value) {
    const stickyHeaderHeight = document.querySelector('.sticky.top-0')?.clientHeight || 0;
    const topOffset = sectionElement.offsetTop - contentArea.value.offsetTop - stickyHeaderHeight;
    
    const targetSection = sectionId;
    
    contentArea.value.scrollTo({
      top: topOffset - 20,
      behavior: 'smooth'
    });
    
    // After scroll animation completes (approx 500ms), ensure the active section is still correct
    setTimeout(() => {
      if (activeSectionId.value !== targetSection) {
        activeSectionId.value = targetSection;
      }
    }, 500);
  }
};

const handleScroll = () => {
  if (!contentArea.value || sectionIds.value.length === 0) return;

  if (activeSectionId.value && nodeShapeSections.some(shape => shape.id === activeSectionId.value)) {
    const activeElement = document.getElementById(activeSectionId.value);
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      const contentRect = contentArea.value.getBoundingClientRect();
      if (rect.top < contentRect.bottom && rect.bottom > contentRect.top) {
        return;
      }
    }
  }

  const scrollPosition = contentArea.value.scrollTop;
  const containerOffsetTop = contentArea.value.offsetTop;
  const stickyHeaderHeight = document.querySelector('.sticky.top-0')?.clientHeight || 0;
  // A threshold to make section active a bit before it hits the very top
  const activationThreshold = containerOffsetTop + stickyHeaderHeight + 50; 

  let currentSection: string | null = null;

  for (const id of sectionIds.value) {
    const element = document.getElementById(id);
    if (element) {
      const elementTop = element.offsetTop;
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
  if (contentArea.value.scrollHeight - contentArea.value.scrollTop <= contentArea.value.clientHeight + 5) {
    const lastMainSection = mermaidMainSections[mermaidMainSections.length - 1];
    const lastNodeShapeSection = nodeShapeSections[nodeShapeSections.length -1]?.id;
    
    // Prioritize last node shape if it's the actual last element in the scrollable content
    const lastOverallSection = document.getElementById(lastNodeShapeSection || '') 
      ? lastNodeShapeSection 
      : lastMainSection;
      
    if (activeTab.value === 'mermaid') {
        // Check if the last element in view is a node shape or a main mermaid section
        const lastVisibleElementId = sectionIds.value.find(id => {
            const el = document.getElementById(id);
            if (!el || !contentArea.value) return false;
            const rect = el.getBoundingClientRect();
            return rect.bottom <= contentArea.value.getBoundingClientRect().bottom + 5;
        });
        if (lastVisibleElementId) currentSection = lastVisibleElementId;
        else currentSection = lastOverallSection; 
    } else {
        currentSection = sectionIds.value[sectionIds.value.length -1];
    }
  }

  if (currentSection) {
    // Only update active section if it's changed to prevent unnecessary re-renders
    if (activeSectionId.value !== currentSection) {
      activeSectionId.value = currentSection;
    }
    
    if (nodeShapeSections.some(shape => shape.id === currentSection)) {
      nodeShapesSubMenuOpen.value = true;
    }
  } else if (sectionIds.value.length > 0) {
    // If no section is "active" (e.g. scrolled above the first section),
    // default to the first section if scroll is near top.
     if (scrollPosition < containerOffsetTop + 10) { // 10px buffer
      activeSectionId.value = sectionIds.value[0];
    }
  }
};

onMounted(() => {
  setupMermaid();
  updateSectionIds();
  if (contentArea.value) {
    contentArea.value.addEventListener('scroll', handleScroll);
  }
  // Initial check in case the content doesn't trigger a scroll event initially
  // (e.g. if content is shorter than the viewport or already scrolled to a section via URL hash)
  handleScroll(); 
});

onUnmounted(() => {
  if (contentArea.value) {
    contentArea.value.removeEventListener('scroll', handleScroll);
  }
});

</script>

<style scoped>
</style>
