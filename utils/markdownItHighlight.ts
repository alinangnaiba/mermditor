import type MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

/**
 * Custom markdown-it plugin for code highlighting
 * This plugin highlights code blocks using highlight.js
 */

let hljsMarkedAsLoaded = false;
export function markdownItHighlight(md: MarkdownIt) {
  const originalFence = md.renderer.rules.fence!.bind(md.renderer.rules);
  if (!hljsMarkedAsLoaded && typeof window !== 'undefined') {
    hljsMarkedAsLoaded = true;
    setTimeout(() => {
      try {
        const nuxtApp = (window as any)?.__nuxtApp || (window as any)?.$nuxt;
        if (nuxtApp?.$loading?.setResourceLoaded) {
          nuxtApp.$loading.setResourceLoaded('hljs');
        }
      } catch (err) {
        console.error('Error updating hljs loading state:', err);
      }
    }, 0);
  }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const langName = token.info.trim();
    
    if (langName === 'mermaid') {
      return originalFence(tokens, idx, options, env, self);
    }

    let highlighted;
    
    if (langName && hljs.getLanguage(langName)) {
      try {
        highlighted = hljs.highlight(token.content, { language: langName, ignoreIllegals: true }).value;
      } catch (err) {
        console.error('Highlight.js error:', err);
      }
    }

    if (!highlighted) {
      try {
        highlighted = hljs.highlightAuto(token.content).value;
      } catch {
        highlighted = md.utils.escapeHtml(token.content);
      }
    }

    return `<pre class="hljs"><code class="language-${langName}">${highlighted}</code></pre>`;
  };
}
