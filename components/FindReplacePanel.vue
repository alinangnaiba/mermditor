<template>
  <div class="find-replace-panel border border-border-primary rounded-md shadow-lg max-w-lg">
    <!-- Mobile Layout: Five Rows -->
    <div class="lg:hidden flex flex-col p-1 gap-1">
      <!-- Row 1: Find Input -->
      <div class="flex gap-1 items-center">
        <div class="relative flex-1">
          <input
            ref="searchInputRef"
            v-model="searchTerm"
            type="text"
            placeholder="Find in text..."
            class="w-full px-2 py-1 pr-2 text-sm bg-dark-surface rounded text-text-primary placeholder-text-quaternary focus:outline-none"
            :class="{ 'border border-red-500': regexError }"
            style="box-shadow: none; outline: none;"
            @keydown="handleSearchKeydown"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          >
        </div>
      </div>
      
      <!-- Row 2: Options + Nav Controls + Match Counter -->
      <div class="flex items-center justify-between pl-1 pr-1">
        <!-- Search Options -->
        <div class="flex items-center space-x-2">
          <!-- Case Sensitivity Toggle -->
          <button
            title="Match Case"
            type="button"
            class="w-5 h-5 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
            :class="{ 'bg-surface-quaternary text-text-primary': isCaseSensitive }"
            @click="toggleCaseSensitive"
          >
            Aa
          </button>
          
          <!-- Whole word Toggle -->
          <button
            title="Match Whole word"
            type="button"
            class="w-5 h-5 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
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
            class="w-5 h-5 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none touch-manipulation"
            :class="{ 'bg-surface-quaternary text-text-primary': isRegex }"
            @click="toggleRegex"
          >
            .*
          </button>
        </div>
        
        <!-- Navigation Controls -->
        <div class="flex items-center space-x-1">
          <!-- Previous Button -->
          <button
            title="Previous match (Shift+Enter)"
            class="p-1 rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            :disabled="!hasMatches"
            @click="findPrevious"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>
          </button>

          <!-- Next Button -->
          <button
            title="Next match (Enter)"
            class="p-1 rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            :disabled="!hasMatches"
            @click="findNext"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
          </button>

          <!-- Match Counter -->
          <div class="text-xs whitespace-nowrap px-1 text-text-primary">
            {{ matchCountText }}
          </div>
        </div>
      </div>
      
      <!-- Row 3: Replace Input (only when replace mode active) -->
      <div v-if="isReplaceMode" class="flex gap-1 items-center">
        <div class="relative flex-1">
          <input
            ref="replaceInputRef"
            v-model="replaceTerm"
            type="text"
            placeholder="Replace with..."
            class="w-full px-2 py-1 text-sm bg-dark-surface rounded text-text-primary placeholder-text-quaternary focus:outline-none"
            style="box-shadow: none; outline: none;"
            @keydown="handleReplaceKeydown"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          >
        </div>
      </div>
      
      <!-- Row 4: Replace Buttons (only when replace mode active) -->
      <div v-if="isReplaceMode" class="flex items-center justify-start space-x-2 pl-1">
        <!-- Replace Button -->
        <button
          title="Replace current match"
          type="button"
          class="px-1.5 py-0.5 text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          :disabled="!hasMatches || !replaceTerm.trim()"
          @click="replaceCurrent"
        >
          Replace
        </button>
        
        <!-- Replace All Button -->
        <button
          title="Replace all matches"
          type="button"
          class="px-1.5 py-0.5 text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          :disabled="!hasMatches || !replaceTerm.trim()"
          @click="replaceAll"
        >
          Replace All
        </button>
      </div>
      
      <!-- Row 5: Toggle + Close Buttons -->
      <div class="flex items-center justify-between px-1">
        <!-- Toggle Button -->
        <button
          title="Toggle Replace Mode"
          type="button"
          class="flex items-center justify-center text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-1 focus:ring-accent-primary rounded p-1 touch-manipulation"
          @click="toggleReplaceMode"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isReplaceMode"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        
        <!-- Close Button -->
        <button
          title="Close find panel (Escape)"
          class="flex items-center justify-center text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary rounded p-1 touch-manipulation"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Desktop Layout: Three Columns -->
    <div class="hidden lg:flex p-1 gap-1">
      <!-- Left Column: Toggle Button (spans full height) -->
      <div class="toggle-column flex flex-col w-8 flex-shrink-0">
        <button
          title="Toggle Replace Mode"
          type="button"
          class="toggle-button flex-1 flex items-center justify-center text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-1 focus:ring-accent-primary rounded p-1"
          @click="toggleReplaceMode"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isReplaceMode"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </div>
      
      <!-- Middle Column: Content (Find and Replace inputs) -->
      <div class="content-column flex-1 flex flex-col gap-1">
        <!-- Find Row -->
        <div class="find-row flex gap-1 items-center">
          <!-- Find Input -->
          <div class="relative flex-1">
            <input
              ref="searchInputRef"
              v-model="searchTerm"
              type="text"
              placeholder="Find in text..."
              class="w-full px-3 py-1 pr-20 text-sm bg-dark-surface rounded text-text-primary placeholder-text-quaternary focus:outline-none"
              :class="{ 'border border-red-500': regexError }"
              style="box-shadow: none; outline: none;"
              @keydown="handleSearchKeydown"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            >
            
            <!-- Search Options Toggles (Desktop) -->
            <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <!-- Case Sensitivity Toggle -->
              <button
                title="Match Case"
                type="button"
                class="w-6 h-6 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none"
                :class="{ 'bg-surface-quaternary text-text-primary': isCaseSensitive }"
                @click="toggleCaseSensitive"
              >
                Aa
              </button>
              
              <!-- Whole word Toggle -->
              <button
                title="Match Whole word"
                type="button"
                class="w-6 h-6 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none"
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
                class="w-6 h-6 flex items-center justify-center text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none"
                :class="{ 'bg-surface-quaternary text-text-primary': isRegex }"
                @click="toggleRegex"
              >
                .*
              </button>
            </div>
          </div>
          
          <!-- Navigation Controls (Desktop) -->
          <div class="nav-controls flex items-center space-x-1">
            <!-- Previous Button -->
            <button
              title="Previous match (Shift+Enter)"
              class="p-1 rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasMatches"
              @click="findPrevious"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
              </svg>

            </button>

            <!-- Next Button -->
            <button
              title="Next match (Enter)"
              class="p-1 rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasMatches"
              @click="findNext"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>

            </button>

            <!-- Match Counter -->
            <div class="text-sm whitespace-nowrap px-2 text-text-primary">
              {{ matchCountText }}
            </div>
          </div>
        </div>
        
        <!-- Replace Row (only when replace mode active) -->
        <div v-if="isReplaceMode" class="replace-row flex gap-1 items-center">
          <!-- Replace Input -->
          <div class="relative flex-1">
            <input
              ref="replaceInputRef"
              v-model="replaceTerm"
              type="text"
              placeholder="Replace with..."
              class="w-full px-3 py-1 text-sm bg-dark-surface rounded text-text-primary placeholder-text-quaternary focus:outline-none"
              style="box-shadow: none; outline: none;"
              @keydown="handleReplaceKeydown"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
            >
          </div>
          
          <!-- Replace Buttons (Desktop) -->
          <div class="replace-buttons flex items-center space-x-1">
            <!-- Replace Button -->
            <button
              title="Replace current match"
              type="button"
              class="px-2 py-1 text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasMatches || !replaceTerm.trim()"
              @click="replaceCurrent"
            >
              Replace
            </button>
            
            <!-- Replace All Button -->
            <button
              title="Replace all matches"
              type="button"
              class="px-2 py-1 text-xs rounded text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!hasMatches || !replaceTerm.trim()"
              @click="replaceAll"
            >
              Replace All
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Close Button (spans full height) -->
      <div class="close-column flex flex-col w-8 flex-shrink-0">
        <button
          title="Close find panel (Escape)"
          class="close-button flex-1 flex items-center justify-center text-text-primary hover:text-text-primary hover:bg-surface-quaternary focus:outline-none focus:ring-2 focus:ring-accent-primary rounded p-1 touch-manipulation"
          @click="$emit('close')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

