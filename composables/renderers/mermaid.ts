import { createApp } from 'vue';
import MermaidRenderer from '~/components/MermaidRenderer.vue';
import type { ComponentRenderer, RenderedComponent } from '~/types/markdown-renderer';

export function createMermaidRenderer(
  cache: Map<string, RenderedComponent>,
  renderedMermaidElements: Map<string, HTMLElement>
): ComponentRenderer {
  return {
    name: 'mermaid',
    selector: '.mermaid-placeholder',
    strategy: 'debounced',
    debounceMs: 100,
    cache,
    render: (element: Element, index: number) => {
      const mermaidCode = decodeURIComponent(element.getAttribute('data-mermaid-code') || '');
      if (!mermaidCode) return;

      const positionKey = `mermaid-${index}`;

      if (cache.has(positionKey)) {
        const cached = cache.get(positionKey)!;
        cached.app.unmount();
        cache.delete(positionKey);
      }

      const container = document.createElement('div');
      container.setAttribute('data-mermaid-position', positionKey);
      element.replaceWith(container);

      const app = createApp(MermaidRenderer, {
        code: mermaidCode,
        idSuffix: `${index}-${Date.now()}`,
      });
      app.mount(container);

      cache.set(positionKey, {
        app,
        container,
        content: mermaidCode
      });

      renderedMermaidElements.set(positionKey, container);
    }
  };
}
