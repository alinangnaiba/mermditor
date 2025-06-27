import { nextTick, createApp, type Ref, type App, onUnmounted } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '~/utils/markdownItMermaid';
import { markdownItHighlight } from '~/utils/markdownItHighlight';
import { markdownItKatex } from '~/utils/markdownItKatex';
import MermaidRenderer from '~/components/MermaidRenderer.vue';
import KatexRenderer from '~/components/KatexRenderer.vue';
import debounce from 'lodash/debounce';

interface RenderedComponent {
  app: App;
  container: HTMLElement;
  content: string;
}

interface ComponentRenderer {
  name: string;
  selector: string;
  render: (element: Element, index: number) => void;
  strategy: 'immediate' | 'debounced';
  debounceMs?: number;
  cache?: Map<string, RenderedComponent>; // Optional cache for position-based caching
}

export function useMarkdownRenderer(
  markdownText: Ref<string>,
  previewContainerRef: Ref<HTMLElement | null>,
  autoResizeTextarea: () => Promise<void>
) {
  const md = new MarkdownIt({
    highlight: null,
    breaks: true,
  });

  md.use(markdownItHighlight);
  md.use(markdownItMermaid);
  md.use(markdownItKatex);

  const mermaidCache = new Map<string, RenderedComponent>();
  let lastMermaidBlocks: string[] = [];
  const renderedMermaidElements = new Map<string, HTMLElement>();

  // Extract mermaid blocks from markdown text
  const extractMermaidBlocks = (text: string): string[] => {
    const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
    const blocks: string[] = [];
    let match;
    while ((match = mermaidRegex.exec(text)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  };

  const getMermaidChangeInfo = (newText: string) => {
    const newMermaidBlocks = extractMermaidBlocks(newText);
    const unchangedPositions = new Set<string>();
    
    newMermaidBlocks.forEach((block, index) => {
      const positionKey = `mermaid-${index}`;
      if (index < lastMermaidBlocks.length && lastMermaidBlocks[index] === block) {
        unchangedPositions.add(positionKey);
      }
    });
    
    const mermaidChanged = JSON.stringify(newMermaidBlocks) !== JSON.stringify(lastMermaidBlocks);
    
    return {
      mermaidChanged,
      newMermaidBlocks,
      unchangedPositions
    };
  };

  const preserveMermaidElements = () => {
    if (!previewContainerRef.value) return;
    
    const mermaidContainers = previewContainerRef.value.querySelectorAll('[data-mermaid-position]');
    mermaidContainers.forEach((container) => {
      const position = container.getAttribute('data-mermaid-position');
      if (position) {
        renderedMermaidElements.set(position, container.cloneNode(true) as HTMLElement);
      }
    });
  };

  const restoreMermaidElements = (unchangedPositions: Set<string>) => {
    if (!previewContainerRef.value) return;
    
    const placeholders = previewContainerRef.value.querySelectorAll('.mermaid-placeholder');
    placeholders.forEach((placeholder, index) => {
      const positionKey = `mermaid-${index}`;
      
      if (unchangedPositions.has(positionKey) && renderedMermaidElements.has(positionKey)) {
        const preservedElement = renderedMermaidElements.get(positionKey)!;
        placeholder.replaceWith(preservedElement);
      }
    });
  };

  // Component renderers registry with metadata-driven strategies
  const mermaidRenderer: ComponentRenderer = {
    name: 'mermaid',
    selector: '.mermaid-placeholder',
    strategy: 'debounced',
    debounceMs: 100,
    cache: mermaidCache,
    render: (element: Element, index: number) => {
      const mermaidCode = decodeURIComponent(element.getAttribute('data-mermaid-code') || '');
      if (!mermaidCode) return;

      const positionKey = `mermaid-${index}`;
      
      // If we reach here, content has changed - invalidate cache if exists
      if (mermaidCache.has(positionKey)) {
        const cached = mermaidCache.get(positionKey)!;
        cached.app.unmount();
        mermaidCache.delete(positionKey);
      }

      // Render new content
      const container = document.createElement('div');
      container.setAttribute('data-mermaid-position', positionKey); // Add position identifier
      element.replaceWith(container);

      const app = createApp(MermaidRenderer, {
        code: mermaidCode,
        idSuffix: `${index}-${Date.now()}`,
      });
      app.mount(container);

      // Cache the rendered component
      mermaidCache.set(positionKey, {
        app,
        container,
        content: mermaidCode
      });
      
      // Also update our preserved elements map
      renderedMermaidElements.set(positionKey, container);
    }
  };

  const mathBlockRenderer: ComponentRenderer = {
    name: 'math-block',
    selector: '.math-block',
    strategy: 'immediate',
    render: (element: Element, index: number) => {
      const mathCode = decodeURIComponent(element.getAttribute('data-math') || '');
      if (!mathCode) return;

      const container = document.createElement('div');
      element.replaceWith(container);

      const app = createApp(KatexRenderer, {
        code: mathCode,
        isBlock: true,
        idSuffix: `block-${index}-${Date.now()}`,
      });
      app.mount(container);
    }
  };

  const mathInlineRenderer: ComponentRenderer = {
    name: 'math-inline',
    selector: '.math-inline',
    strategy: 'immediate',
    render: (element: Element, index: number) => {
      const mathCode = decodeURIComponent(element.getAttribute('data-math') || '');
      if (!mathCode) return;

      const container = document.createElement('span');
      element.replaceWith(container);

      const app = createApp(KatexRenderer, {
        code: mathCode,
        isBlock: false,
        idSuffix: `inline-${index}-${Date.now()}`,
      });
      app.mount(container);
    }
  };

  // Registry of all component renderers - easily extensible
  const componentRenderers = [mermaidRenderer, mathBlockRenderer, mathInlineRenderer];

  // Create debounced functions for each debounced renderer
  const debouncedRenderFunctions = new Map<string, () => void>();
  
  componentRenderers
    .filter(r => r.strategy === 'debounced')
    .forEach(renderer => {
      const debouncedFn = debounce(() => {
        renderSingleComponent(renderer);
      }, renderer.debounceMs || 100);
      
      debouncedRenderFunctions.set(renderer.name, debouncedFn);
    });

  const renderSingleComponent = (renderer: ComponentRenderer) => {
    if (!previewContainerRef.value) return;
    
    const elements = previewContainerRef.value.querySelectorAll(renderer.selector);
    const activePositions = new Set<string>();

    elements.forEach((element, index) => {
      const positionKey = `${renderer.name}-${index}`;
      
      // Track active positions for cache cleanup
      if (renderer.cache) {
        activePositions.add(positionKey);
        
        // Check if content has changed before rendering
        const contentAttr = element.getAttribute('data-mermaid-code') || element.getAttribute('data-math') || '';
        const currentContent = decodeURIComponent(contentAttr);
        
        if (renderer.cache.has(positionKey)) {
          const cached = renderer.cache.get(positionKey)!;
          if (cached.content === currentContent) {
            // Content unchanged - skip rendering entirely to avoid flicker
            return;
          }
        }
      }
      
      // Only render if content changed or no cache exists
      renderer.render(element, index);
    });

    // Clean up inactive cache entries
    if (renderer.cache) {
      cleanupInactivePositions(renderer.cache, activePositions);
    }
  };

  const cleanupInactivePositions = (cache: Map<string, RenderedComponent>, activePositions: Set<string>) => {
    for (const [positionKey, cached] of cache.entries()) {
      if (!activePositions.has(positionKey)) {
        cached.app.unmount();
        cache.delete(positionKey);
      }
    }
  };

  const renderImmediate = () => {
    const immediateRenderers = componentRenderers.filter(r => r.strategy === 'immediate');
    immediateRenderers.forEach(renderSingleComponent);
  };

  // Main render function - smart change detection to prevent unnecessary flickering
  const renderMarkdown = async () => {
    if (!previewContainerRef.value) return;

    const currentText = markdownText.value || '';
    const changeInfo = getMermaidChangeInfo(currentText);

    // Preserve existing mermaid elements before re-rendering HTML
    preserveMermaidElements();

    // Always re-render the HTML (this is fast and handles markdown/katex changes)
    const html = md.render(currentText);
    previewContainerRef.value.innerHTML = html;

    await nextTick();

    // Restore unchanged mermaid elements to prevent flicker
    restoreMermaidElements(changeInfo.unchangedPositions);

    // Always render immediate components (KaTeX) as they don't flicker and are fast
    renderImmediate();

    // Only render changed mermaid components
    if (changeInfo.mermaidChanged) {
      // Only render mermaid components that actually changed
      const debouncedRenderers = componentRenderers.filter(r => r.strategy === 'debounced');
      debouncedRenderers.forEach(renderer => {
        const debouncedFn = debouncedRenderFunctions.get(renderer.name);
        if (debouncedFn) {
          debouncedFn();
        }
      });
    }

    // Update tracking variables
    lastMermaidBlocks = changeInfo.newMermaidBlocks;

    // Auto-resize textarea after a brief delay for final layout
    setTimeout(async () => {
      await autoResizeTextarea();
    }, 150);
  };

  const cleanup = () => {
    // Clear all caches and unmount components
    componentRenderers.forEach(renderer => {
      if (renderer.cache) {
        for (const cached of renderer.cache.values()) {
          cached.app.unmount();
        }
        renderer.cache.clear();
      }
    });
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    renderMarkdown,
    cleanupMarkdownRenderer: cleanup,
  };
}