interface Props {
  markdownText: string;
  textareaRef: HTMLTextAreaElement | null;
  scrollContainer: HTMLElement | null;
  initialReplaceMode?: boolean;
}

interface Emits {
  close: [];
  highlight: [matches: Array<{ start: number; end: number }>, currentIndex: number];
  clearHighlight: [];
  replace: [text: string];
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const searchInputRef = ref<HTMLInputElement | null>(null);
const replaceInputRef = ref<HTMLInputElement | null>(null);
const searchTerm = ref('');
const replaceTerm = ref('');
const currentMatchIndex = ref(0);
const matches = ref<Array<{ start: number; end: number }>>([]);
const hasSearched = ref(false);
const isReplaceMode = ref(false);

const isCaseSensitive = ref(false);
const isWholeWord = ref(false);
const isRegex = ref(false);
const regexError = ref('');

const hasMatches = computed(() => matches.value.length > 0);
const matchCountText = computed(() => {
  if (!searchTerm.value.trim()) return 'No results';
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
      
      if (matches.value.length > 0) {
        if (event.shiftKey) {
          findPrevious();
        } else {
          findNext();
        }
      } else {
        findMatches();
        if (matches.value.length > 0) {
          selectMatch(0);
        }
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
    debouncedSearch();
  }
};

const toggleWholeWord = () => {
  isWholeWord.value = !isWholeWord.value;
  if (searchTerm.value.trim()) {
    debouncedSearch();
  }
};

const toggleRegex = () => {
  isRegex.value = !isRegex.value;
  regexError.value = '';
  if (searchTerm.value.trim()) {
    debouncedSearch();
  }
};

const toggleReplaceMode = () => {
  isReplaceMode.value = !isReplaceMode.value;
  if (isReplaceMode.value) {
    nextTick(() => {
      replaceInputRef.value?.focus();
    });
  }
};

const handleReplaceKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      if (!replaceTerm.value.trim()) return;
      if (event.ctrlKey) {
        replaceAll();
      } else {
        replaceCurrent();
      }
      break;
    case 'Escape':
      event.preventDefault();
      closeFindPanel();
      break;
  }
};

