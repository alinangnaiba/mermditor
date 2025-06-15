import { ref, watch, onMounted, nextTick, type Ref } from 'vue';
import debounce from 'lodash/debounce';

export function useEditorStateAndPersistence(
  initialMarkdownFromProps: Ref<string | undefined>,
  defaultContent: string,
  autoResizeTextarea: () => void
) {  const markdownText = ref('');
  const isEditorVisible = ref(true);
  const isPreviewVisible = ref(true);
  const lastSaved = ref<string>('');

  const saveToLocalStorage = debounce((content: string) => {
    localStorage.setItem('mermd-content', content);
    localStorage.setItem('mermd-markdown-input', content);
    const now = new Date();
    lastSaved.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, 500);
  const loadInitialState = () => {
    const savedVisibility = localStorage.getItem('mermd-editor-visible');
    if (savedVisibility !== null) {
      isEditorVisible.value = savedVisibility === 'true';
    }

    const savedPreviewVisibility = localStorage.getItem('mermd-preview-visible');
    if (savedPreviewVisibility !== null) {
      isPreviewVisible.value = savedPreviewVisibility === 'true';
    }

    if (initialMarkdownFromProps.value) {
      markdownText.value = initialMarkdownFromProps.value;
    } else {
      const savedMarkdown = localStorage.getItem('mermd-markdown-input');
      if (savedMarkdown) {
        markdownText.value = savedMarkdown;
      } else {
        markdownText.value = defaultContent;
      }
    }
  };
  const toggleEditorVisibility = () => {
    isEditorVisible.value = !isEditorVisible.value;
    localStorage.setItem('mermd-editor-visible', isEditorVisible.value.toString());
    nextTick(() => {
      autoResizeTextarea();
    });
  };

  const togglePreviewVisibility = () => {
    isPreviewVisible.value = !isPreviewVisible.value;
    localStorage.setItem('mermd-preview-visible', isPreviewVisible.value.toString());
    nextTick(() => {
      autoResizeTextarea();
    });
  };

  onMounted(() => {
    loadInitialState();
  });

  watch(markdownText, (newValue) => {
    saveToLocalStorage(newValue || '');
  }, { immediate: false }); // Set immediate to false, initial save handled by load or default

  // Watch for prop changes to update markdownText if necessary
  watch(initialMarkdownFromProps, (newVal) => {
    if (newVal && newVal !== markdownText.value) {
      markdownText.value = newVal;
    }
  });
  return {
    markdownText,
    isEditorVisible,
    isPreviewVisible,
    lastSaved,
    toggleEditorVisibility,
    togglePreviewVisibility,
    saveToLocalStorage,
    loadInitialState
  };
}
