import { ref, nextTick, watch, type Ref, onMounted, onBeforeUnmount } from 'vue'; // Added onMounted and onBeforeUnmount

export function useTextareaSizing(
  textareaRef: Ref<HTMLTextAreaElement | null>,
  previewPaneRef: Ref<HTMLElement | null>,
  mainScrollContainerRef: Ref<HTMLElement | null>,
  previewContainerRef: Ref<HTMLElement | null>,
  isEditorVisible: Ref<boolean>
) {
  const autoResizeTextarea = async () => {
    if (
      textareaRef.value &&
      previewPaneRef.value &&
      mainScrollContainerRef.value &&
      previewContainerRef.value &&
      isEditorVisible.value
    ) {
      // Reset heights to auto to allow scrollHeight to be calculated correctly
      textareaRef.value.style.height = 'auto';
      previewPaneRef.value.style.height = 'auto';

      await nextTick(); // Wait for DOM to update with auto heights

      const scrollContainerHeight = mainScrollContainerRef.value.clientHeight;
      
      const textareaScrollHeight = textareaRef.value.scrollHeight;
      const previewContentScrollHeight = previewContainerRef.value.scrollHeight;
      
      const minPixelHeight = 80; // Minimum height for each pane's content
      
      const requiredTextareaHeight = Math.max(textareaScrollHeight, minPixelHeight);
      const requiredPreviewHeight = Math.max(previewContentScrollHeight, minPixelHeight);
      
      const maxContentHeight = Math.max(requiredTextareaHeight, requiredPreviewHeight);
      
      const finalNewHeight = Math.max(maxContentHeight, scrollContainerHeight);

      textareaRef.value.style.height = `${finalNewHeight}px`;
      previewPaneRef.value.style.height = `${finalNewHeight}px`;
    } else if (textareaRef.value && !isEditorVisible.value && previewPaneRef.value && mainScrollContainerRef.value && previewContainerRef.value) {
      // Handle case where editor is not visible, preview should take full height or respect container
      previewPaneRef.value.style.height = 'auto';
      await nextTick();
      const scrollContainerHeight = mainScrollContainerRef.value.clientHeight;
      const previewContentScrollHeight = previewContainerRef.value.scrollHeight; // previewContainerRef should be valid here
      const finalNewHeight = Math.max(previewContentScrollHeight, scrollContainerHeight, 80);
      previewPaneRef.value.style.height = `${finalNewHeight}px`;
      textareaRef.value.style.height = 'auto'; // Ensure textarea height is reset if it was previously set
    }
  };

  watch([isEditorVisible], () => {
    nextTick(() => {
        autoResizeTextarea();
    });
  }, { immediate: true });

  // Watch for changes that might affect sizing and trigger resize
  // Removed deep: true as it might be too aggressive and cause performance issues.
  // Specific refs changing should be enough.
  watch([textareaRef, previewPaneRef, mainScrollContainerRef, previewContainerRef], autoResizeTextarea, { immediate: false });
  
  const handleWindowResize = () => autoResizeTextarea();

  onMounted(() => {
    window.addEventListener('resize', handleWindowResize);
    autoResizeTextarea(); // Initial call
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleWindowResize);
  });

  return {
    autoResizeTextarea,
  };
}
