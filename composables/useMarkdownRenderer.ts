import { nextTick, createApp, type Ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { markdownItMermaid } from '~/utils/markdownItMermaid';
import { markdownItHighlight } from '~/utils/markdownItHighlight';
import { markdownItKatex } from '~/utils/markdownItKatex';
import MermaidRenderer from '~/components/MermaidRenderer.vue';
import KatexRenderer from '~/components/KatexRenderer.vue';
import debounce from 'lodash/debounce';

export function useMarkdownRenderer(
  markdownText: Ref<string>,
  previewContainerRef: Ref<HTMLElement | null>,
  autoResizeTextarea: () => Promise<void>
) {
  const md = new MarkdownIt({
    highlight: null, // Disable built-in highlighting
    breaks: true,
  });

  md.use(markdownItHighlight);
  md.use(markdownItMermaid);
  md.use(markdownItKatex);

  let mermaidRenderTimeoutId: ReturnType<typeof setTimeout> | undefined;

  const renderMarkdown = async () => {
    if (!previewContainerRef.value) return;

    const html = md.render(markdownText.value || '');
    previewContainerRef.value.innerHTML = html;

    await nextTick();

    const mermaidPlaceholders = previewContainerRef.value.querySelectorAll('.mermaid-placeholder');

    mermaidPlaceholders.forEach((placeholder, index) => {
      const mermaidCode = decodeURIComponent(placeholder.getAttribute('data-mermaid-code') || '');
      if (!mermaidCode) return;

      const container = document.createElement('div');
      placeholder.replaceWith(container);

      const app = createApp(MermaidRenderer, {
        code: mermaidCode,
        idSuffix: `${index}-${Date.now()}`,
      });
      app.mount(container);
    });

    // Render KaTeX math expressions
    const mathBlocks = previewContainerRef.value.querySelectorAll('.math-block');
    const mathInlines = previewContainerRef.value.querySelectorAll('.math-inline');

    // Process block math
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

    // Process inline math
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

    if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId);
    mermaidRenderTimeoutId = setTimeout(async () => {
      await autoResizeTextarea();
    }, 200);
  };
  const debouncedRenderMarkdown = debounce(renderMarkdown, 150);

  // Function to pre-render content and return a promise when complete
  const preRenderMarkdown = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Clear any existing timeout
      if (mermaidRenderTimeoutId) {
        clearTimeout(mermaidRenderTimeoutId);
      }

      // Start immediate rendering
      mermaidRenderTimeoutId = setTimeout(async () => {
        await renderMarkdown();
        resolve();
      }, 0);
    });
  };

  const cleanup = () => {
    if (mermaidRenderTimeoutId) clearTimeout(mermaidRenderTimeoutId);
  };

  return {
    debouncedRenderMarkdown,
    preRenderMarkdown,
    cleanupMarkdownRenderer: cleanup,
  };
}
