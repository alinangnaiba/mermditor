import { ref, watch, onMounted, nextTick, type Ref } from 'vue';
import debounce from 'lodash/debounce';

export function useEditorStateAndPersistence(
  initialMarkdownFromProps: Ref<string | undefined>,
  defaultContent: string,
  autoResizeTextarea: () => void,
  showConfirmation?: (options: { title: string; message: string; confirmText?: string; cancelText?: string; type?: 'destructive' | 'informational' }) => Promise<boolean>
) {
  const markdownText = ref('');
  const isEditorVisible = ref(true);
  const isPreviewVisible = ref(true);
  const lastSaved = ref<string>('');
  const isAutosaveEnabled = ref(false);

  const saveToLocalStorage = debounce((content: string, force = false) => {
    // Only save if autosave is enabled or if it's a forced save
    if (!isAutosaveEnabled.value && !force) {
      return;
    }

    localStorage.setItem('mermd-content', content);
    localStorage.setItem('mermd-markdown-input', content);
    const now = new Date();
    lastSaved.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, 500);

  const toggleAutosave = async () => {
    // If currently enabled and user wants to disable, show confirmation
    if (isAutosaveEnabled.value) {
      let confirmed = false;
      
      if (showConfirmation) {
        // Use modern confirmation dialog
        confirmed = await showConfirmation({
          title: 'Disable Autosave',
          message: 'This will turn off autosave and delete your saved content.',
          confirmText: 'Disable',
          cancelText: 'Cancel'
        });
      } else {
        // Fallback to browser confirm (shouldn't happen in practice)
        confirmed = confirm(
          'Disabling autosave will delete all saved data from local storage. Do you want to continue?\n\nClick OK to disable autosave and delete data.\nClick Cancel to keep autosave enabled.'
        );
      }
      
      if (!confirmed) {
        return false; // User cancelled, don't change state
      }
      
      // User confirmed, disable autosave and clear data
      isAutosaveEnabled.value = false;
      
      // Remove autosave setting from localStorage (default is false, no need to store)
      localStorage.removeItem('mermd-autosave-enabled');
      
      // Clear saved content
      localStorage.removeItem('mermd-content');
      localStorage.removeItem('mermd-markdown-input');
      
      // Clear last saved timestamp
      lastSaved.value = '';
      
      return true; // Successfully disabled and cleared
    } else {
      // Enabling autosave - show GDPR-friendly confirmation
      let confirmed = false;
      
      if (showConfirmation) {
        // Use modern confirmation dialog
        confirmed = await showConfirmation({
          title: 'Enable Autosave',
          message: 'Your content will be saved to your browser\'s local storage only. No data is sent to any server.',
          confirmText: 'Enable Autosave',
          cancelText: 'Cancel',
          type: 'informational'
        });
      } else {
        // Fallback to browser confirm (shouldn't happen in practice)
        confirmed = confirm(
          'Enable autosave? Your content will be saved to your browser\'s local storage only. No data is sent to any server.'
        );
      }
      
      if (!confirmed) {
        return false; // User cancelled, don't change state
      }
      
      // User confirmed, enable autosave
      isAutosaveEnabled.value = true;
      localStorage.setItem('mermd-autosave-enabled', 'true');
      
      // If we have content, save it immediately
      if (markdownText.value) {
        saveToLocalStorage(markdownText.value, true);
      }
      
      return true; // Successfully enabled
    }
  };
  const loadInitialState = () => {
    // Load autosave preference (default to false - opt-in)
    const savedAutosave = localStorage.getItem('mermd-autosave-enabled');
    isAutosaveEnabled.value = savedAutosave === 'true';

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
      // Only load saved content if autosave was previously enabled
      // This ensures users don't get surprised by content appearing
      if (isAutosaveEnabled.value) {
        const savedMarkdown = localStorage.getItem('mermd-markdown-input');
        if (savedMarkdown) {
          markdownText.value = savedMarkdown;
        } else {
          markdownText.value = defaultContent;
        }
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
    // Only autosave if enabled - always pass false for force since this is automatic
    saveToLocalStorage(newValue || '', false);
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
    isAutosaveEnabled,
    toggleEditorVisibility,
    togglePreviewVisibility,
    toggleAutosave,
    saveToLocalStorage,
    loadInitialState
  };
}
