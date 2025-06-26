import { nextTick, watch, type Ref, onMounted, onBeforeUnmount } from 'vue';

export function useTextareaSizing(
  textareaRef: Ref<HTMLTextAreaElement | null>,
  previewPaneRef: Ref<HTMLElement | null>,
  mainScrollContainerRef: Ref<HTMLElement | null>,
  previewContainerRef: Ref<HTMLElement | null>,
  isEditorVisible: Ref<boolean>,
  isPreviewVisible: Ref<boolean>
) {
  const autoResizeTextarea = async () => {
    if (!textareaRef.value || !mainScrollContainerRef.value) return;

    if (isEditorVisible.value && isPreviewVisible.value) {
      // Both panes visible - sync heights
      textareaRef.value.style.height = 'auto';
      if (previewPaneRef.value) {
        previewPaneRef.value.style.height = 'auto';
      }

      await nextTick();

      const scrollContainerHeight = mainScrollContainerRef.value.clientHeight;
      const textareaScrollHeight = textareaRef.value.scrollHeight;
      
      let previewContentScrollHeight = 0;
      if (previewContainerRef.value) {
        previewContentScrollHeight = previewContainerRef.value.scrollHeight;
      }
      
      const minPixelHeight = 80;
      const requiredTextareaHeight = Math.max(textareaScrollHeight, minPixelHeight);
      const requiredPreviewHeight = Math.max(previewContentScrollHeight, minPixelHeight);
      const maxContentHeight = Math.max(requiredTextareaHeight, requiredPreviewHeight);
      const finalNewHeight = Math.max(maxContentHeight, scrollContainerHeight);

      textareaRef.value.style.height = `${finalNewHeight}px`;
      if (previewPaneRef.value) {
        previewPaneRef.value.style.height = `${finalNewHeight}px`;
      }
    } else if (!isEditorVisible.value && isPreviewVisible.value && previewPaneRef.value && previewContainerRef.value) {
      // Only preview visible
      previewPaneRef.value.style.height = 'auto';
      await nextTick();
      const scrollContainerHeight = mainScrollContainerRef.value.clientHeight;
      const previewContentScrollHeight = previewContainerRef.value.scrollHeight;
      const finalNewHeight = Math.max(previewContentScrollHeight, scrollContainerHeight, 80);
      previewPaneRef.value.style.height = `${finalNewHeight}px`;
      textareaRef.value.style.height = 'auto';
    } else if (isEditorVisible.value && !isPreviewVisible.value) {
      // Only editor visible
      textareaRef.value.style.height = 'auto';
      await nextTick();
      const scrollContainerHeight = mainScrollContainerRef.value.clientHeight;
      const textareaScrollHeight = textareaRef.value.scrollHeight;
      const finalNewHeight = Math.max(textareaScrollHeight, scrollContainerHeight, 80);
      textareaRef.value.style.height = `${finalNewHeight}px`;
    }
  };

  watch([isEditorVisible, isPreviewVisible], () => {
    nextTick(() => {
        autoResizeTextarea();
    });
  }, { immediate: true });

  // Watch for changes that might affect sizing and trigger resize
  // Removed deep: true as it might be too aggressive and cause performance issues.
  // Specific refs changing should be enough.
  watch([textareaRef, previewPaneRef], autoResizeTextarea, { immediate: false });
  
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
