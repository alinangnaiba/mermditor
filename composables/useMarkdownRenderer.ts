import { nextTick, type Ref, onUnmounted } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '~/utils/markdownItMermaid';
import { markdownItHighlight } from '~/utils/markdownItHighlight';
import { markdownItKatex } from '~/utils/markdownItKatex';
import debounce from 'lodash/debounce';

import type { ComponentRenderer, RenderedComponent } from '~/types/markdown-renderer';
import { createMermaidRenderer, createMathBlockRenderer, createMathInlineRenderer } from './renderers';
import { getMermaidChangeInfo } from './utils/mermaid-detection';

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

  // Helper functions for mermaid element preservation
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

  // Create component renderers using factory functions
  const componentRenderers: ComponentRenderer[] = [
    createMermaidRenderer(mermaidCache, renderedMermaidElements),
    createMathBlockRenderer(),
    createMathInlineRenderer()
  ];

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
    const changeInfo = getMermaidChangeInfo(currentText, lastMermaidBlocks);

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
