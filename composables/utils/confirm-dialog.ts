import { ref } from 'vue';

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'destructive' | 'informational';
}

export function useConfirmDialog() {
  const isVisible = ref(false);
  const currentOptions = ref<ConfirmationOptions>({
    title: '',
    message: ''
  });
  
  let resolvePromise: ((value: boolean) => void) | null = null;

  const showConfirmation = (options: ConfirmationOptions): Promise<boolean> => {
    currentOptions.value = {
      confirmText: 'OK',
      cancelText: 'Cancel',
      type: 'destructive',
      ...options
    };
    
    isVisible.value = true;

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  };

  const handleConfirm = () => {
    isVisible.value = false;
    if (resolvePromise) {
      resolvePromise(true);
      resolvePromise = null;
    }
  };

  const handleCancel = () => {
    isVisible.value = false;
    if (resolvePromise) {
      resolvePromise(false);
      resolvePromise = null;
    }
  };

  return {
    isVisible,
    currentOptions,
    showConfirmation,
    handleConfirm,
    handleCancel
  };
}
