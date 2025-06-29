import type { Ref } from 'vue';

export interface FileOperationsOptions {
  markdownText: Ref<string>;
  onImportSuccess?: (filename: string) => void;
  onSaveSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useFileOperations(options: FileOperationsOptions) {
  const { markdownText, onImportSuccess, onSaveSuccess, onError } = options;

  const generateFilename = (content: string): string => {
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      return headingMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '.md';
    }
    
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[T:]/g, '-');
    return `markdown-${timestamp}.md`;
  };

  // Save file function with modern File System Access API + fallback
  const saveFile = async (): Promise<void> => {
    if (!markdownText.value || markdownText.value.trim() === '') {
      onError?.('Nothing to save');
      return;
    }

    const filename = generateFilename(markdownText.value);
    const content = markdownText.value;

    try {
      // Try modern File System Access API first
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as unknown as {
          showSaveFilePicker: (options: {
            suggestedName: string;
            types: Array<{
              description: string;
              accept: Record<string, string[]>;
            }>;
          }) => Promise<{
            createWritable: () => Promise<{
              write: (content: string) => Promise<void>;
              close: () => Promise<void>;
            }>;
          }>;
        }).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Markdown files',
            accept: { 'text/markdown': ['.md', '.markdown'] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        
        onSaveSuccess?.();
      } else {
        // Fallback for browsers without File System Access API
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        onSaveSuccess?.();
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Failed to save file:', err);
      onError?.('Failed to save file');
    }
  };

  const importFile = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,.txt';
    input.style.display = 'none';
    
    input.addEventListener('change', async (event) => {
      await handleFileSelect(event);
      document.body.removeChild(input);
    });
    
    document.body.appendChild(input);
    input.click();
  };

  const handleFileSelect = async (event: Event): Promise<void> => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    if (!file.name.match(/\.(md|markdown|txt)$/i)) {
      onError?.('Please select a markdown file (.md, .markdown, or .txt)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('File is too large. Maximum size is 10MB.');
      return;
    }

    try {
      const content = await file.text();
      markdownText.value = content;
      
      onImportSuccess?.(file.name);
    } catch (err) {
      console.error('Failed to read file:', err);
      onError?.('Failed to read file');
    }
  };

  return {
    saveFile,
    importFile,
    generateFilename
  };
}