const replaceCurrent = () => {
  if (!hasMatches.value || !props.textareaRef || !replaceTerm.value.trim()) return;

  const currentMatch = matches.value[currentMatchIndex.value];
  if (!currentMatch) return;

  const text = props.markdownText;
  const newText = text.substring(0, currentMatch.start) + 
                  replaceTerm.value + 
                  text.substring(currentMatch.end);

  emit('replace', newText);

  const lengthDiff = replaceTerm.value.length - (currentMatch.end - currentMatch.start);

  for (let i = currentMatchIndex.value + 1; i < matches.value.length; i++) {
    matches.value[i].start += lengthDiff;
    matches.value[i].end += lengthDiff;
  }

  matches.value.splice(currentMatchIndex.value, 1);

  if (currentMatchIndex.value >= matches.value.length && matches.value.length > 0) {
    currentMatchIndex.value = matches.value.length - 1;
  }

  if (matches.value.length > 0) {
    selectMatch(currentMatchIndex.value);
  } else {
    emit('clearHighlight');
  }
};

const replaceAll = () => {
  if (!hasMatches.value || !replaceTerm.value.trim()) return;

  // Sort matches by position (descending) to replace from end to beginning
  // This prevents position shifts from affecting later replacements
  const sortedMatches = [...matches.value].sort((a, b) => b.start - a.start);
  
  let text = props.markdownText;
  
  for (const match of sortedMatches) {
    text = text.substring(0, match.start) + 
           replaceTerm.value + 
           text.substring(match.end);
  }
  
  emit('replace', text);
  
  matches.value = [];
  currentMatchIndex.value = 0;
  hasSearched.value = false;
  emit('clearHighlight');
};

const debouncedSearch = debounce(() => {
  if (searchTerm.value.trim()) {
    findMatches();
    if (matches.value.length > 0) {
      selectMatch(0);
    }
  } else {
    matches.value = [];
    currentMatchIndex.value = 0;
    hasSearched.value = false;
    emit('clearHighlight');
  }
}, 300);

watch(() => props.markdownText, () => {
  if (searchTerm.value.trim() && matches.value.length > 0) {
    findMatches();
  }
});

watch(searchTerm, () => {
  hasSearched.value = false;
  debouncedSearch();
});

onMounted(() => {
  if (props.initialReplaceMode) {
    isReplaceMode.value = true;
  }
  
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
