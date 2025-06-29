import { ref } from 'vue';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const toasts = ref<Toast[]>([]);
const toastDuration = 3000;

export function useToast() {
  const addToast = (message: string, type: Toast['type'] = 'info', duration = toastDuration) => {
    const id = Math.random().toString(36).slice(2, 11);
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };

    toasts.value.push(toast);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, duration?: number) => addToast(message, 'success', duration);
  const error = (message: string, duration?: number) => addToast(message, 'error', duration);
  const info = (message: string, duration?: number) => addToast(message, 'info', duration);
  const warning = (message: string, duration?: number) => addToast(message, 'warning', duration);

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  };
}
