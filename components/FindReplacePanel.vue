<template>
  <div class="find-replace-panel bg-deep-black border-b border-border-primary">
    <div class="flex items-center px-4 py-2 space-x-3">
      <!-- Search Input -->
      <div class="flex items-center space-x-2 flex-1">
        <label for="search-input" class="text-sm text-text-secondary whitespace-nowrap">
          Find:
        </label>
        <input
          id="search-input"
          ref="searchInputRef"
          v-model="searchTerm"
          type="text"
          placeholder="Find in text..."
          class="flex-1 px-3 py-1 text-sm bg-dark-surface rounded text-text-primary placeholder-text-tertiary focus:outline-none"
          style="box-shadow: none; outline: none;"
          @keydown="handleSearchKeydown"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        >
      </div>

      <!-- Navigation Controls -->
      <div class="flex items-center space-x-1">
        <!-- Previous Button -->
        <button
          title="Previous match (Shift+Enter)"
          class="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasMatches"
          @click="findPrevious"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Next Button -->
        <button
          title="Next match (Enter)"
          class="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!hasMatches"
          @click="findNext"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Match Counter -->
        <span class="text-xs text-text-tertiary min-w-fit px-2">
          {{ matchCountText }}
        </span>
      </div>

      <!-- Close Button -->
      <button
        title="Close (Escape)"
        class="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary"
        @click="closeFindPanel"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

interface Props {
  markdownText: string;
  textareaRef: HTMLTextAreaElement | null;
  scrollContainer: HTMLElement | null;
}

interface Emits {
  close: [];
  highlight: [matches: Array<{ start: number; end: number }>, currentIndex: number];
  clearHighlight: [];
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchTerm = ref('');
const currentMatchIndex = ref(0);
const matches = ref<Array<{ start: number; end: number }>>([]);

const hasMatches = computed(() => matches.value.length > 0);
const matchCountText = computed(() => {
  if (!searchTerm.value.trim()) return 'Press Enter to search';
  if (matches.value.length === 0) return 'No results';
  return `${currentMatchIndex.value + 1} of ${matches.value.length}`;
});

const findMatches = () => {
  matches.value = [];
  currentMatchIndex.value = 0;

  if (!searchTerm.value || !props.markdownText) {
    return;
  }

  const text = props.markdownText;
  const searchText = searchTerm.value.toLowerCase();
  const textLower = text.toLowerCase();
  
  let index = 0;
  while ((index = textLower.indexOf(searchText, index)) !== -1) {
    matches.value.push({
      start: index,
      end: index + searchText.length
    });
    index += searchText.length;
  }
};

const selectMatch = (matchIndex: number) => {
  if (!props.textareaRef || !props.scrollContainer || !hasMatches.value) return;
  
  const match = matches.value[matchIndex];
  if (!match) return;

  // Emit highlighting information to parent component
  emit('highlight', matches.value, matchIndex);
  
  // Calculate the position of the match in the textarea
  const textarea = props.textareaRef;
  const textBeforeMatch = props.markdownText.substring(0, match.start);
  const lines = textBeforeMatch.split('\n');
  const lineNumber = lines.length - 1; // 0-based line number
  
  // Get computed styles to calculate accurate line height
  const textareaStyles = window.getComputedStyle(textarea);
  const fontSize = parseFloat(textareaStyles.fontSize);
  const lineHeight = parseFloat(textareaStyles.lineHeight) || fontSize * 1.5;
  
  // Get textarea position relative to the scroll container
  const scrollContainer = props.scrollContainer;
  const textareaRect = textarea.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  
  // Calculate the vertical position of the match within the textarea
  const matchTopInTextarea = lineNumber * lineHeight;
  
  // Calculate the absolute position within the scroll container
  const textareaTopInContainer = textareaRect.top - containerRect.top + scrollContainer.scrollTop;
  const matchTopInContainer = textareaTopInContainer + matchTopInTextarea;
  
  // Calculate target scroll position to center the match
  const containerHeight = scrollContainer.clientHeight;
  const targetScrollTop = matchTopInContainer - (containerHeight / 2);
  
  // Ensure we don't scroll past the bounds
  const maxScrollTop = scrollContainer.scrollHeight - containerHeight;
  const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
  
  // Smooth scroll to the match
  scrollContainer.scrollTo({
    top: finalScrollTop,
    behavior: 'smooth'
  });
  
  // Keep focus in the search input
  setTimeout(() => {
    searchInputRef.value?.focus();
  }, 100);
};

const findNext = () => {
  if (!hasMatches.value) return;
  
  currentMatchIndex.value = (currentMatchIndex.value + 1) % matches.value.length;
  selectMatch(currentMatchIndex.value);
};

const findPrevious = () => {
  if (!hasMatches.value) return;
  
  currentMatchIndex.value = currentMatchIndex.value === 0 
    ? matches.value.length - 1 
    : currentMatchIndex.value - 1;
  selectMatch(currentMatchIndex.value);
};

const handleSearchKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      if (!searchTerm.value.trim()) return;
      
      // If no matches exist yet, find them first
      if (matches.value.length === 0) {
        findMatches();
        if (matches.value.length > 0) {
          selectMatch(0); // Start at first match
        }
        return;
      }
      
      // Navigate through existing matches
      if (event.shiftKey) {
        findPrevious();
      } else {
        findNext();
      }
      break;
    case 'Escape':
      event.preventDefault();
      closeFindPanel();
      break;
  }
};

const closeFindPanel = () => {
  emit('clearHighlight');
  emit('close');
};

const handleInputFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    target.style.boxShadow = '0 0 0 1px #79B5D7';
  }
};

const handleInputBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement;
  if (target) {
    target.style.boxShadow = 'none';
  }
};

// Watch for text changes to update matches only if search was already performed
watch(() => props.markdownText, () => {
  if (searchTerm.value.trim() && matches.value.length > 0) {
    findMatches();
  }
});

// Reset matches when search term changes
watch(searchTerm, () => {
  matches.value = [];
  currentMatchIndex.value = 0;
  emit('clearHighlight');
});

onMounted(() => {
  nextTick(() => {
    searchInputRef.value?.focus();
  });
});

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeFindPanel();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
});
</script>
