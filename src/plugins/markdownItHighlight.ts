import type MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

/**
 * Custom markdown-it plugin for code highlighting
 * This plugin highlights code blocks using highlight.js
 */
export function markdownItHighlight(md: MarkdownIt) {
  // Save the original renderer
  const originalFence = md.renderer.rules.fence!.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const langName = token.info.trim();
    
    // Skip highlighting for mermaid diagrams, they'll be handled by the mermaid plugin
    if (langName === 'mermaid') {
      return originalFence(tokens, idx, options, env, self);
    }

    // Get the language if specified
    let highlighted;
    
    if (langName && hljs.getLanguage(langName)) {
      try {
        highlighted = hljs.highlight(token.content, { language: langName, ignoreIllegals: true }).value;
      } catch (err) {
        console.error('Highlight.js error:', err);
      }
    }

    // Fallback to auto-detection or simple escaping
    if (!highlighted) {
      try {
        highlighted = hljs.highlightAuto(token.content).value;
      } catch (err) {
        highlighted = md.utils.escapeHtml(token.content);
      }
    }

    return `<pre class="hljs"><code class="language-${langName}">${highlighted}</code></pre>`;
  };
}
