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

  let mermaidRenderTimeoutId: ReturnType<typeof setTimeout> | undefined;
  
  const mermaidCache = new Map<string, RenderedComponent>();

  const renderMarkdown = async () => {
    if (!previewContainerRef.value) return;

    const html = md.render(markdownText.value || '');
    previewContainerRef.value.innerHTML = html;

    await nextTick();

    const activeMermaidPositions = new Set<string>();

    const mermaidPlaceholders = previewContainerRef.value.querySelectorAll('.mermaid-placeholder');
    
    mermaidPlaceholders.forEach((placeholder, index) => {
      const mermaidCode = decodeURIComponent(placeholder.getAttribute('data-mermaid-code') || '');
      if (!mermaidCode) return;

      const positionKey = `mermaid-${index}`;
      activeMermaidPositions.add(positionKey);

      if (mermaidCache.has(positionKey)) {
        const cached = mermaidCache.get(positionKey)!;
        
        // Compare content to see if it changed
        if (cached.content === mermaidCode) {
          // Content unchanged - reuse cached version
          const clonedContainer = cached.container.cloneNode(true) as HTMLElement;
          placeholder.replaceWith(clonedContainer);
          return;
        } else {
          // Content changed - invalidate cache
          cached.app.unmount();
          mermaidCache.delete(positionKey);
        }
      }

      // Render new content (first time or content changed)
      const container = document.createElement('div');
      placeholder.replaceWith(container);

      const app = createApp(MermaidRenderer, {
        code: mermaidCode,
        idSuffix: `${index}-${Date.now()}`,
      });
      app.mount(container);

      // Cache with position key and current content
      mermaidCache.set(positionKey, {
        app,
        container,
        content: mermaidCode
      });
    });

    const mathBlocks = previewContainerRef.value.querySelectorAll('.math-block');
    mathBlocks.forEach((mathElement, index) => {
      const mathCode = decodeURIComponent(mathElement.getAttribute('data-math') || '');
      if (!mathCode) return;

      const container = document.createElement('div');
      mathElement.replaceWith(container);

      const app = createApp(KatexRenderer, {
        code: mathCode,
        isBlock: true,
        idSuffix: `block-${index}-${Date.now()}`,
      });
      app.mount(container);
    });

    const mathInlines = previewContainerRef.value.querySelectorAll('.math-inline');
    mathInlines.forEach((mathElement, index) => {
      const mathCode = decodeURIComponent(mathElement.getAttribute('data-math') || '');
      if (!mathCode) return;

      const container = document.createElement('span');
      mathElement.replaceWith(container);

      const app = createApp(KatexRenderer, {
        code: mathCode,
        isBlock: false,
        idSuffix: `inline-${index}-${Date.now()}`,
      });
      app.mount(container);
    });

    // Clean up cache entries for Mermaid positions that no longer exist
    cleanupInactivePositions(mermaidCache, activeMermaidPositions);

    if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId);
    mermaidRenderTimeoutId = setTimeout(async () => {
      await autoResizeTextarea();
    }, 200);
  };

  const cleanupInactivePositions = (cache: Map<string, RenderedComponent>, activePositions: Set<string>) => {
    for (const [positionKey, cached] of cache.entries()) {
      if (!activePositions.has(positionKey)) {
        cached.app.unmount();
        cache.delete(positionKey);
      }
    }
  };

  const debouncedRenderMarkdown = debounce(renderMarkdown, 100);

  const preRenderMarkdown = async (): Promise<void> => {
    return new Promise((resolve) => {
      if (mermaidRenderTimeoutId) {
        clearTimeout(mermaidRenderTimeoutId);
      }

      mermaidRenderTimeoutId = setTimeout(async () => {
        await renderMarkdown();
        resolve();
      }, 0);
    });
  };

  const cleanup = () => {
    if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId);
    for (const cached of mermaidCache.values()) {
      cached.app.unmount();
    }
    mermaidCache.clear();
  };

  onUnmounted(() => {
    cleanup();
  });

  return {
    debouncedRenderMarkdown,
    preRenderMarkdown,
    cleanupMarkdownRenderer: cleanup,
  };
}
