import { createApp } from 'vue';
import KatexRenderer from '~/components/KatexRenderer.vue';
import type { ComponentRenderer } from '~/types/markdown-renderer';

export function createMathBlockRenderer(): ComponentRenderer {
  return {
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
}

export function createMathInlineRenderer(): ComponentRenderer {
  return {
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
}
