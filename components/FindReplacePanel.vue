<template>
  <div class="find-replace-panel bg-deep-black border border-border-primary rounded-md shadow-lg max-w-lg">
    <!-- Main content container with responsive layout -->
    <div class="flex flex-col lg:flex-row lg:items-center px-2 lg:px-4 py-1 lg:py-2 gap-2 lg:gap-3">
      <!-- Search Input Row -->
      <div class="flex items-center space-x-1 lg:space-x-2 flex-1 min-w-0">
        <label for="search-input" class="text-sm text-text-secondary whitespace-nowrap">
          Find:
        </label>
        <div class="relative flex-1">
          <input
            id="search-input"
            ref="searchInputRef"
            v-model="searchTerm"
            type="text"
            placeholder="Find in text..."
            class="w-full px-2 lg:px-3 py-1 pr-16 lg:pr-20 text-sm bg-dark-surface rounded text-text-primary placeholder-text-tertiary focus:outline-none"
            :class="{ 'border border-red-500': regexError }"
            style="box-shadow: none; outline: none;"
            @keydown="handleSearchKeydown"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          >
          
          <!-- Search Options Toggles -->
          <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 lg:space-x-1">
            <!-- Case Sensitivity Toggle -->
            <button
              title="Match Case"
              type="button"
              class="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-xs rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
              :class="{ 'bg-surface-quaternary text-text-primary': isCaseSensitive }"
              @click="toggleCaseSensitive"
            >
              Aa
            </button>
            
            <!-- Whole Word Toggle -->
            <button
              title="Match Whole Word"
              type="button"
              class="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-xs rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
              :class="{ 'bg-surface-quaternary text-text-primary': isWholeWord }"
              @click="toggleWholeWord"
            >
              <span class="relative">
                ab
                <span class="absolute -bottom-0.5 left-0 right-0 h-0.5 border-b border-current"/>
              </span>
            </button>
            
            <!-- Regex Toggle -->
            <button
              title="Use Regular Expression"
              type="button"
              class="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-xs rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
              :class="{ 'bg-surface-quaternary text-text-primary': isRegex }"
              @click="toggleRegex"
            >
              .*
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Controls Row -->
      <div class="flex items-center justify-between lg:justify-end space-x-1 lg:space-x-1 flex-shrink-0">
        <!-- Previous Button -->
        <button
          title="Previous match (Shift+Enter)"
          class="p-1 lg:p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          :disabled="!hasMatches"
          @click="findPrevious"
        >
          <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Next Button -->
        <button
          title="Next match (Enter)"
          class="p-1 lg:p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          :disabled="!hasMatches"
          @click="findNext"
        >
          <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Match Counter -->
        <div
