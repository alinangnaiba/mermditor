/**
 * Data management composable for handling local storage data operations
 */
import { useToast } from '../useToast';

export function useDataManagement() {
  const { success, error } = useToast();

  /**
   * Clear all application data from local storage
   */
  const clearAllData = () => {
    try {
      // List of all keys used by the application
      const appKeys = [
        'mermd-content',
        'mermd-markdown-input',
        'mermd-editor-visible',
        'mermd-preview-visible',
        'mermd-autosave-enabled',
        'mermd-editor-width'  // Added missing editor width key
      ];

      // Remove each key
      appKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      success('All data cleared successfully');
      return true;
    } catch (err) {
      console.error('Failed to clear data:', err);
      error('Failed to clear data');
      return false;
    }
  };

  /**
   * Get storage information for the application
   */
  const getStorageInfo = () => {
    try {
      const appKeys = [
        'mermd-content',
        'mermd-markdown-input',
        'mermd-editor-visible',
        'mermd-preview-visible',
        'mermd-autosave-enabled',
        'mermd-editor-width'
      ];

      const storageData: Record<string, string> = {};
      let totalSize = 0;

      appKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) {
          storageData[key] = value;
          totalSize += value.length;
        }
      });

      return {
        data: storageData,
        totalSize,
        keys: Object.keys(storageData)
      };
    } catch (err) {
      console.error('Failed to get storage info:', err);
      return null;
    }
  };

  /**
   * Export all application data as JSON
   */
  const exportData = () => {
    try {
      const storageInfo = getStorageInfo();
      if (!storageInfo) {
        error('Failed to get storage data');
        return;
      }

      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: storageInfo.data
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `mermditor-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      success('Data exported successfully');
    } catch (err) {
      console.error('Failed to export data:', err);
      error('Failed to export data');
    }
  };

  return {
    clearAllData,
    getStorageInfo,
    exportData
  };
}
