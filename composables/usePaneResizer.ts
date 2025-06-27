import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';

export function usePaneResizer(
  mainScrollContainerRef: Ref<HTMLElement | null>,
  isEditorVisible: Ref<boolean>,
  isPreviewVisible: Ref<boolean>
) {
  const editorWidthPercent = ref(50);
  const isDragging = ref(false);
  const previewWidthPercent = computed(() => {
    if (!isEditorVisible.value && !isPreviewVisible.value) {
      // Both hidden - shouldn't happen, but default to showing both
      return 50;
    } else if (!isEditorVisible.value) {
      // Only preview visible
      return 100;
    } else if (!isPreviewVisible.value) {
      // Only editor visible
      return 0;
    } else {
      // Both visible
      return 100 - editorWidthPercent.value;
    }
  });

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !mainScrollContainerRef.value) return;

    e.preventDefault();

    const containerRect = mainScrollContainerRef.value.getBoundingClientRect();
    const containerWidth = containerRect.width;

    let clientX: number;
    if (e.type.startsWith('touch')) {
      clientX = (e as TouchEvent).touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }

    const editorWidth = clientX - containerRect.left;
    const percentage = Math.min(Math.max((editorWidth / containerWidth) * 100, 10), 90);
    editorWidthPercent.value = percentage;
  };

  const stopDrag = () => {
    if (!isDragging.value) return;
    isDragging.value = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    document.body.style.userSelect = '';
    localStorage.setItem('mermd-editor-width', editorWidthPercent.value.toString());
  };

  const startDrag = (_e: MouseEvent | TouchEvent) => {
    isDragging.value = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    document.body.style.userSelect = 'none';
  };

  onMounted(() => {
    const savedWidth = localStorage.getItem('mermd-editor-width');
    if (savedWidth) {
      editorWidthPercent.value = parseFloat(savedWidth);
    }
  });

  // Cleanup listeners on unmount, though stopDrag should handle most cases
  onBeforeUnmount(() => {
    if (isDragging.value) {
        stopDrag();
    }
  });

  return {
    editorWidthPercent,
    previewWidthPercent,
    startDrag,
  };
}