class="text-xs lg:text-sm whitespace-nowrap flex-shrink-0 min-w-0 px-1 lg:px-2"
             :class="matchCountText === 'No results' ? 'text-red-400' : 'text-text-tertiary'">
          {{ matchCountText }}
        </div>

        <!-- Close Button -->
        <button
          title="Close find panel (Escape)"
          class="p-1 lg:p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary touch-manipulation"
          @click="$emit('close')"
        >
          <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="regexError" class="px-2 lg:px-4 pb-1 lg:pb-2">
      <div class="text-xs text-red-400">{{ regexError }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { validateRegexPattern } from '~/composables/utils/regex-validator';

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
const hasSearched = ref(false);

const isCaseSensitive = ref(false);
const isWholeWord = ref(false);
const isRegex = ref(false);
const regexError = ref('');

const hasMatches = computed(() => matches.value.length > 0);
const matchCountText = computed(() => {
  if (!searchTerm.value.trim()) return 'Press Enter to search';
  if (!hasSearched.value) return 'Press Enter to search';
  if (matches.value.length === 0) return 'No results';
  return `${currentMatchIndex.value + 1} of ${matches.value.length}`;
});

const findMatches = () => {
  matches.value = [];
  currentMatchIndex.value = 0;
  regexError.value = '';
  hasSearched.value = true;

  if (!searchTerm.value || !props.markdownText) {
    return;
  }

  const text = props.markdownText;
  let searchPattern: string | RegExp;
  
  try {
    if (isRegex.value) {
      const validation = validateRegexPattern(searchTerm.value);
      
      if (!validation.isValid) {
        regexError.value = validation.error || 'Invalid regular expression';
        return;
      }
      
      const flags = isCaseSensitive.value ? 'g' : 'gi';
      searchPattern = new RegExp(searchTerm.value, flags);
    } else {
      let pattern = searchTerm.value;
      
      pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      if (isWholeWord.value) {
        pattern = `\\b${pattern}\\b`;
      }
      
      const flags = isCaseSensitive.value ? 'g' : 'gi';
      searchPattern = new RegExp(pattern, flags);
    }

    let match;
    while ((match = searchPattern.exec(text)) !== null) {
      matches.value.push({
        start: match.index,
        end: match.index + match[0].length
      });
      
      if (match[0].length === 0) {
        searchPattern.lastIndex++;
      }
    }
  } catch {
    if (isRegex.value) {
      regexError.value = 'Invalid regular expression';
    }
  }
};

const selectMatch = (matchIndex: number) => {
  if (!props.textareaRef || !props.scrollContainer || !hasMatches.value) return;
  
  const match = matches.value[matchIndex];
  if (!match) return;

  emit('highlight', matches.value, matchIndex);
  
  const textarea = props.textareaRef;
  const textBeforeMatch = props.markdownText.substring(0, match.start);
  const lines = textBeforeMatch.split('\n');
  const lineNumber = lines.length - 1;
  
  const textareaStyles = window.getComputedStyle(textarea);
  const fontSize = parseFloat(textareaStyles.fontSize);
  const lineHeight = parseFloat(textareaStyles.lineHeight) || fontSize * 1.5;
  
  const scrollContainer = props.scrollContainer;
  const textareaRect = textarea.getBoundingClientRect();
  const containerRect = scrollContainer.getBoundingClientRect();
  
  const matchTopInTextarea = lineNumber * lineHeight;
  
  const textareaTopInContainer = textareaRect.top - containerRect.top + scrollContainer.scrollTop;
  const matchTopInContainer = textareaTopInContainer + matchTopInTextarea;
  
  const containerHeight = scrollContainer.clientHeight;
  const targetScrollTop = matchTopInContainer - (containerHeight / 2);
  
  const maxScrollTop = scrollContainer.scrollHeight - containerHeight;
  const finalScrollTop = Math.max(0, Math.min(targetScrollTop, maxScrollTop));
  
  scrollContainer.scrollTo({
    top: finalScrollTop,
    behavior: 'smooth'
  });
  
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
      
      if (matches.value.length === 0) {
        findMatches();
        if (matches.value.length > 0) {
          selectMatch(0);
        }
        return;
      }
      
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

const toggleCaseSensitive = () => {
  isCaseSensitive.value = !isCaseSensitive.value;
  if (searchTerm.value.trim()) {
    findMatches();
    if (matches.value.length > 0) {
      selectMatch(0);
    }
  }
};

const toggleWholeWord = () => {
  isWholeWord.value = !isWholeWord.value;
  if (searchTerm.value.trim()) {
    findMatches();
    if (matches.value.length > 0) {
      selectMatch(0);
    }
  }
};

const toggleRegex = () => {
  isRegex.value = !isRegex.value;
  regexError.value = '';
  if (searchTerm.value.trim()) {
    findMatches();
    if (matches.value.length > 0) {
      selectMatch(0);
    }
  }
};

watch(() => props.markdownText, () => {
  if (searchTerm.value.trim() && matches.value.length > 0) {
    findMatches();
  }
});

watch(searchTerm, () => {
  matches.value = [];
  currentMatchIndex.value = 0;
  regexError.value = '';
  hasSearched.value = false;
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
